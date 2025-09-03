import React, { useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaEye, FaUser, FaIdCard, FaClock, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const KYCPage = () => {
  const [kycRequests, setKycRequests] = useState([
    {
      id: 1,
      punterName: 'Michael Johnson',
      punterEmail: 'michael.j@example.com',
      punterPhone: '+1 (555) 123-4567',
      punterAddress: '123 Main St, New York, NY 10001',
      status: 'pending', // pending, approved, rejected
      submissionDate: '2023-10-15',
      idType: 'Driver License',
      idNumber: 'DL123456789',
      idFront: 'https://images.unsplash.com/photo-1586074299757-dc655f18518c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      idBack: 'https://images.unsplash.com/photo-1586074299757-dc655f18518c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      selfie: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      additionalNotes: 'ID expires on 2025-08-15'
    },
    {
      id: 2,
      punterName: 'Sarah Williams',
      punterEmail: 'sarah.w@example.com',
      punterPhone: '+1 (555) 987-6543',
      punterAddress: '456 Oak Ave, Los Angeles, CA 90001',
      status: 'pending',
      submissionDate: '2023-10-18',
      idType: 'Passport',
      idNumber: 'P87654321',
      idFront: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      idBack: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      selfie: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      additionalNotes: 'Passport issued in 2020'
    },
    {
      id: 3,
      punterName: 'David Brown',
      punterEmail: 'david.b@example.com',
      punterPhone: '+1 (555) 456-7890',
      punterAddress: '789 Pine Rd, Chicago, IL 60007',
      status: 'approved',
      submissionDate: '2023-10-10',
      idType: 'National ID',
      idNumber: 'NID987654321',
      idFront: 'https://images.unsplash.com/photo-1586074299757-dc655f18518c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      idBack: 'https://images.unsplash.com/photo-1586074299757-dc655f18518c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      selfie: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      additionalNotes: 'Verified on 2023-10-12'
    },
    {
      id: 4,
      punterName: 'Emma Thompson',
      punterEmail: 'emma.t@example.com',
      punterPhone: '+1 (555) 789-0123',
      punterAddress: '321 Elm St, Miami, FL 33101',
      status: 'rejected',
      submissionDate: '2023-10-05',
      idType: 'Driver License',
      idNumber: 'DL456789123',
      idFront: 'https://images.unsplash.com/photo-1586074299757-dc655f18518c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      idBack: 'https://images.unsplash.com/photo-1586074299757-dc655f18518c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      selfie: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      additionalNotes: 'ID image blurry, needs resubmission'
    }
  ]);

  const [selectedKYC, setSelectedKYC] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeImage, setActiveImage] = useState('front');
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending, approved, rejected

  const openModal = (kyc) => {
    setSelectedKYC(kyc);
    setIsModalOpen(true);
    setActiveImage('front');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedKYC(null);
  };

  const approveKYC = (id) => {
    setKycRequests(kycRequests.map(kyc => 
      kyc.id === id ? {...kyc, status: 'approved'} : kyc
    ));
    closeModal();
  };

  const rejectKYC = (id) => {
    setKycRequests(kycRequests.map(kyc => 
      kyc.id === id ? {...kyc, status: 'rejected'} : kyc
    ));
    closeModal();
  };

  const filteredRequests = kycRequests.filter(kyc => 
    filterStatus === 'all' ? true : kyc.status === filterStatus
  );

  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved':
        return <FaCheckCircle className="text-green-500 mr-2" />;
      case 'rejected':
        return <FaTimesCircle className="text-red-500 mr-2" />;
      default:
        return <FaClock className="text-yellow-500 mr-2" />;
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'approved':
        return 'bg-green-900/30 text-green-400';
      case 'rejected':
        return 'bg-red-900/30 text-red-400';
      default:
        return 'bg-yellow-900/30 text-yellow-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#09100d] text-[#efefef] p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-[#fea92a]">KYC Verification</h1>
        
        {/* Filter Section */}
        <div className="bg-[#162821] rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3 text-[#18ffc8]">Filter Requests</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded ${filterStatus === 'all' ? 'bg-[#fea92a] text-[#09100d]' : 'bg-[#376553]'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded flex items-center ${filterStatus === 'pending' ? 'bg-[#fea92a] text-[#09100d]' : 'bg-[#376553]'}`}
            >
              <FaClock className="mr-2" /> Pending
            </button>
            <button
              onClick={() => setFilterStatus('approved')}
              className={`px-4 py-2 rounded flex items-center ${filterStatus === 'approved' ? 'bg-[#fea92a] text-[#09100d]' : 'bg-[#376553]'}`}
            >
              <FaCheckCircle className="mr-2" /> Approved
            </button>
            <button
              onClick={() => setFilterStatus('rejected')}
              className={`px-4 py-2 rounded flex items-center ${filterStatus === 'rejected' ? 'bg-[#fea92a] text-[#09100d]' : 'bg-[#376553]'}`}
            >
              <FaTimesCircle className="mr-2" /> Rejected
            </button>
          </div>
        </div>

        {/* KYC Requests List */}
        <div className="bg-[#162821] rounded-lg p-4 md:p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-[#18ffc8]">KYC Requests</h2>
          
          {filteredRequests.length === 0 ? (
            <p className="text-center py-8 text-[#855391]">No KYC requests found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRequests.map(kyc => (
                <div key={kyc.id} className="bg-[#376553] rounded-lg p-4 hover:bg-[#458067] transition-colors cursor-pointer" onClick={() => openModal(kyc)}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg flex items-center">
                      <FaUser className="mr-2 text-[#fea92a]" />
                      {kyc.punterName}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs flex items-center ${getStatusClass(kyc.status)}`}>
                      {getStatusIcon(kyc.status)}
                      {kyc.status.charAt(0).toUpperCase() + kyc.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-[#efefef]/80 flex items-center">
                      <FaEnvelope className="mr-2" />
                      {kyc.punterEmail}
                    </p>
                    <p className="text-sm text-[#efefef]/80 flex items-center mt-1">
                      <FaPhone className="mr-2" />
                      {kyc.punterPhone}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-[#efefef]/80 flex items-center">
                        <FaIdCard className="mr-2" />
                        {kyc.idType}: {kyc.idNumber}
                      </p>
                      <p className="text-xs text-[#855391] mt-1">
                        Submitted on {kyc.submissionDate}
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
                <h2 className="text-xl font-semibold text-[#18ffc8]">KYC Verification Details</h2>
                <button onClick={closeModal} className="text-[#f57cff] hover:text-[#ff5ef9] text-2xl">
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
                      <p className="font-medium">{selectedKYC.punterName}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-[#efefef]/80 flex items-center">
                        <FaEnvelope className="mr-2" /> Email Address
                      </p>
                      <p className="font-medium">{selectedKYC.punterEmail}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-[#efefef]/80 flex items-center">
                        <FaPhone className="mr-2" /> Phone Number
                      </p>
                      <p className="font-medium">{selectedKYC.punterPhone}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-[#efefef]/80 flex items-center">
                        <FaMapMarkerAlt className="mr-2" /> Address
                      </p>
                      <p className="font-medium">{selectedKYC.punterAddress}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-[#efefef]/80">ID Type</p>
                      <p className="font-medium">{selectedKYC.idType}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-[#efefef]/80">ID Number</p>
                      <p className="font-medium">{selectedKYC.idNumber}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-[#efefef]/80">Submission Date</p>
                      <p className="font-medium">{selectedKYC.submissionDate}</p>
                    </div>
                    
                    {selectedKYC.additionalNotes && (
                      <div>
                        <p className="text-sm text-[#efefef]/80">Additional Notes</p>
                        <p className="font-medium">{selectedKYC.additionalNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* ID Verification Images */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-[#fea92a]">ID Verification</h3>
                  
                  <div className="mb-4">
                    <div className="flex space-x-2 mb-4">
                      <button
                        onClick={() => setActiveImage('front')}
                        className={`px-4 py-2 rounded ${activeImage === 'front' ? 'bg-[#fea92a] text-[#09100d]' : 'bg-[#376553]'}`}
                      >
                        Front Side
                      </button>
                      <button
                        onClick={() => setActiveImage('back')}
                        className={`px-4 py-2 rounded ${activeImage === 'back' ? 'bg-[#fea92a] text-[#09100d]' : 'bg-[#376553]'}`}
                      >
                        Back Side
                      </button>
                      <button
                        onClick={() => setActiveImage('selfie')}
                        className={`px-4 py-2 rounded ${activeImage === 'selfie' ? 'bg-[#fea92a] text-[#09100d]' : 'bg-[#376553]'}`}
                      >
                        Selfie
                      </button>
                    </div>
                    
                    <div className="bg-[#376553] rounded-lg p-4 flex items-center justify-center h-64">
                      <img 
                        src={activeImage === 'front' ? selectedKYC.idFront : 
                             activeImage === 'back' ? selectedKYC.idBack : 
                             selectedKYC.selfie} 
                        alt={activeImage === 'selfie' ? 'Selfie' : `ID ${activeImage} side`}
                        className="max-h-56 max-w-full object-contain"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    <div className="bg-[#376553] rounded p-1">
                      <img 
                        src={selectedKYC.idFront} 
                        alt="ID Front" 
                        className="h-16 w-full object-cover cursor-pointer"
                        onClick={() => setActiveImage('front')}
                      />
                    </div>
                    <div className="bg-[#376553] rounded p-1">
                      <img 
                        src={selectedKYC.idBack} 
                        alt="ID Back" 
                        className="h-16 w-full object-cover cursor-pointer"
                        onClick={() => setActiveImage('back')}
                      />
                    </div>
                    <div className="bg-[#376553] rounded p-1">
                      <img 
                        src={selectedKYC.selfie} 
                        alt="Selfie" 
                        className="h-16 w-full object-cover cursor-pointer"
                        onClick={() => setActiveImage('selfie')}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              {selectedKYC.status === 'pending' && (
                <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-[#376553]">
                  <button
                    onClick={() => rejectKYC(selectedKYC.id)}
                    className="px-6 py-3 bg-[#f57cff] hover:bg-[#ff5ef9] text-[#09100d] font-semibold rounded transition-colors flex items-center"
                  >
                    <FaTimesCircle className="mr-2" /> Reject KYC
                  </button>
                  <button
                    onClick={() => approveKYC(selectedKYC.id)}
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