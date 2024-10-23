import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaShoppingCart, FaUserTie, FaBoxes, FaChartLine } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { getAllSales, openDB } from '../salesBD';
import { getProducts } from '../productoDB';
import { fetchEmployees } from '../employeesDB';
import { loadClients } from '../clientBD';

const SummaryCard = ({ icon, text, number, color, to }) => (
  <Link to={to} className="transform transition duration-500 hover:scale-105 w-full">
    <div className={`${color} rounded-xl shadow-lg p-6 flex items-center justify-between h-full`}>
      <div className="flex items-center">
        {React.cloneElement(icon, { className: "text-white text-4xl mr-4" })}
        <div>
          <p className="text-white text-lg font-semibold">{text}</p>
          <p className="text-white text-3xl font-bold">{number}</p>
        </div>
      </div>
      <FaChartLine className="text-white text-2xl" />
    </div>
  </Link>
);

const AdminSummary = () => {
  const [employees, setEmployees] = useState([]);
  const [sales, setSales] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedEmployees = await fetchEmployees();
      const db = await openDB();
      const fetchedSales = await getAllSales(db);
      const fetchedClients = await loadClients();
      const fetchedProducts = await getProducts();

      setEmployees(fetchedEmployees);
      setSales(fetchedSales);
      setClients(fetchedClients);
      setProducts(fetchedProducts);

      // Prepare sales data for chart
      const salesByMonth = fetchedSales.reduce((acc, sale) => {
        const date = new Date(sale.date);
        const month = date.toLocaleString('default', { month: 'short' });
        acc[month] = (acc[month] || 0) + sale.total;
        return acc;
      }, {});

      setSalesData(Object.entries(salesByMonth).map(([month, total]) => ({ month, total })));

      // Prepare product data for chart
      const productCounts = fetchedProducts.reduce((acc, product) => {
        acc[product.name] = (acc[product.name] || 0) + 1;
        return acc;
      }, {});

      setProductData(Object.entries(productCounts).map(([name, count]) => ({ name, count })));
    };

    fetchData();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            icon={<FaUsers />}
            text="Total de Empleados"
            number={employees.length}
            color="bg-blue-600"
            to="/admin-empleados"
          />
          <SummaryCard
            icon={<FaShoppingCart />}
            text="Total de Ventas"
            number={sales.length}
            color="bg-yellow-600"
            to="/admin-ventas"
          />
          <SummaryCard
            icon={<FaUserTie />}
            text="Total de Clientes"
            number={clients.length}
            color="bg-green-600"
            to="/admin-clientes"
          />
          <SummaryCard
            icon={<FaBoxes />}
            text="Total de Productos"
            number={products.length}
            color="bg-purple-600"
            to="/admin-productos"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Ventas Mensuales</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Productos por Categoría</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={productData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSummary;