import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Outlet,
} from "react-router-dom";
import localforage from "localforage";
import Login from "./pages/Login";
import TabLayout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Transact from "./pages/Transactions";
import Kyc from "./pages/Kyc";
import Email from "./pages/Email";
import Accounts from "./pages/Accounts";

// ProtectedLayout component to check for authentication token
const ProtectedLayout = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await localforage.getItem("token"); // Assumes the token is saved with the key "token"
        if (token) {
          setIsAuthenticated(true);
        } else {
          navigate("/"); // Redirect to login if no token is found
        }
      } catch (error) {
        console.error("Error checking token:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    checkToken();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>; // Or a more advanced loading spinner
  }

  return isAuthenticated ? <Outlet /> : null;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Protected Routes */}
        {/* <Route element={<ProtectedLayout />}> */}
        <Route path="/admin" element={<TabLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="transact" element={<Transact />} />
          <Route path="kyc" element={<Kyc />} />
          <Route path="email" element={<Email />} />
          <Route path="accounts" element={<Accounts />} />
        </Route>
        {/* </Route> */}
      </Routes>
    </Router>
  );
}
