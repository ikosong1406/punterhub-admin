import { useState, useEffect } from "react";
import {
  FaUserCircle,
  FaIdCard,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLock,
  FaBars,
  FaTimes,
  FaFilter,
  FaSearch,
  FaCog,
  FaEllipsisV,
  FaEdit,
  FaTrash,
  FaEye,
} from "react-icons/fa";
import axios from "axios";
import Api from "../components/Api"

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
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.location.toLowerCase().includes(query)
      );
    }

    // Sort results
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
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
      user.id === selectedUser.id ? { ...user, status: newStatus } : user
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

  if (loading) {
    return (
      <div
        style={{ backgroundColor: colors.black }}
        className="min-h-screen flex items-center justify-center text-white"
      >
        <p>Loading users...</p>
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
                placeholder="Search users by name, email or location..."
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
              onClick={() => handleSort("name")}
            >
              User {getSortIndicator("name")}
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
              onClick={() => handleSort("location")}
            >
              Location {getSortIndicator("location")}
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
                  key={user.id}
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

        {/* User Detail Modal (Full Screen on Mobile) */}
        {isModalOpen && selectedUser && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50 transition-all duration-300 ease-in-out">
            <div
              className="absolute inset-0 bg-black bg-opacity-75"
              onClick={closeModal}
            ></div>
            <div
              className="relative w-full h-full md:w-3/4 md:h-auto md:max-w-2xl rounded-none md:rounded-3xl overflow-y-auto shadow-2xl"
              style={{
                border: isMobile ? "none" : `2px solid ${colors.gray}`,
                backgroundColor: isMobile ? colors.black : colors.gray,
              }}
            >
              <div className="p-6 h-full md:h-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2
                    className="text-xl font-bold"
                    style={{ color: colors.orange }}
                  >
                    User Profile
                  </h2>
                  <button
                    onClick={closeModal}
                    className="hover:opacity-75 transition-opacity"
                    style={{ color: colors.lightGray }}
                  >
                    <FaTimes size={20} />
                  </button>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                  <div className="flex flex-col items-center">
                    <FaUserCircle
                      size={100}
                      style={{
                        color:
                          selectedUser.role === "punter"
                            ? colors.orange
                            : colors.blue,
                      }}
                      className="mb-4"
                    />
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h3
                      className="text-2xl font-semibold mb-1"
                      style={{ color: colors.white }}
                    >
                      {selectedUser.name}
                    </h3>
                    <span
                      className="px-3 py-1 text-xs font-semibold rounded-full capitalize"
                      style={{
                        backgroundColor: getStatusColor(selectedUser.status),
                        color: colors.black,
                      }}
                    >
                      {selectedUser.status}
                    </span>
                  </div>
                </div>

                <div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-lg"
                  style={{ backgroundColor: colors.black }}
                >
                  <div className="flex items-center gap-3">
                    <FaIdCard style={{ color: colors.lightGray }} />
                    <div>
                      <p className="text-xs" style={{ color: colors.lightGray }}>
                        User ID
                      </p>
                      <p className="font-medium" style={{ color: colors.white }}>
                        {selectedUser.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaEnvelope style={{ color: colors.lightGray }} />
                    <div>
                      <p className="text-xs" style={{ color: colors.lightGray }}>
                        Email
                      </p>
                      <p className="font-medium" style={{ color: colors.white }}>
                        {selectedUser.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaPhone style={{ color: colors.lightGray }} />
                    <div>
                      <p className="text-xs" style={{ color: colors.lightGray }}>
                        Phone
                      </p>
                      <p className="font-medium" style={{ color: colors.white }}>
                        {selectedUser.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaMapMarkerAlt style={{ color: colors.lightGray }} />
                    <div>
                      <p className="text-xs" style={{ color: colors.lightGray }}>
                        Location
                      </p>
                      <p className="font-medium" style={{ color: colors.white }}>
                        {selectedUser.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaLock style={{ color: colors.lightGray }} />
                    <div>
                      <p className="text-xs" style={{ color: colors.lightGray }}>
                        Joined
                      </p>
                      <p className="font-medium" style={{ color: colors.white }}>
                        {selectedUser.joined}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="pt-4 mt-6 border-t"
                  style={{ borderColor: colors.lightGray }}
                >
                  <p
                    className="text-sm mb-4 font-medium"
                    style={{ color: colors.lightGray }}
                  >
                    Admin Actions
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {selectedUser.status !== "active" && (
                      <button
                        onClick={() => updateUserStatus("active")}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-all hover:opacity-90"
                        style={{
                          backgroundColor: colors.blue,
                          color: colors.black,
                        }}
                      >
                        <FaEdit />
                        Activate
                      </button>
                    )}
                    {selectedUser.status !== "inactive" && (
                      <button
                        onClick={() => updateUserStatus("inactive")}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-all hover:opacity-90"
                        style={{
                          backgroundColor: colors.lightGray,
                          color: colors.white,
                        }}
                      >
                        <FaEdit />
                        Deactivate
                      </button>
                    )}
                    {selectedUser.status !== "suspended" && (
                      <button
                        onClick={() => updateUserStatus("suspended")}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-all hover:opacity-90"
                        style={{
                          backgroundColor: colors.pink,
                          color: colors.black,
                        }}
                      >
                        <FaTrash />
                        Suspend
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;