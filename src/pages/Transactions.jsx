import { useState, useEffect } from 'react';
import { FaFilter, FaCheckCircle, FaTimesCircle, FaChevronDown, FaChevronUp, FaSearch, FaBars, FaTimes } from 'react-icons/fa';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const colors = {
    black: "#09100d",
    gray: "#162821",
    orange: "#fea92a",
    purple: "#855391",
    lightGray: "#376553",
    white: "#efefef",
    pink: "#f57cff",
    blue: "#18ffc8"
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsFilterOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const mockTransactions = [
      { id: 1, date: '2023-10-15', amount: 249.99, description: 'Premium Subscription', status: 'completed', category: 'Entertainment', merchant: 'StreamFlix Inc.' },
      { id: 2, date: '2023-10-12', amount: 89.50, description: 'Grocery Shopping', status: 'completed', category: 'Food', merchant: 'FreshMart' },
      { id: 3, date: '2023-10-10', amount: 1250.00, description: 'Salary Deposit', status: 'completed', category: 'Income', merchant: 'TechCorp LLC' },
      { id: 4, date: '2023-10-08', amount: 54.30, description: 'Gas Refill', status: 'completed', category: 'Transportation', merchant: 'QuickFuel Station' },
      { id: 5, date: '2023-10-05', amount: 320.00, description: 'Wireless Headphones', status: 'pending', category: 'Shopping', merchant: 'GadgetWorld' },
      { id: 6, date: '2023-10-03', amount: 22.99, description: 'Book Purchase', status: 'completed', category: 'Education', merchant: 'ReadMore Books' },
      { id: 7, date: '2023-10-01', amount: 149.99, description: 'Smart Watch Band', status: 'pending', category: 'Shopping', merchant: 'TechStyle Accessories' },
      { id: 8, date: '2023-09-28', amount: 75.00, description: 'Restaurant Dinner', status: 'completed', category: 'Food', merchant: 'La Bella Casa' },
      { id: 9, date: '2023-09-25', amount: 29.99, description: 'Music Streaming', status: 'completed', category: 'Entertainment', merchant: 'TuneIn' },
      { id: 10, date: '2023-09-22', amount: 450.00, description: 'Freelance Project', status: 'completed', category: 'Income', merchant: 'DesignStudio Co.' },
    ];
    setTransactions(mockTransactions);
    setFilteredTransactions(mockTransactions);
  }, []);

  useEffect(() => {
    let result = [...transactions];
    if (filterStatus !== 'all') {
      result = result.filter(transaction => transaction.status === filterStatus);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(transaction =>
        transaction.description.toLowerCase().includes(term) ||
        transaction.merchant.toLowerCase().includes(term) ||
        transaction.category.toLowerCase().includes(term) ||
        transaction.amount.toString().includes(term)
      );
    }
    result.sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc'
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      } else if (sortBy === 'amount') {
        return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
      return 0;
    });
    setFilteredTransactions(result);
  }, [transactions, filterStatus, sortBy, sortOrder, searchTerm]);

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleStatusUpdate = (newStatus) => {
    if (!selectedTransaction) return;
    const updatedTransactions = transactions.map(transaction =>
      transaction.id === selectedTransaction.id
        ? { ...transaction, status: newStatus }
        : transaction
    );
    setTransactions(updatedTransactions);
    setSelectedTransaction({ ...selectedTransaction, status: newStatus });
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const toggleFilterMenu = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div style={{ backgroundColor: colors.black }} className="min-h-screen text-white p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 style={{ color: colors.orange }} className="text-2xl md:text-3xl font-bold mb-2">Transaction History</h1>
        <p style={{ color: colors.lightGray }} className="mb-6 md:mb-8">View and manage all your transactions</p>

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
            {isFilterOpen ? <FaTimes style={{ color: colors.white }} /> : <FaBars style={{ color: colors.white }} />}
          </button>
        </div>

        <div style={{ backgroundColor: colors.gray }} className={`rounded-lg p-4 mb-6 ${isMobile ? (isFilterOpen ? 'block' : 'hidden') : 'block'}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 mb-2 md:mb-0">
                <FaFilter style={{ color: colors.blue }} />
                <span style={{ color: colors.lightGray }}>Filter by:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1 rounded-full text-sm ${filterStatus === 'all' ? `bg-blue text-black` : `bg-lightGray`}`}
                  style={{
                    backgroundColor: filterStatus === 'all' ? colors.blue : colors.lightGray,
                    color: filterStatus === 'all' ? colors.black : colors.white
                  }}
                  onClick={() => setFilterStatus('all')}
                >
                  All
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${filterStatus === 'pending' ? `bg-orange text-black` : `bg-lightGray`}`}
                  style={{
                    backgroundColor: filterStatus === 'pending' ? colors.orange : colors.lightGray,
                    color: filterStatus === 'pending' ? colors.black : colors.white
                  }}
                  onClick={() => setFilterStatus('pending')}
                >
                  Pending
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${filterStatus === 'completed' ? `bg-blue text-black` : `bg-lightGray`}`}
                  style={{
                    backgroundColor: filterStatus === 'completed' ? colors.blue : colors.lightGray,
                    color: filterStatus === 'completed' ? colors.black : colors.white
                  }}
                  onClick={() => setFilterStatus('completed')}
                >
                  Completed
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${filterStatus === 'rejected' ? `bg-pink text-black` : `bg-lightGray`}`}
                  style={{
                    backgroundColor: filterStatus === 'rejected' ? colors.pink : colors.lightGray,
                    color: filterStatus === 'rejected' ? colors.black : colors.white
                  }}
                  onClick={() => setFilterStatus('rejected')}
                >
                  Rejected
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
                style={{ backgroundColor: colors.lightGray, color: colors.white }}
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
                  backgroundColor: sortBy === 'date' ? colors.purple : colors.lightGray,
                  color: colors.white
                }}
                className={`px-3 py-1 rounded-full text-sm`}
                onClick={() => toggleSort('date')}
              >
                Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
              <button
                style={{
                  backgroundColor: sortBy === 'amount' ? colors.purple : colors.lightGray,
                  color: colors.white
                }}
                className={`px-3 py-1 rounded-full text-sm`}
                onClick={() => toggleSort('amount')}
              >
                Amount {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: colors.gray }} className="rounded-lg overflow-hidden">
          {isMobile ? (
            <div className="divide-y" style={{ borderColor: colors.lightGray }}>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="p-4 cursor-pointer transition-colors"
                    style={{ '--tw-bg-opacity': 0.5 }}
                    onClick={() => handleTransactionClick(transaction)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium" style={{ color: colors.white }}>{transaction.description}</h3>
                        <p className="text-sm" style={{ color: colors.lightGray }}>{transaction.merchant}</p>
                        <p className="text-xs mt-1" style={{ color: colors.lightGray }}>{transaction.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold" style={{ color: transaction.status === 'completed' ? colors.blue : transaction.status === 'pending' ? colors.orange : colors.pink }}>
                          ${transaction.amount}
                        </p>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs mt-1`}
                          style={{
                            backgroundColor: transaction.status === 'completed' ? colors.blue : transaction.status === 'pending' ? colors.orange : colors.pink,
                            color: colors.black
                          }}
                        >
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: colors.black, color: colors.lightGray }}>
                        {transaction.category}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <p style={{ color: colors.lightGray }}>No transactions found</p>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: colors.lightGray }}>
                    <th
                      className="px-4 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort('date')}
                    >
                      <div className="flex items-center" style={{ color: colors.white }}>
                        <span>Date</span>
                        {sortBy === 'date' && (
                          sortOrder === 'asc' ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.white }}>Description</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.white }}>Merchant</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.white }}>Category</th>
                    <th
                      className="px-4 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort('amount')}
                    >
                      <div className="flex items-center" style={{ color: colors.white }}>
                        <span>Amount</span>
                        {sortBy === 'amount' && (
                          sortOrder === 'asc' ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.white }}>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: colors.gray }}>
                  {filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="cursor-pointer transition-colors"
                      style={{ '--tw-bg-opacity': 0.2 }}
                      onClick={() => handleTransactionClick(transaction)}
                    >
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap" style={{ color: colors.white }}>{transaction.date}</td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="text-sm font-medium" style={{ color: colors.white }}>{transaction.description}</div>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm" style={{ color: colors.lightGray }}>{transaction.merchant}</div>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full" style={{ backgroundColor: colors.black, color: colors.lightGray }}>
                          {transaction.category}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium" style={{ color: colors.white }}>${transaction.amount}</div>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full`}
                          style={{
                            backgroundColor: transaction.status === 'completed' ? colors.blue : transaction.status === 'pending' ? colors.orange : colors.pink,
                            color: colors.black
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

          {filteredTransactions.length === 0 && (
            <div className="p-8 text-center">
              <p style={{ color: colors.lightGray }}>No transactions found</p>
            </div>
          )}
        </div>

        {isModalOpen && selectedTransaction && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <div className="absolute inset-0 bg-black bg-opacity-75" onClick={closeModal}></div>
            <div
              className="relative rounded-3xl overflow-hidden shadow-2xl"
              style={{
                width: '100%',
                maxWidth: '400px',
                aspectRatio: '9 / 16',
                border: `4px solid ${colors.gray}`,
                backgroundColor: colors.black
              }}
            >
              <div
                className="absolute inset-0 p-4 overflow-y-auto"
                style={{
                  backgroundColor: colors.gray,
                  borderRadius: '1.5rem',
                  border: `4px solid ${colors.gray}`
                }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold" style={{ color: colors.orange }}>Transaction Details</h2>
                  <button onClick={closeModal} className="hover:opacity-75" style={{ color: colors.lightGray }}>
                    <FaTimes size={20} />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold" style={{ color: colors.white }}>{selectedTransaction.description}</h3>
                    <p style={{ color: colors.lightGray }}>{selectedTransaction.merchant}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm" style={{ color: colors.lightGray }}>Date</p>
                      <p style={{ color: colors.white }}>{selectedTransaction.date}</p>
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: colors.lightGray }}>Amount</p>
                      <p className="font-semibold" style={{ color: colors.white }}>${selectedTransaction.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: colors.lightGray }}>Category</p>
                      <p style={{ color: colors.white }}>{selectedTransaction.category}</p>
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: colors.lightGray }}>Status</p>
                      <span
                        className={`px-2 py-1 text-xs rounded-full`}
                        style={{
                          backgroundColor: selectedTransaction.status === 'completed' ? colors.blue : selectedTransaction.status === 'pending' ? colors.orange : colors.pink,
                          color: colors.black
                        }}
                      >
                        {selectedTransaction.status}
                      </span>
                    </div>
                  </div>
                  {selectedTransaction.status === 'pending' && (
                    <div className="pt-4 border-t" style={{ borderColor: colors.lightGray }}>
                      <p className="text-sm mb-2" style={{ color: colors.lightGray }}>Admin Actions</p>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleStatusUpdate('completed')}
                          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium"
                          style={{ backgroundColor: colors.blue, color: colors.black }}
                        >
                          <FaCheckCircle /> Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate('rejected')}
                          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium"
                          style={{ backgroundColor: colors.pink, color: colors.black }}
                        >
                          <FaTimesCircle /> Reject
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-8">
                  <button
                    onClick={closeModal}
                    className="w-full py-3 rounded-lg font-medium"
                    style={{ backgroundColor: colors.lightGray, color: colors.white }}
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