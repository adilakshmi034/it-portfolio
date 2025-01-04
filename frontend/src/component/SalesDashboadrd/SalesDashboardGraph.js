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

const SalesDashboardGraph = () => {
  const [data, setData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [totalLeads, setTotalLeads] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  // Retrieve roleId from localStorage
  const roleId = localStorage.getItem("clients_Id");

  useEffect(() => {
    if (!roleId) {
      console.error("Role ID is missing. Please log in again.");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `${process.env.REACT_APP_API_URL}/api/dashboard/get/${roleId}`, 
          { params: { year } }
        );

        const fetchedData = response.data.map((item) => ({
          month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][item.month - 1],
          leads: item.leadsCount || 0,
          products: item.productsCount || 0,
        }));

        setData(fetchedData);

        // Calculate totals
        setTotalLeads(fetchedData.reduce((acc, curr) => acc + curr.leads, 0));
        setTotalProducts(fetchedData.reduce((acc, curr) => acc + curr.products, 0));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [roleId, year]);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="dashboard-container">
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

export default SalesDashboardGraph;
