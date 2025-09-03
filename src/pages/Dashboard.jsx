import { useState, useEffect } from 'react';
import { FaUsers, FaChartLine, FaSignal, FaMoneyBillWave, FaArrowUp, FaArrowDown, FaCog } from 'react-icons/fa';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

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
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const data = {
    users: {
      total: 5432,
      growth: 12.5,
      chartData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'New Users',
          data: [200, 350, 410, 520, 680, 750],
          borderColor: colors.blue,
          backgroundColor: colors.blue,
        }],
      },
    },
    revenue: {
      total: 123456,
      growth: 7.8,
      chartData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Revenue ($)',
          data: [15000, 22000, 30000, 25000, 40000, 35000],
          borderColor: colors.orange,
          backgroundColor: colors.orange,
        }],
      },
    },
    signals: {
      total: 890,
      growth: -3.2,
      chartData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Signals Posted',
          data: [120, 150, 140, 170, 180, 130],
          backgroundColor: colors.purple,
        }],
      },
    },
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: colors.lightGray,
          borderColor: colors.lightGray,
        },
        ticks: {
          color: colors.white,
        },
      },
      y: {
        grid: {
          color: colors.lightGray,
          borderColor: colors.lightGray,
        },
        ticks: {
          color: colors.white,
        },
      },
    },
  };

  const StatCard = ({ title, value, change, icon, iconColor }) => {
    const isGrowth = change >= 0;
    return (
      <div style={{ backgroundColor: colors.gray }} className="rounded-lg p-6 shadow-lg flex-1">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium uppercase" style={{ color: colors.lightGray }}>{title}</span>
          <span style={{ color: iconColor }}>{icon}</span>
        </div>
        <div className="flex items-end justify-between">
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: colors.white }}>
            {title === "Revenue" ? `$${value.toLocaleString()}` : value.toLocaleString()}
          </h2>
          <div className="flex items-center text-sm font-semibold">
            <span
              className={`flex items-center gap-1 ${isGrowth ? 'text-blue' : 'text-pink'}`}
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

  return (
    <div style={{ backgroundColor: colors.black }} className="min-h-screen text-white p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 style={{ color: colors.orange }} className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <button style={{ backgroundColor: colors.gray, color: colors.white }} className="p-2 rounded-lg">
            <FaCog size={20} />
          </button>
        </div>
        <p style={{ color: colors.lightGray }} className="mb-6 md:mb-8">Quick overview of platform performance.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={data.users.total}
            change={data.users.growth}
            icon={<FaUsers size={24} />}
            iconColor={colors.blue}
          />
          <StatCard
            title="Total Revenue"
            value={data.revenue.total}
            change={data.revenue.growth}
            icon={<FaMoneyBillWave size={24} />}
            iconColor={colors.orange}
          />
          <StatCard
            title="Signals Posted"
            value={data.signals.total}
            change={data.signals.growth}
            icon={<FaSignal size={24} />}
            iconColor={colors.purple}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div style={{ backgroundColor: colors.gray }} className="rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4" style={{ color: colors.white }}>User Growth</h3>
            <div className="h-64">
              <Line data={data.users.chartData} options={chartOptions} />
            </div>
          </div>
          <div style={{ backgroundColor: colors.gray }} className="rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4" style={{ color: colors.white }}>Signals Trend</h3>
            <div className="h-64">
              <Bar data={data.signals.chartData} options={chartOptions} />
            </div>
          </div>
        </div>
        
        <div style={{ backgroundColor: colors.gray }} className="rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4" style={{ color: colors.white }}>Revenue Analysis</h3>
          <div className="h-64">
            <Line data={data.revenue.chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;