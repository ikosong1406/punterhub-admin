import { useState, useEffect } from "react";
import {
  FaFilter,
  FaCheckCircle,
  FaTimesCircle,
  FaChevronDown,
  FaChevronUp,
  FaSearch,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import axios from "axios";
import Api from "../components/Api";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const colors = {
    black: "#09100d",
    gray: "#162821",
    orange: "#fea92a",
    purple: "#855391",
    lightGray: "#376553",
    white: "#efefef",
    pink: "#f57cff",
    blue: "#18ffc8",
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsFilterOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${Api}/admin/getTransactions`);
        setTransactions(response.data.data);
        setFilteredTransactions(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  useEffect(() => {
    let result = [...transactions];

    if (filterStatus !== "all") {
      result = result.filter(
        (transaction) => transaction.status === filterStatus
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (transaction) =>
          (transaction.description &&
            transaction.description.toLowerCase().includes(term)) ||
          (transaction.merchant &&
            transaction.merchant.toLowerCase().includes(term)) ||
          (transaction.category &&
            transaction.category.toLowerCase().includes(term)) ||
          transaction.amount.toString().includes(term)
      );
    }

    // Sort transactions
    if (sortBy === "date") {
      result.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
    } else if (sortBy === "amount") {
      result.sort((a, b) =>
        sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount
      );
    }

    setFilteredTransactions(result);
  }, [transactions, filterStatus, sortBy, sortOrder, searchTerm]);

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
    setUpdateError(null);
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedTransaction || isUpdating) return;

    setIsUpdating(true);
    setUpdateError(null);

    try {
      // ✅ API call to update the transaction status
      await axios.post(`${Api}/admin/transactionStatus`, {
        id: selectedTransaction._id,
        status: newStatus,
      });

      // ✅ Optimistically update the UI
      const updatedTransactions = transactions.map((transaction) =>
        transaction._id === selectedTransaction._id
          ? { ...transaction, status: newStatus }
          : transaction
      );
      setTransactions(updatedTransactions);
      setSelectedTransaction({ ...selectedTransaction, status: newStatus });
      closeModal();
    } catch (err) {
      console.error("Failed to update transaction status:", err);
      setUpdateError("Failed to update status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      // ✅ Set default sort order for date to 'desc' (newest first)
      setSortOrder(field === "date" ? "desc" : "asc");
    }
  };

  const toggleFilterMenu = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return colors.blue;
      case "pending":
        return colors.orange;
      case "failed":
        return colors.pink;
      default:
        return colors.white;
    }
  };

  return (
    <div
      style={{ backgroundColor: colors.black }}
      className="min-h-screen text-white p-4 md:p-6"
    >
      <div className="max-w-6xl mx-auto">
        <h1
          style={{ color: colors.orange }}
          className="text-2xl md:text-3xl font-bold mb-2"
        >
          Transaction History
        </h1>
        <p style={{ color: colors.lightGray }} className="mb-6 md:mb-8">
          View and manage all your transactions
        </p>

        <div className="md:hidden flex justify-between items-center mb-4">
          <div className="relative w-full mr-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch style={{ color: colors.lightGray }} />
            </div>
            <input
              type="text"
              placeholder="Search transactions..."
              style={{ backgroundColor: colors.lightGray, color: colors.white }}
              className="pl-10 pr-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={toggleFilterMenu}
            style={{ backgroundColor: colors.gray }}
            className="ml-2 p-2 rounded-lg"
          >
            {isFilterOpen ? (
              <FaTimes style={{ color: colors.white }} />
            ) : (
              <FaBars style={{ color: colors.white }} />
            )}
          </button>
        </div>

        <div
          style={{ backgroundColor: colors.gray }}
          className={`rounded-lg p-4 mb-6 ${
            isMobile ? (isFilterOpen ? "block" : "hidden") : "block"
          }`}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 mb-2 md:mb-0">
                <FaFilter style={{ color: colors.blue }} />
                <span style={{ color: colors.lightGray }}>Filter by:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1 rounded-full text-sm`}
                  style={{
                    backgroundColor:
                      filterStatus === "all" ? colors.blue : colors.lightGray,
                    color: filterStatus === "all" ? colors.black : colors.white,
                  }}
                  onClick={() => setFilterStatus("all")}
                >
                  All
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm`}
                  style={{
                    backgroundColor:
                      filterStatus === "pending"
                        ? colors.orange
                        : colors.lightGray,
                    color:
                      filterStatus === "pending" ? colors.black : colors.white,
                  }}
                  onClick={() => setFilterStatus("pending")}
                >
                  Pending
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm`}
                  style={{
                    backgroundColor:
                      filterStatus === "completed"
                        ? colors.blue
                        : colors.lightGray,
                    color:
                      filterStatus === "completed"
                        ? colors.black
                        : colors.white,
                  }}
                  onClick={() => setFilterStatus("completed")}
                >
                  Completed
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm`}
                  style={{
                    backgroundColor:
                      filterStatus === "failed"
                        ? colors.pink
                        : colors.lightGray,
                    color:
                      filterStatus === "failed" ? colors.black : colors.white,
                  }}
                  onClick={() => setFilterStatus("failed")}
                >
                  Failed
                </button>
              </div>
            </div>

            <div className="hidden md:block relative w-full md:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch style={{ color: colors.lightGray }} />
              </div>
              <input
                type="text"
                placeholder="Search transactions..."
                style={{
                  backgroundColor: colors.lightGray,
                  color: colors.white,
                }}
                className="pl-10 pr-4 py-2 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4 md:hidden">
            <div className="flex items-center gap-2 mb-2">
              <span style={{ color: colors.lightGray }}>Sort by:</span>
            </div>
            <div className="flex gap-2">
              <button
                style={{
                  backgroundColor:
                    sortBy === "date" ? colors.purple : colors.lightGray,
                  color: colors.white,
                }}
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1`}
                onClick={() => toggleSort("date")}
              >
                Date{" "}
                {sortBy === "date" &&
                  (sortOrder === "asc" ? (
                    <FaChevronUp className="ml-1" />
                  ) : (
                    <FaChevronDown className="ml-1" />
                  ))}
              </button>
              <button
                style={{
                  backgroundColor:
                    sortBy === "amount" ? colors.purple : colors.lightGray,
                  color: colors.white,
                }}
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1`}
                onClick={() => toggleSort("amount")}
              >
                Amount{" "}
                {sortBy === "amount" &&
                  (sortOrder === "asc" ? (
                    <FaChevronUp className="ml-1" />
                  ) : (
                    <FaChevronDown className="ml-1" />
                  ))}
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center" style={{ color: colors.lightGray }}>
            Loading transactions...
          </div>
        ) : error ? (
          <div className="p-8 text-center" style={{ color: colors.pink }}>
            Error: {error}
          </div>
        ) : (
          <div
            style={{ backgroundColor: colors.gray }}
            className="rounded-lg overflow-hidden"
          >
            {/* Mobile list */}
            {isMobile ? (
              <div
                className="divide-y"
                style={{ borderColor: colors.lightGray }}
              >
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <div
                      key={transaction._id}
                      className="p-4 cursor-pointer transition-colors"
                      onClick={() => handleTransactionClick(transaction)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3
                            className="font-medium"
                            style={{ color: colors.white }}
                          >
                            {transaction.description || transaction.type}
                          </h3>
                          <p
                            className="text-xs mt-1"
                            style={{ color: colors.lightGray }}
                          >
                            {formatDate(transaction.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className="font-semibold"
                            style={{
                              color: getStatusColor(transaction.status),
                            }}
                          >
                            ${transaction.amount.toFixed(1)}
                          </p>
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs mt-1`}
                            style={{
                              backgroundColor: getStatusColor(
                                transaction.status
                              ),
                              color: colors.black,
                            }}
                          >
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <span
                          className="text-xs px-2 py-1 rounded"
                          style={{
                            backgroundColor: colors.black,
                            color: colors.lightGray,
                          }}
                        >
                          {transaction.type}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <p style={{ color: colors.lightGray }}>
                      No transactions found
                    </p>
                  </div>
                )}
              </div>
            ) : (
              // Desktop table
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: colors.lightGray }}>
                      <th
                        className="px-4 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                        onClick={() => toggleSort("date")}
                        style={{ color: colors.white }}
                      >
                        <div className="flex items-center">
                          <span>Date</span>
                          {sortBy === "date" &&
                            (sortOrder === "asc" ? (
                              <FaChevronUp className="ml-1" />
                            ) : (
                              <FaChevronDown className="ml-1" />
                            ))}
                        </div>
                      </th>
                      <th
                        className="px-4 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        style={{ color: colors.white }}
                      >
                        Description
                      </th>
                      <th
                        className="px-4 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        style={{ color: colors.white }}
                      >
                        Merchant/User
                      </th>
                      <th
                        className="px-4 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        style={{ color: colors.white }}
                      >
                        Type
                      </th>
                      <th
                        className="px-4 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                        onClick={() => toggleSort("amount")}
                      >
                        <div
                          className="flex items-center"
                          style={{ color: colors.white }}
                        >
                          <span>Amount</span>
                          {sortBy === "amount" &&
                            (sortOrder === "asc" ? (
                              <FaChevronUp className="ml-1" />
                            ) : (
                              <FaChevronDown className="ml-1" />
                            ))}
                        </div>
                      </th>
                      <th
                        className="px-4 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        style={{ color: colors.white }}
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className="divide-y"
                    style={{ borderColor: colors.gray }}
                  >
                    {filteredTransactions.map((transaction) => (
                      <tr
                        key={transaction._id}
                        className="cursor-pointer transition-colors"
                        onClick={() => handleTransactionClick(transaction)}
                      >
                        <td
                          className="px-4 md:px-6 py-4 whitespace-nowrap"
                          style={{ color: colors.white }}
                        >
                          {formatDate(transaction.createdAt)}
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <div
                            className="text-sm font-medium"
                            style={{ color: colors.white }}
                          >
                            {transaction.description || transaction.type}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <div
                            className="text-sm"
                            style={{ color: colors.lightGray }}
                          >
                            {transaction.merchant || transaction.user}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <span
                            className="px-2 py-1 text-xs rounded-full"
                            style={{
                              backgroundColor: colors.black,
                              color: colors.lightGray,
                            }}
                          >
                            {transaction.type}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <div
                            className="text-sm font-medium"
                            style={{ color: colors.white }}
                          >
                            ${transaction.amount.toFixed(1)}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full`}
                            style={{
                              backgroundColor: getStatusColor(
                                transaction.status
                              ),
                              color: colors.black,
                            }}
                          >
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && selectedTransaction && (
          <div
            className="fixed inset-0 z-50 overflow-y-auto"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
          >
            <div className="flex items-center justify-center min-h-screen">
              <div
                className="relative w-full mx-4 my-8 p-6 rounded-3xl shadow-2xl"
                style={{
                  border: `4px solid ${colors.gray}`,
                  backgroundColor: colors.gray,
                }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2
                    className="text-2xl font-bold"
                    style={{ color: colors.orange }}
                  >
                    Transaction Details
                  </h2>
                  <button
                    onClick={closeModal}
                    className="hover:opacity-75 text-2xl"
                    style={{ color: colors.lightGray }}
                  >
                    <FaTimes />
                  </button>
                </div>
                {updateError && (
                  <div
                    className="p-3 mb-4 rounded-lg text-center font-medium"
                    style={{ backgroundColor: colors.pink, color: colors.black }}
                  >
                    {updateError}
                  </div>
                )}
                <div className="space-y-4">
                  <div>
                    <h3
                      className="text-xl font-semibold"
                      style={{ color: colors.white }}
                    >
                      {selectedTransaction.description ||
                        selectedTransaction.type}
                    </h3>
                    <p style={{ color: colors.lightGray }}>
                      {selectedTransaction.merchant || selectedTransaction.user}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p
                        className="text-sm"
                        style={{ color: colors.lightGray }}
                      >
                        Date
                      </p>
                      <p style={{ color: colors.white }}>
                        {formatDate(selectedTransaction.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-sm"
                        style={{ color: colors.lightGray }}
                      >
                        Amount
                      </p>
                      <p
                        className="font-semibold"
                        style={{ color: colors.white }}
                      >
                        ${selectedTransaction.amount.toFixed(1)}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-sm"
                        style={{ color: colors.lightGray }}
                      >
                        Type
                      </p>
                      <p style={{ color: colors.white }}>
                        {selectedTransaction.type}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-sm"
                        style={{ color: colors.lightGray }}
                      >
                        Status
                      </p>
                      <span
                        className={`px-2 py-1 text-xs rounded-full`}
                        style={{
                          backgroundColor: getStatusColor(
                            selectedTransaction.status
                          ),
                          color: colors.black,
                        }}
                      >
                        {selectedTransaction.status}
                      </span>
                    </div>
                  </div>

                  {/* Withdrawal Bank Details */}
                  {selectedTransaction.type === "withdrawal" &&
                    selectedTransaction.details && (
                      <div
                        className="pt-4 border-t"
                        style={{ borderColor: colors.lightGray }}
                      >
                        <p
                          className="text-sm mb-2"
                          style={{ color: colors.orange }}
                        >
                          Bank Details
                        </p>
                        <p style={{ color: colors.white }}>
                          <strong>Account Name:</strong>{" "}
                          {selectedTransaction.details.accountName}
                        </p>
                        <p style={{ color: colors.white }}>
                          <strong>Account Number:</strong>{" "}
                          {selectedTransaction.details.accountNumber}
                        </p>
                        <p style={{ color: colors.white }}>
                          <strong>Bank Code:</strong>{" "}
                          {selectedTransaction.details.bankCode}
                        </p>
                      </div>
                    )}

                  {/* Admin Actions for pending */}
                  {selectedTransaction.status === "pending" && (
                    <div
                      className="pt-4 border-t"
                      style={{ borderColor: colors.lightGray }}
                    >
                      <p
                        className="text-sm mb-2"
                        style={{ color: colors.lightGray }}
                      >
                        Admin Actions
                      </p>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleStatusUpdate("completed")}
                          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium"
                          disabled={isUpdating}
                          style={{
                            backgroundColor: colors.blue,
                            color: colors.black,
                            opacity: isUpdating ? 0.5 : 1,
                          }}
                        >
                          <FaCheckCircle /> {isUpdating ? "Approving..." : "Approve"}
                        </button>
                        <button
                          onClick={() => handleStatusUpdate("failed")}
                          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium"
                          disabled={isUpdating}
                          style={{
                            backgroundColor: colors.pink,
                            color: colors.black,
                            opacity: isUpdating ? 0.5 : 1,
                          }}
                        >
                          <FaTimesCircle /> {isUpdating ? "Rejecting..." : "Reject"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-8">
                  <button
                    onClick={closeModal}
                    className="w-full py-3 rounded-lg font-medium"
                    style={{
                      backgroundColor: colors.lightGray,
                      color: colors.white,
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;