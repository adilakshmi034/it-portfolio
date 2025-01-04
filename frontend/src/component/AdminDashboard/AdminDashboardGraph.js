import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  Tooltip,
  Legend,
  ResponsiveContainer,
  XAxis
} from "recharts";
import axios from "axios";
import axiosInstance from "../../axiosInstance";

const AdminDashboardGraph = () => {
  const [data, setData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [totalSales, setTotalSales] = useState(0);
  const [totalLeads, setTotalLeads] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  // Retrieve adminId from localStorage
  const adminId = localStorage.getItem("clients_Id");

  useEffect(() => {
    if (!adminId) {
      console.error("Admin ID is missing. Please log in again.");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `${process.env.REACT_APP_API_URL}/api/dashboard/${adminId}`,
          { params: { year } }
        );

        const fetchedData = response.data.map((item) => ({
          month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][item.month - 1],
          sales: item.salesCount || 0,
          leads: item.leadsCount || 0,
          products: item.productCount || 0,
        }));

        setData(fetchedData);

        // Calculate totals
        setTotalSales(fetchedData.reduce((acc, curr) => acc + curr.sales, 0));
        setTotalLeads(fetchedData.reduce((acc, curr) => acc + curr.leads, 0));
        setTotalProducts(fetchedData.reduce((acc, curr) => acc + curr.products, 0));
      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [adminId, year]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Sales Card */}
      <div className="card">
        <h3 className="superAdmindashboardHeadings">Number of Sales</h3>
        <p className="Superadmin_totalCounts">Total Sales: {totalSales}</p>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="sales" stroke="#82ca9d" fillOpacity={1} fill="url(#colorSales)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Leads Card */}
      <div className="card">
        <h3 className="superAdmindashboardHeadings">Number of Leads</h3>
        <p className="Superadmin_totalCounts">Total Leads: {totalLeads}</p>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ffc658" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="leads" stroke="#ffc658" fillOpacity={1} fill="url(#colorLeads)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Products Card */}
      <div className="card">
        <h3 className="superAdmindashboardHeadings">Number of Products</h3>
        <p className="Superadmin_totalCounts">Total Products: {totalProducts}</p>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorProducts" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff7300" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ff7300" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="products" stroke="#ff7300" fillOpacity={1} fill="url(#colorProducts)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboardGraph;
