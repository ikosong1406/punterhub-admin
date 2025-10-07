import { useState, useEffect } from "react";
import {
  FaUsers,
  FaSignal,
  FaArrowUp,
  FaArrowDown,
  FaCoins
} from "react-icons/fa";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import logo from "../assets/logo1.png";
import Api from "../components/Api";
import logoImage from "../assets/logo2.png";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [dashboardData, setDashboardData] = useState({
    users: { total: 0, growth: 0, chartData: null },
    revenue: { total: 0, growth: 0, chartData: null },
    signals: { total: 0, growth: 0, chartData: null },
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
    const fetchData = async () => {
      try {
        const [usersRes, transactionsRes, signalsRes] = await Promise.all([
          axios.get(`${Api}/admin/getUsers`),
          axios.get(`${Api}/admin/getTransactions`),
          axios.get(`${Api}/admin/getSignals`),
        ]);

        // Process Users data
        const users = usersRes.data.data;
        const totalUsers = users.length;
        const usersByMonth = users.reduce((acc, user) => {
          const month = new Date(user.createdAt).toLocaleString("en-US", {
            month: "short",
          });
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, {});
        const userLabels = Object.keys(usersByMonth);
        const userDataPoints = Object.values(usersByMonth);

        // Process Revenue data
        const transactions = transactionsRes.data.data;
        const subscriptionTransactions = transactions.filter(
          (t) => t.type === "subscription"
        );

        // Calculate total revenue, handling negative values
        const totalSubscriptionAmount = subscriptionTransactions.reduce(
          (acc, t) => acc + Math.abs(t.amount),
          0
        );
        const totalRevenue = totalSubscriptionAmount * 0.2; // 20% of subscription amount

        const revenueByMonth = subscriptionTransactions.reduce((acc, t) => {
          const month = new Date(t.createdAt).toLocaleString("en-US", {
            month: "short",
          });
          acc[month] = (acc[month] || 0) + Math.abs(t.amount) * 0.2;
          return acc;
        }, {});
        const revenueLabels = Object.keys(revenueByMonth);
        const revenueDataPoints = Object.values(revenueByMonth);

        // Process Signals data
        const signals = signalsRes.data.data;
        const totalSignals = signals.length;
        const signalsByMonth = signals.reduce((acc, signal) => {
          const month = new Date(signal.createdAt).toLocaleString("en-US", {
            month: "short",
          });
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, {});
        const signalLabels = Object.keys(signalsByMonth);
        const signalDataPoints = Object.values(signalsByMonth);

        // Calculate growth percentages (simplified example)
        const userGrowth =
          userDataPoints.length > 1
            ? ((userDataPoints[userDataPoints.length - 1] -
                userDataPoints[userDataPoints.length - 2]) /
                userDataPoints[userDataPoints.length - 2]) *
              100
            : 0;
        const revenueGrowth =
          revenueDataPoints.length > 1
            ? ((revenueDataPoints[revenueDataPoints.length - 1] -
                revenueDataPoints[revenueDataPoints.length - 2]) /
                revenueDataPoints[revenueDataPoints.length - 2]) *
              100
            : 0;
        const signalGrowth =
          signalDataPoints.length > 1
            ? ((signalDataPoints[signalDataPoints.length - 1] -
                signalDataPoints[signalDataPoints.length - 2]) /
                signalDataPoints[signalDataPoints.length - 2]) *
              100
            : 0;

        setDashboardData({
          users: {
            total: totalUsers,
            growth: userGrowth.toFixed(2),
            chartData: {
              labels: userLabels,
              datasets: [
                {
                  label: "New Users",
                  data: userDataPoints,
                  borderColor: colors.blue,
                  backgroundColor: colors.blue,
                },
              ],
            },
          },
          revenue: {
            total: totalRevenue,
            growth: revenueGrowth.toFixed(2),
            chartData: {
              labels: revenueLabels,
              datasets: [
                {
                  label: "Revenue",
                  data: revenueDataPoints,
                  borderColor: colors.orange,
                  backgroundColor: colors.orange,
                },
              ],
            },
          },
          signals: {
            total: totalSignals,
            growth: signalGrowth.toFixed(2),
            chartData: {
              labels: signalLabels,
              datasets: [
                {
                  label: "Signals Posted",
                  data: signalDataPoints,
                  backgroundColor: colors.purple,
                },
              ],
            },
          },
        });
      } catch (err) {
        setError("Failed to fetch data. Please check the API endpoints.");
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
      title: { display: false },
    },
    scales: {
      x: {
        grid: { color: colors.lightGray, borderColor: colors.lightGray },
        ticks: { color: colors.white },
      },
      y: {
        grid: { color: colors.lightGray, borderColor: colors.lightGray },
        ticks: { color: colors.white },
      },
    },
  };

  const StatCard = ({ title, value, change, icon, iconColor }) => {
    const isGrowth = parseFloat(change) >= 0;
    return (
      <div
        style={{ backgroundColor: colors.gray }}
        className="rounded-lg p-6 shadow-lg flex-1"
      >
        <div className="flex justify-between items-center mb-4">
          <span
            className="text-sm font-medium uppercase"
            style={{ color: colors.lightGray }}
          >
            {title}
          </span>
          <span style={{ color: iconColor }}>{icon}</span>
        </div>
        <div className="flex items-end justify-between">
          <h2
            className="text-3xl md:text-4xl font-bold"
            style={{ color: colors.white }}
          >
            {title === "Total Revenue"
              ? `${Number(value).toLocaleString()}`
              : Number(value).toLocaleString()}
          </h2>
          <div className="flex items-center text-sm font-semibold">
            <span
              className={`flex items-center gap-1 ${
                isGrowth ? "text-blue" : "text-pink"
              }`}
              style={{ color: isGrowth ? colors.blue : colors.pink }}
            >
              {isGrowth ? <FaArrowUp /> : <FaArrowDown />}
              {Math.abs(change)}%
            </span>
          </div>
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
        {error}
      </div>
    );
  }

  return (
    <div
      style={{ backgroundColor: colors.black }}
      className="min-h-screen text-white p-4 md:p-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <img src={logo} alt="Logo" className="h-10" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={dashboardData.users.total}
            change={dashboardData.users.growth}
            icon={<FaUsers size={24} />}
            iconColor={colors.blue}
          />
          <StatCard
            title="Total Revenue"
            value={dashboardData.revenue.total}
            change={dashboardData.revenue.growth}
            icon={<FaCoins size={24} />}
            iconColor={colors.orange}
          />
          <StatCard
            title="Signals Posted"
            value={dashboardData.signals.total}
            change={dashboardData.signals.growth}
            icon={<FaSignal size={24} />}
            iconColor={colors.purple}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div
            style={{ backgroundColor: colors.gray }}
            className="rounded-lg p-6 shadow-lg"
          >
            <h3
              className="text-xl font-semibold mb-4"
              style={{ color: colors.white }}
            >
              User Growth
            </h3>
            <div className="h-64">
              <Line
                data={dashboardData.users.chartData}
                options={chartOptions}
              />
            </div>
          </div>
          <div
            style={{ backgroundColor: colors.gray }}
            className="rounded-lg p-6 shadow-lg"
          >
            <h3
              className="text-xl font-semibold mb-4"
              style={{ color: colors.white }}
            >
              Signals Trend
            </h3>
            <div className="h-64">
              <Bar
                data={dashboardData.signals.chartData}
                options={chartOptions}
              />
            </div>
          </div>
        </div>

        <div
          style={{ backgroundColor: colors.gray }}
          className="rounded-lg p-6 shadow-lg"
        >
          <h3
            className="text-xl font-semibold mb-4"
            style={{ color: colors.white }}
          >
            Revenue Analysis
          </h3>
          <div className="h-64">
            <Line
              data={dashboardData.revenue.chartData}
              options={chartOptions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
