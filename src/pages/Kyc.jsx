import React, { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaUser,
  FaIdCard,
  FaClock,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaSpinner,
} from "react-icons/fa";
import axios from "axios";
import Api from "../components/Api"; // Import the configured Axios instance

const KYCPage = () => {
  const [kycRequests, setKycRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedKYC, setSelectedKYC] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeImage, setActiveImage] = useState("front");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch data from the real endpoint
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${Api}/admin/getIdentifications`); // Endpoint to get all KYC requests
        // Sort by createdAt date in reverse order
        const sortedData = response.data.data.reverse();
        setKycRequests(sortedData);
      } catch (error) {
        console.error("Failed to fetch KYC requests:", error);
        // You can add state to show an error message to the user
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const openModal = (kyc) => {
    setSelectedKYC(kyc);
    setIsModalOpen(true);
    setActiveImage("front");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedKYC(null);
  };

  // Function to handle status updates via API
  const handleStatusUpdate = async (id, userId, newStatus) => {

    const data = { id, userId, status: newStatus };
    try {
      // Endpoint and data structure for updating a single KYC request
      await axios.post(`${Api}/admin/verifyAction`, data);

      // Update the UI state to reflect the change
      setKycRequests((prevRequests) =>
        prevRequests.map((kyc) =>
          kyc._id === id ? { ...kyc, status: newStatus } : kyc
        )
      );
      closeModal();
    } catch (error) {
      console.error("Failed to update KYC status:", error);
      // Handle error, e.g., show a toast notification
    }
  };

  const filteredRequests = kycRequests.filter((kyc) =>
    filterStatus === "all" ? true : kyc.status === filterStatus
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <FaCheckCircle className="text-green-500 mr-2" />;
      case "rejected":
        return <FaTimesCircle className="text-red-500 mr-2" />;
      default:
        return <FaClock className="text-yellow-500 mr-2" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-900/30 text-green-400";
      case "rejected":
        return "bg-red-900/30 text-red-400";
      default:
        return "bg-yellow-900/30 text-yellow-400";
    }
  };

  return (
    <div className="min-h-screen bg-[#09100d] text-[#efefef] p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-[#fea92a]">
          KYC Verification
        </h1>

        {/* Filter Section */}
        <div className="bg-[#162821] rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3 text-[#18ffc8]">
            Filter Requests
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-4 py-2 rounded ${
                filterStatus === "all"
                  ? "bg-[#fea92a] text-[#09100d]"
                  : "bg-[#376553]"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus("pending")}
              className={`px-4 py-2 rounded flex items-center ${
                filterStatus === "pending"
                  ? "bg-[#fea92a] text-[#09100d]"
                  : "bg-[#376553]"
              }`}
            >
              <FaClock className="mr-2" /> Pending
            </button>
            <button
              onClick={() => setFilterStatus("approved")}
              className={`px-4 py-2 rounded flex items-center ${
                filterStatus === "approved"
                  ? "bg-[#fea92a] text-[#09100d]"
                  : "bg-[#376553]"
              }`}
            >
              <FaCheckCircle className="mr-2" /> Approved
            </button>
            <button
              onClick={() => setFilterStatus("rejected")}
              className={`px-4 py-2 rounded flex items-center ${
                filterStatus === "rejected"
                  ? "bg-[#fea92a] text-[#09100d]"
                  : "bg-[#376553]"
              }`}
            >
              <FaTimesCircle className="mr-2" /> Rejected
            </button>
          </div>
        </div>

        {/* KYC Requests List */}
        <div className="bg-[#162821] rounded-lg p-4 md:p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-[#18ffc8]">
            KYC Requests
          </h2>

          {loading ? (
            <div className="flex justify-center items-center py-8 text-[#18ffc8]">
              <FaSpinner className="animate-spin mr-2" size={24} /> Loading
              requests...
            </div>
          ) : filteredRequests.length === 0 ? (
            <p className="text-center py-8 text-[#855391]">
              No KYC requests found.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRequests.map((kyc) => (
                <div
                  key={kyc._id}
                  className="bg-[#376553] rounded-lg p-4 hover:bg-[#458067] transition-colors cursor-pointer"
                  onClick={() => openModal(kyc)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg flex items-center">
                      <FaUser className="mr-2 text-[#fea92a]" />
                      {kyc.userFullname}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs flex items-center ${getStatusClass(
                        kyc.status
                      )}`}
                    >
                      {getStatusIcon(kyc.status)}
                      {kyc.status.charAt(0).toUpperCase() + kyc.status.slice(1)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-[#855391] mt-1">
                        Submitted on{" "}
                        {new Date(kyc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button className="text-[#18ffc8] hover:text-[#15e5b0] p-2">
                      <FaEye size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* KYC Detail Modal */}
      {isModalOpen && selectedKYC && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#162821] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#376553] sticky top-0 bg-[#162821] z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-[#18ffc8]">
                  KYC Verification Details
                </h2>
                <button
                  onClick={closeModal}
                  className="text-[#f57cff] hover:text-[#ff5ef9] text-2xl"
                >
                  &times;
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Punter Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-[#fea92a] flex items-center">
                    <FaUser className="mr-2" /> Punter Information
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-[#efefef]/80">Full Name</p>
                      <p className="font-medium">{selectedKYC.userFullname}</p>
                    </div>

                    <div>
                      <p className="text-sm text-[#efefef]/80 flex items-center">
                        <FaEnvelope className="mr-2" /> Email Address
                      </p>
                      <p className="font-medium">{selectedKYC.userEmail}</p>
                    </div>

                    <div>
                      <p className="text-sm text-[#efefef]/80 flex items-center">
                        <FaPhone className="mr-2" /> Phone Number
                      </p>
                      <p className="font-medium">{selectedKYC.userPhone}</p>
                    </div>

                    <div>
                      <p className="text-sm text-[#efefef]/80">ID Type</p>
                      <p className="font-medium">{selectedKYC.idType}</p>
                    </div>

                    <div>
                      <p className="text-sm text-[#efefef]/80">
                        Submission Date
                      </p>
                      <p className="font-medium">
                        {new Date(selectedKYC.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ID Verification Images */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-[#fea92a]">
                    ID Verification
                  </h3>

                  <div className="mb-4">
                    <div className="flex space-x-2 mb-4">
                      <button
                        onClick={() => setActiveImage("front")}
                        className={`px-4 py-2 rounded ${
                          activeImage === "front"
                            ? "bg-[#fea92a] text-[#09100d]"
                            : "bg-[#376553]"
                        }`}
                      >
                        Front Side
                      </button>
                      <button
                        onClick={() => setActiveImage("back")}
                        className={`px-4 py-2 rounded ${
                          activeImage === "back"
                            ? "bg-[#fea92a] text-[#09100d]"
                            : "bg-[#376553]"
                        }`}
                      >
                        Back Side
                      </button>
                      <button
                        onClick={() => setActiveImage("selfie")}
                        className={`px-4 py-2 rounded ${
                          activeImage === "selfie"
                            ? "bg-[#fea92a] text-[#09100d]"
                            : "bg-[#376553]"
                        }`}
                      >
                        Selfie
                      </button>
                    </div>

                    <div className="bg-[#376553] rounded-lg p-4 flex items-center justify-center h-64">
                      <img
                        src={
                          activeImage === "front"
                            ? selectedKYC.idPhotos.front
                            : activeImage === "back"
                            ? selectedKYC.idPhotos.back
                            : selectedKYC.selfie
                        }
                        alt={
                          activeImage === "selfie"
                            ? "Selfie"
                            : `ID ${activeImage} side`
                        }
                        className="max-h-56 max-w-full object-contain"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-6">
                    <div className="bg-[#376553] rounded p-1">
                      <img
                        src={selectedKYC.idPhotos.front}
                        alt="ID Front"
                        className="h-16 w-full object-cover cursor-pointer"
                        onClick={() => setActiveImage("front")}
                      />
                    </div>
                    <div className="bg-[#376553] rounded p-1">
                      <img
                        src={selectedKYC.idPhotos.back}
                        alt="ID Back"
                        className="h-16 w-full object-cover cursor-pointer"
                        onClick={() => setActiveImage("back")}
                      />
                    </div>
                    <div className="bg-[#376553] rounded p-1">
                      <img
                        src={selectedKYC.selfie}
                        alt="Selfie"
                        className="h-16 w-full object-cover cursor-pointer"
                        onClick={() => setActiveImage("selfie")}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedKYC.status === "pending" && (
                <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-[#376553]">
                  <button
                    onClick={() =>
                      handleStatusUpdate(
                        selectedKYC._id,
                        selectedKYC.userId,
                        "rejected"
                      )
                    }
                    className="px-6 py-3 bg-[#f57cff] hover:bg-[#ff5ef9] text-[#09100d] font-semibold rounded transition-colors flex items-center"
                  >
                    <FaTimesCircle className="mr-2" /> Reject KYC
                  </button>
                  <button
                    onClick={() =>
                      handleStatusUpdate(
                        selectedKYC._id,
                        selectedKYC.userId,
                        "approved"
                      )
                    }
                    className="px-6 py-3 bg-[#18ffc8] hover:bg-[#15e5b0] text-[#09100d] font-semibold rounded transition-colors flex items-center"
                  >
                    <FaCheckCircle className="mr-2" /> Approve KYC
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KYCPage;
