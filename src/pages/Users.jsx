import { useState, useEffect } from "react";
import {
  FaUserCircle,
  FaIdCard,
  FaEnvelope,
  FaPhone,
  FaTimes,
  FaFilter,
  FaSearch,
  FaEdit,
  FaUser,
  FaPoundSign,
  FaTags,
  FaCheckCircle,
  FaBan,
  FaCheck,
  FaTimes as FaTimesCircle,
  FaCalendarAlt,
  FaCreditCard,
  FaStar,
  FaCrown,
  FaCoins,
  FaShieldAlt,
} from "react-icons/fa";
import axios from "axios";
import Api from "../components/Api";
import logoImage from "../assets/logo2.png";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterRole, setFilterRole] = useState("user"); // Default to 'user'
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "ascending",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${Api}/admin/getUsers`);
        setUsers(response.data.data); // Assuming the data is nested under a 'data' key
        setFilteredUsers(response.data.data);
      } catch (err) {
        setError("Failed to fetch user data. Please check the API endpoint.");
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let result = [...users];

    // Filter by role
    if (filterRole !== "all") {
      result = result.filter((user) => user.role === filterRole);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          user.firstname.toLowerCase().includes(query) ||
          user.lastname.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          (user.bio && user.bio.toLowerCase().includes(query)) ||
          (user.username && user.username.toLowerCase().includes(query))
      );
    }

    // Sort results
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key] || "";
        const bValue = b[sortConfig.key] || "";

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredUsers(result);
  }, [users, filterRole, searchQuery, sortConfig]);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const updateUserStatus = (newStatus) => {
    if (!selectedUser) return;
    const updatedUsers = users.map((user) =>
      user._id === selectedUser._id ? { ...user, status: newStatus } : user
    );
    setUsers(updatedUsers);
    setSelectedUser({ ...selectedUser, status: newStatus });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return colors.blue;
      case "inactive":
        return colors.lightGray;
      case "suspended":
        return colors.pink;
      default:
        return colors.white;
    }
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? "↑" : "↓";
  };

  const renderUserInfoItem = (icon, title, value) => {
    if (!value) return null;
    return (
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-xs" style={{ color: colors.lightGray }}>
            {title}
          </p>
          <p className="font-medium" style={{ color: colors.white }}>
            {value}
          </p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-[#09100d] flex flex-col items-center justify-center w-screen h-screen bg-cover bg-center text-center">
        {/* Arcs + Logo */}
        <div className="flex flex-col items-center space-y-6">
          <div className="relative w-[15rem] h-[15rem] flex items-center justify-center">
            {/* ... (Your SVG and logo JSX here) */}
            <svg
              className="absolute w-full h-full spin-slow"
              viewBox="0 0 100 100"
            >
              <path
                d="M50,0 A50,50 0 1,1 0,50"
                fill="none"
                stroke="#fea92a"
                strokeWidth="4"
                strokeLinecap="round"
                className="glow-stroke"
              />
            </svg>
            <svg
              className="absolute w-[13rem] h-[13rem] spin-medium"
              viewBox="0 0 100 100"
            >
              <path
                d="M50,0 A50,50 0 1,1 0,50"
                fill="none"
                stroke="#855391"
                strokeWidth="4"
                strokeLinecap="round"
                className="glow-stroke"
              />
            </svg>
            <div className="relative flex items-center justify-center w-[10rem] h-[10rem] p-6 border-4 border-[#18ffc8] border-opacity-70 rounded-full animate-pulse">
              <img
                src={logoImage}
                alt="Platform Logo"
                className="max-w-full max-h-full"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{ backgroundColor: colors.black }}
        className="min-h-screen flex items-center justify-center text-red-500"
      >
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div
      style={{ backgroundColor: colors.black }}
      className="min-h-screen text-white p-4 md:p-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h1
              style={{ color: colors.orange }}
              className="text-2xl md:text-3xl font-bold mb-2"
            >
              User Management
            </h1>
          </div>
        </div>
        <div
          style={{ backgroundColor: colors.gray }}
          className="rounded-lg p-4 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch style={{ color: colors.lightGray }} />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg"
                style={{ backgroundColor: colors.black, color: colors.white }}
              />
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
              <div className="flex items-center gap-2">
                <FaFilter style={{ color: colors.blue }} />
                <span style={{ color: colors.lightGray }}>Filter:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1 rounded-full text-sm transition-all`}
                  style={{
                    backgroundColor:
                      filterRole === "user" ? colors.blue : colors.lightGray,
                    color: filterRole === "user" ? colors.black : colors.white,
                  }}
                  onClick={() => setFilterRole("user")}
                >
                  Users
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm transition-all`}
                  style={{
                    backgroundColor:
                      filterRole === "punter"
                        ? colors.orange
                        : colors.lightGray,
                    color:
                      filterRole === "punter" ? colors.black : colors.white,
                  }}
                  onClick={() => setFilterRole("punter")}
                >
                  Punters
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{ backgroundColor: colors.gray }}
          className="rounded-lg overflow-hidden shadow-lg"
        >
          {/* Table Header */}
          <div
            className="hidden md:grid grid-cols-12 p-4"
            style={{ borderBottom: `1px solid ${colors.lightGray}` }}
          >
            <div
              className="col-span-4 font-medium cursor-pointer flex items-center gap-1"
              style={{ color: colors.orange }}
              onClick={() => handleSort("firstname")}
            >
              User {getSortIndicator("firstname")}
            </div>
            <div
              className="col-span-2 font-medium cursor-pointer flex items-center gap-1"
              style={{ color: colors.orange }}
              onClick={() => handleSort("status")}
            >
              Status {getSortIndicator("status")}
            </div>
            <div
              className="col-span-3 font-medium cursor-pointer flex items-center gap-1"
              style={{ color: colors.orange }}
              onClick={() => handleSort("bio")}
            >
              Bio {getSortIndicator("bio")}
            </div>
            <div
              className="col-span-1 font-medium"
              style={{ color: colors.orange }}
            >
              Actions
            </div>
          </div>
          {/* Users List */}
          <div className="divide-y" style={{ borderColor: colors.lightGray }}>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="p-4 grid grid-cols-1 md:grid-cols-12 items-center cursor-pointer transition-all hover:bg-lightGray"
                  onClick={() => handleUserClick(user)}
                >
                  <div className="col-span-4 flex items-center mb-2 md:mb-0">
                    <FaUserCircle
                      size={40}
                      style={{
                        color:
                          user.role === "punter" ? colors.orange : colors.blue,
                      }}
                      className="mr-4"
                    />
                    <div>
                      <h3
                        className="font-semibold"
                        style={{ color: colors.white }}
                      >
                        {user.firstname} {user.lastname}
                      </h3>
                      <p
                        className="text-sm"
                        style={{ color: colors.lightGray }}
                      >
                        {user.email}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: colors.white }}
                      >
                        {user.username}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <p style={{ color: colors.lightGray }}>
                  No users found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </div>
        {/* Updated User Detail Modal */}
        {isModalOpen && selectedUser && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <div
              className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm"
              onClick={closeModal}
            ></div>
            <div
              className="relative w-full h-full md:w-11/12 md:h-auto md:max-w-4xl rounded-lg md:rounded-xl overflow-y-auto shadow-2xl"
              style={{
                backgroundColor: colors.gray,
                border: `1px solid ${colors.lightGray}`,
              }}
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-10 p-4 md:p-6 flex justify-between items-start border-b"
                   style={{ backgroundColor: colors.gray, borderColor: colors.lightGray }}>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden flex items-center justify-center"
                         style={{ border: `3px solid ${selectedUser.role === "punter" ? colors.orange : colors.blue}` }}>
                      {selectedUser.profilePicture ? (
                        <img src={selectedUser.profilePicture} alt="User Profile" className="w-full h-full object-cover"/>
                      ) : (
                        <FaUserCircle size={64} style={{ color: selectedUser.role === "punter" ? colors.orange : colors.blue }}/>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                         style={{ backgroundColor: getStatusColor(selectedUser.status), border: `2px solid ${colors.gray}` }}>
                      {selectedUser.status === "active" && <FaCheck size={10} style={{ color: colors.black }} />}
                      {selectedUser.status === "suspended" && <FaBan size={10} style={{ color: colors.black }} />}
                      {selectedUser.status === "inactive" && <FaTimesCircle size={10} style={{ color: colors.black }} />}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: colors.white }}>
                      {selectedUser.firstname} {selectedUser.lastname}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-1 rounded-md text-xs font-medium capitalize"
                            style={{ 
                              backgroundColor: selectedUser.role === "punter" ? colors.orange : colors.blue,
                              color: colors.black
                            }}>
                        {selectedUser.role}
                      </span>
                      <p className="text-sm font-light" style={{ color: colors.lightGray }}>
                        {selectedUser.username ? `@${selectedUser.username}` : "No username"}
                      </p>
                    </div>
                  </div>
                </div>
                <button onClick={closeModal} className="p-1 hover:opacity-75 transition-opacity rounded-full"
                        style={{ backgroundColor: colors.black, color: colors.lightGray }}>
                  <FaTimes size={18} />
                </button>
              </div>
              
              {/* Modal Content */}
              <div className="p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                  {/* Basic Information Card */}
                  <div className="p-4 rounded-lg" style={{ backgroundColor: colors.black }}>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"
                        style={{ color: colors.orange }}>
                      <FaUser className="text-sm" /> Basic Information
                    </h3>
                    <div className="space-y-3">
                      {renderUserInfoItem(<FaIdCard />, "User ID", selectedUser._id)}
                      {renderUserInfoItem(<FaEnvelope />, "Email", selectedUser.email)}
                      {renderUserInfoItem(<FaPhone />, "Phone", selectedUser.phonenumber)}
                      {renderUserInfoItem(<FaCalendarAlt />, "Joined", new Date(selectedUser.createdAt).toLocaleDateString())}
                    </div>
                  </div>
                  
                  {/* Account Status Card */}
                  <div className="p-4 rounded-lg" style={{ backgroundColor: colors.black }}>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"
                        style={{ color: colors.orange }}>
                      <FaShieldAlt className="text-sm" /> Account Status
                    </h3>
                    <div className="space-y-3">
                      {renderUserInfoItem(<FaCheckCircle />, "Account Verified", selectedUser.isVerified ? "Verified" : "Not Verified", 
                         selectedUser.isVerified ? colors.blue : colors.pink)}
                      {renderUserInfoItem(<FaCoins />, "Account Balance", `${selectedUser.balance?.toFixed(2) || "0.00"}`)}
                    </div>
                  </div>
                </div>

                {selectedUser.role === "punter" && (
                  <>
                    {/* Punter Details Card */}
                    <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: colors.black }}>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"
                          style={{ color: colors.orange }}>
                        <FaStar className="text-sm" /> Punter Details
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {renderUserInfoItem(<FaTags />, "Primary Category", selectedUser.primaryCategory || "N/A")}
                        {renderUserInfoItem(<FaTags />, "Secondary Category", selectedUser.secondaryCategory || "N/A")}
                        {renderUserInfoItem(<FaCreditCard />, "Promo Code", selectedUser.promoCode || "N/A")}
                      </div>
                    </div>
                    
                    {/* Pricing Plans Card */}
                    <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: colors.black }}>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"
                          style={{ color: colors.orange }}>
                        <FaCoins className="text-sm" /> Pricing Plans
                      </h3>
                      {selectedUser.pricingPlans ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {Object.entries(selectedUser.pricingPlans).map(([planName, planData]) => (
                            planData.price > 0 && (
                              <div key={planName} className="p-4 rounded-lg relative overflow-hidden group transition-all"
                                   style={{ 
                                     backgroundColor: colors.gray,
                                     border: `1px solid ${colors.lightGray}`
                                   }}>
                                <div className="absolute top-0 right-0 w-16 h-16 flex items-center justify-center overflow-hidden">
                                  <div className="absolute w-24 h-24 rotate-45 -translate-y-1/2 translate-x-1/2"
                                       style={{ 
                                         backgroundColor: planName === 'silver' ? colors.lightGray : 
                                                         planName === 'gold' ? colors.orange : colors.blue
                                       }}></div>
                                  {planName === 'gold' && (
                                    <FaCrown size={16} className="relative z-10" style={{ color: colors.black }} />
                                  )}
                                </div>
                                <h4 className="font-bold text-lg capitalize mb-2 relative z-10"
                                    style={{ 
                                      color: planName === 'silver' ? colors.lightGray : 
                                              planName === 'gold' ? colors.orange : colors.blue
                                    }}>
                                  {planName}
                                </h4>
                                <p className="text-2xl font-bold mb-3 relative z-10" style={{ color: colors.white }}>
                                  {planData.price}
                                </p>
                                <ul className="space-y-2 relative z-10">
                                  {planData.offers.map((offer, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm"
                                        style={{ color: colors.lightGray }}>
                                      <FaCheck size={12} className="mt-0.5 flex-shrink-0" 
                                               style={{ color: colors.blue }} />
                                      <span>{offer}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-center py-4" style={{ color: colors.lightGray }}>
                          No pricing plans set up.
                        </p>
                      )}
                    </div>
                  </>
                )}
                
                {/* Action Buttons */}
                {/* <div className="flex flex-wrap gap-3 justify-end pt-4 border-t"
                     style={{ borderColor: colors.lightGray }}>
                  <button className="px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                          style={{ backgroundColor: colors.black, color: colors.white, border: `1px solid ${colors.lightGray}` }}>
                    <FaEdit size={14} /> Edit Profile
                  </button>
                  <button className="px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                          style={{ backgroundColor: colors.pink, color: colors.black }}>
                    <FaBan size={14} /> Suspend Account
                  </button>
                  <button className="px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                          style={{ backgroundColor: colors.blue, color: colors.black }}>
                    <FaCheckCircle size={14} /> Activate Account
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Updated renderUserInfoItem function with optional color parameter
const renderUserInfoItem = (icon, title, value, valueColor) => {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3">
      <div style={{ color: "#8c8c8c" }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs" style={{ color: "#8c8c8c" }}>
          {title}
        </p>
        <p className="font-medium truncate" style={{ color: valueColor || "#efefef" }}>
          {value}
        </p>
      </div>
    </div>
  );
};

export default UsersPage;