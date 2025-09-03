import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaTrash,
  FaCopy,
  FaCheck,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import Api from "../components/Api"; // Assuming Api is an Axios instance
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Accounts = () => {
  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("add");
  const [loading, setLoading] = useState(true);

  // Fetch admins on component mount
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${Api}/admin/getAdmins`);
      setAdmins(response.data.data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  };

  // Generate password based on first and last name
  useEffect(() => {
    if (newAdmin.firstName && newAdmin.lastName) {
      const specialChars = ["!", "@", "#", "$", "%", "&", "*"];
      const randomChar =
        specialChars[Math.floor(Math.random() * specialChars.length)];
      const numbers = Math.floor(100 + Math.random() * 900);

      const generatedPassword =
        newAdmin.firstName.charAt(0).toUpperCase() +
        newAdmin.lastName.charAt(0).toLowerCase() +
        numbers +
        randomChar;

      setNewAdmin((prev) => ({ ...prev, password: generatedPassword }));
    }
  }, [newAdmin.firstName, newAdmin.lastName]);

  const validateForm = () => {
    const newErrors = {};
    if (!newAdmin.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!newAdmin.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!newAdmin.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(newAdmin.email)) {
      newErrors.email = "Email is invalid";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAdmin = async () => {
    if (validateForm()) {
      try {
        const adminData = {
          firstname: newAdmin.firstName,
          lastname: newAdmin.lastName,
          email: newAdmin.email,
          password: newAdmin.password,
        };
        const response = await axios.post(`${Api}/admin/Signup`, adminData);
        setAdmins([...admins, response.data]);
        setNewAdmin({ firstName: "", lastName: "", email: "", password: "" });
        toast.success("Admin account created successfully!");
      } catch (error) {
        toast.error("Failed to add admin.");
        console.error("Error adding admin:", error);
      }
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        await axios.post(`${Api}/admin/deleteAdmin`, { id });
        setAdmins(admins.filter((admin) => admin._id !== id));
        toast.success("Admin account deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete admin.");
        console.error("Error deleting admin:", error);
      }
    }
  };

  const handleCopyPassword = (password) => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Password copied to clipboard!");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin({ ...newAdmin, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  return (
    <div className="min-h-screen bg-[#09100d] text-[#efefef] p-4">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6 md:hidden">
          <h1 className="text-2xl font-bold text-[#fea92a]">Admin Accounts</h1>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-[#efefef] hover:text-[#18ffc8]"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-[#fea92a] hidden md:block">
          Admin Accounts Management
        </h1>

        {isMenuOpen && (
          <div className="md:hidden mb-6 bg-[#162821] rounded-lg p-4">
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setActiveTab("add");
                  setIsMenuOpen(false);
                }}
                className={`px-4 py-2 rounded ${
                  activeTab === "add"
                    ? "bg-[#fea92a] text-[#09100d]"
                    : "bg-[#376553]"
                }`}
              >
                Add Admin
              </button>
              <button
                onClick={() => {
                  setActiveTab("list");
                  setIsMenuOpen(false);
                }}
                className={`px-4 py-2 rounded ${
                  activeTab === "list"
                    ? "bg-[#fea92a] text-[#09100d]"
                    : "bg-[#376553]"
                }`}
              >
                View Admins
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          <div className="hidden md:flex md:flex-col md:w-1/4 lg:w-1/5 gap-2">
            <button
              onClick={() => setActiveTab("add")}
              className={`px-4 py-3 text-left rounded-lg ${
                activeTab === "add"
                  ? "bg-[#fea92a] text-[#09100d] font-semibold"
                  : "bg-[#162821] hover:bg-[#376553]"
              }`}
            >
              Add New Admin
            </button>
            <button
              onClick={() => setActiveTab("list")}
              className={`px-4 py-3 text-left rounded-lg ${
                activeTab === "list"
                  ? "bg-[#fea92a] text-[#09100d] font-semibold"
                  : "bg-[#162821] hover:bg-[#376553]"
              }`}
            >
              View Admins
            </button>
          </div>

          <div className="w-full md:w-3/4 lg:w-4/5">
            <div
              className={`bg-[#162821] rounded-lg p-4 md:p-6 mb-6 shadow-lg ${
                activeTab !== "add" && "hidden md:block"
              }`}
            >
              <h2 className="text-xl font-semibold mb-4 text-[#18ffc8]">
                Add New Admin
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={newAdmin.firstName}
                    onChange={handleInputChange}
                    className={`w-full p-3 rounded bg-[#376553] border ${
                      errors.firstName ? "border-[#f57cff]" : "border-[#376553]"
                    } focus:outline-none focus:ring-2 focus:ring-[#18ffc8]`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="text-[#f57cff] text-sm mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={newAdmin.lastName}
                    onChange={handleInputChange}
                    className={`w-full p-3 rounded bg-[#376553] border ${
                      errors.lastName ? "border-[#f57cff]" : "border-[#376553]"
                    } focus:outline-none focus:ring-2 focus:ring-[#18ffc8]`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="text-[#f57cff] text-sm mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newAdmin.email}
                  onChange={handleInputChange}
                  className={`w-full p-3 rounded bg-[#376553] border ${
                    errors.email ? "border-[#f57cff]" : "border-[#376553]"
                  } focus:outline-none focus:ring-2 focus:ring-[#18ffc8]`}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="text-[#f57cff] text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">
                  Generated Password
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={newAdmin.password}
                    readOnly
                    className="w-full p-3 pr-20 rounded bg-[#376553] border border-[#376553] focus:outline-none focus:ring-2 focus:ring-[#18ffc8]"
                  />
                  <div className="absolute right-2 top-2 flex space-x-2">
                    <button
                      onClick={() => handleCopyPassword(newAdmin.password)}
                      className="p-2 text-[#efefef] hover:text-[#18ffc8] transition-colors"
                    >
                      {copied ? (
                        <FaCheck className="text-green-400" />
                      ) : (
                        <FaCopy />
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-[#855391] mt-1">
                  Password is automatically generated from first and last name
                </p>
              </div>

              <button
                onClick={handleAddAdmin}
                className="flex items-center justify-center gap-2 w-full md:w-auto bg-[#fea92a] hover:bg-[#e5971e] text-[#09100d] font-semibold py-3 px-6 rounded transition-colors"
              >
                <FaPlus /> Add Admin
              </button>
            </div>

            <div
              className={`bg-[#162821] rounded-lg p-4 md:p-6 shadow-lg ${
                activeTab !== "list" && "hidden md:block"
              }`}
            >
              <h2 className="text-xl font-semibold mb-4 text-[#18ffc8]">
                Existing Admins
              </h2>

              {loading ? (
                <p className="text-center py-8 text-[#855391]">
                  Loading admins...
                </p>
              ) : admins.length === 0 ? (
                <p className="text-center py-8 text-[#855391]">
                  No admins found. Add your first admin above.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full hidden md:table">
                    <thead>
                      <tr className="border-b border-[#376553]">
                        <th className="py-3 px-4 text-left">Name</th>
                        <th className="py-3 px-4 text-left">Email</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {admins.map((admin) => (
                        <tr
                          key={admin._id}
                          className="border-b border-[#376553] hover:bg-[#376553] transition-colors"
                        >
                          <td className="py-3 px-4">
                            {admin.firstname} {admin.lastname}
                          </td>
                          <td className="py-3 px-4">{admin.email}</td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleDeleteAdmin(admin._id)}
                              className="text-[#f57cff] hover:text-[#ff5ef9] p-2 transition-colors"
                              title="Delete admin"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="md:hidden space-y-4">
                    {admins.map((admin) => (
                      <div
                        key={admin._id}
                        className="bg-[#376553] rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-lg">
                            {admin.firstName} {admin.lastName}
                          </h3>
                          <button
                            onClick={() => handleDeleteAdmin(admin._id)}
                            className="text-[#f57cff] hover:text-[#ff5ef9] p-1"
                            title="Delete admin"
                          >
                            <FaTrash />
                          </button>
                        </div>
                        <div className="mb-3">
                          <p className="text-sm text-[#efefef]/80">Email</p>
                          <p className="truncate">{admin.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accounts;
