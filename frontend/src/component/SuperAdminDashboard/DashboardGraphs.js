import React, { useEffect, useState, useRef } from 'react';
import {
  AreaChart,
  Area,
  Tooltip,
  Legend,
  ResponsiveContainer,
  XAxis
} from 'recharts';
import './DashboardGraphs.css';
import axiosInstance from '../../axiosInstance';

const DashboardGraphs = () => {
  const [data, setData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const dashboardRef = useRef(null); // Reference for the container
  const storedId = localStorage.getItem("clients_Id");

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // States for total counts
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalLeads, setTotalLeads] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/dashboard/yearly-records/${storedId}`, {
          params: { year }
        });

        const fetchedData = response.data.map(item => ({
          month: monthNames[item.month - 1],
          admins: item.adminCount,
          sales: item.salesCount,
          leads: item.leadsCount,
          products: item.productCount
        }));

        setData(fetchedData);

        // Calculate total counts
        const totalAdminsCount = fetchedData.reduce((acc, curr) => acc + curr.admins, 0);
        const totalSalesCount = fetchedData.reduce((acc, curr) => acc + curr.sales, 0);
        const totalLeadsCount = fetchedData.reduce((acc, curr) => acc + curr.leads, 0);
        const totalProductsCount = fetchedData.reduce((acc, curr) => acc + curr.products, 0);

        setTotalAdmins(totalAdminsCount);
        setTotalSales(totalSalesCount);
        setTotalLeads(totalLeadsCount);
        setTotalProducts(totalProductsCount);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [year]);

  return (
    <div className="dashboard-container" ref={dashboardRef}>
      {/* Card for Admins */}
      <div className="card">
        <h3 className='superAdmindashboardHeadings'>Number of Admins</h3>
        <p className='Superadmin_totalCounts'>Total Admins: {totalAdmins}</p> {/* Display total admins */}
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorAdmins" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="admins" stroke="#8884d8" fillOpacity={1} fill="url(#colorAdmins)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Card for Sales */}
      <div className="card">
        <h3 className='superAdmindashboardHeadings'>Number of Sales</h3>
        <p className='Superadmin_totalCounts'>Total Sales: {totalSales}</p> {/* Display total sales */}
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

      {/* Card for Leads */}
      <div className="card">
        <h3 className='superAdmindashboardHeadings'>Number of Leads</h3>
        <p className='Superadmin_totalCounts'>Total Leads: {totalLeads}</p> {/* Display total leads */}
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

      {/* Card for Products */}
      <div className="card">
        <h3 className='superAdmindashboardHeadings'>Number of Products</h3>
        <p className='Superadmin_totalCounts'>Total Products: {totalProducts}</p> {/* Display total products */}
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

export default DashboardGraphs;
