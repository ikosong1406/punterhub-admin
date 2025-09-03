import React, { useState } from 'react';
import { FaUsers, FaUser, FaPaperPlane, FaChevronDown, FaCheck } from 'react-icons/fa';

const EmailPage = () => {
  const [selectedRecipientType, setSelectedRecipientType] = useState('allUsers');
  const [selectedUser, setSelectedUser] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // Sample data - in a real app, this would come from an API
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', type: 'user' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', type: 'user' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', type: 'punter' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', type: 'punter' },
    { id: 5, name: 'David Brown', email: 'david@example.com', type: 'user' },
  ];

  const recipientTypes = [
    { id: 'allUsers', label: 'All Users', icon: <FaUsers className="mr-2" /> },
    { id: 'allPunters', label: 'All Punters', icon: <FaUsers className="mr-2" /> },
    { id: 'specificUser', label: 'Specific User', icon: <FaUser className="mr-2" /> },
    { id: 'specificPunter', label: 'Specific Punter', icon: <FaUser className="mr-2" /> },
  ];

  const handleSendEmail = () => {
    if (!emailSubject.trim() || !emailContent.trim()) {
      alert('Please fill in both subject and content fields');
      return;
    }

    if ((selectedRecipientType === 'specificUser' || selectedRecipientType === 'specificPunter') && !selectedUser) {
      alert('Please select a recipient');
      return;
    }

    setIsSending(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      
      // Reset after 2 seconds
      setTimeout(() => setIsSent(false), 2000);
      
      // Reset form
      setEmailSubject('');
      setEmailContent('');
      setSelectedUser('');
    }, 1500);
  };

  const getRecipientLabel = () => {
    return recipientTypes.find(type => type.id === selectedRecipientType)?.label || 'Select Recipients';
  };

  const getFilteredUsers = () => {
    if (selectedRecipientType === 'specificUser') {
      return users.filter(user => user.type === 'user');
    } else if (selectedRecipientType === 'specificPunter') {
      return users.filter(user => user.type === 'punter');
    }
    return users;
  };

  return (
    <div className="min-h-screen bg-[#09100d] text-[#efefef] p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-[#fea92a]">Email Management</h1>
        
        <div className="bg-[#162821] rounded-lg p-4 md:p-6 shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4 text-[#18ffc8]">Compose Email</h2>
          
          {/* Recipient Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Send To</label>
            
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between p-3 rounded bg-[#376553] border border-[#376553] focus:outline-none focus:ring-2 focus:ring-[#18ffc8]"
              >
                <div className="flex items-center">
                  {recipientTypes.find(type => type.id === selectedRecipientType)?.icon}
                  <span>{getRecipientLabel()}</span>
                </div>
                <FaChevronDown className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-[#376553] rounded-md shadow-lg overflow-hidden">
                  {recipientTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => {
                        setSelectedRecipientType(type.id);
                        setIsDropdownOpen(false);
                        setSelectedUser('');
                      }}
                      className="w-full flex items-center p-3 hover:bg-[#458067] transition-colors"
                    >
                      {type.icon}
                      <span>{type.label}</span>
                      {selectedRecipientType === type.id && (
                        <FaCheck className="ml-auto text-[#18ffc8]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Specific user selection */}
            {(selectedRecipientType === 'specificUser' || selectedRecipientType === 'specificPunter') && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Select Recipient</label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full p-3 rounded bg-[#376553] border border-[#376553] focus:outline-none focus:ring-2 focus:ring-[#18ffc8]"
                >
                  <option value="">Select a recipient</option>
                  {getFilteredUsers().map(user => (
                    <option key={user.id} value={user.email}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          {/* Email Subject */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Subject</label>
            <input
              type="text"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className="w-full p-3 rounded bg-[#376553] border border-[#376553] focus:outline-none focus:ring-2 focus:ring-[#18ffc8]"
              placeholder="Enter email subject"
            />
          </div>
          
          {/* Email Content */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              rows={6}
              className="w-full p-3 rounded bg-[#376553] border border-[#376553] focus:outline-none focus:ring-2 focus:ring-[#18ffc8]"
              placeholder="Compose your email message here..."
            ></textarea>
          </div>
          
          {/* Send Button */}
          <button
            onClick={handleSendEmail}
            disabled={isSending}
            className={`flex items-center justify-center gap-2 w-full md:w-auto ${
              isSending ? 'bg-[#855391]' : 'bg-[#fea92a] hover:bg-[#e5971e]'
            } text-[#09100d] font-semibold py-3 px-6 rounded transition-colors`}
          >
            {isSending ? (
              <>Sending...</>
            ) : isSent ? (
              <>
                <FaCheck /> Sent Successfully
              </>
            ) : (
              <>
                <FaPaperPlane /> Send Email
              </>
            )}
          </button>
        </div>
        
        {/* Information Panel */}
        <div className="bg-[#162821] rounded-lg p-4 md:p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-[#18ffc8]">Recipient Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#376553] p-4 rounded-lg">
              <h3 className="font-semibold text-[#fea92a] mb-2">All Users</h3>
              <p className="text-sm">Sends email to all registered users in the system.</p>
              <p className="text-xs mt-2 text-[#855391]">
                {users.filter(user => user.type === 'user').length} users
              </p>
            </div>
            
            <div className="bg-[#376553] p-4 rounded-lg">
              <h3 className="font-semibold text-[#fea92a] mb-2">All Punters</h3>
              <p className="text-sm">Sends email to all punters in the system.</p>
              <p className="text-xs mt-2 text-[#855391]">
                {users.filter(user => user.type === 'punter').length} punters
              </p>
            </div>
            
            <div className="bg-[#376553] p-4 rounded-lg">
              <h3 className="font-semibold text-[#fea92a] mb-2">Specific User</h3>
              <p className="text-sm">Select an individual user to send a targeted email.</p>
            </div>
            
            <div className="bg-[#376553] p-4 rounded-lg">
              <h3 className="font-semibold text-[#fea92a] mb-2">Specific Punter</h3>
              <p className="text-sm">Select an individual punter to send a targeted email.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailPage;