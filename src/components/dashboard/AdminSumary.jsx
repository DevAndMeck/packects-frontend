import React, { useEffect, useState } from 'react';
import SummaryCard from './SummaryCard';
import { FaSearchDollar, FaShopify, FaUser } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Link } from 'react-router-dom'; // Para manejar la navegación

// Registrar los componentes de Chart.js
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AdminSummary = () => {
  const [employees, setEmployees] = useState([]);
  const [sales, setSales] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);

  // Cargar datos desde localStorage cuando el componente se monte
  useEffect(() => {
    const storedEmployees = JSON.parse(localStorage.getItem('employees')) || [];
    const storedSales = JSON.parse(localStorage.getItem('sales')) || [];
    const storedClients = JSON.parse(localStorage.getItem('clients')) || [];
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];

    setEmployees(storedEmployees);
    setSales(storedSales);
    setClients(storedClients);
    setProducts(storedProducts);
  }, []);

  // Obtener el total de ventas del mes actual
  const getMonthlySales = () => {
    const currentMonth = new Date().getMonth();
    return sales.filter((sale) => new Date(sale.date).getMonth() === currentMonth).length;
  };

  // Simular datos de ventas si no hay datos en localStorage
  const salesData = {
    daily: sales.map(sale => sale.amount) || [100, 200, 150, 250, 300, 400, 350],
    weekly: [700, 800, 750, 850, 900, 950, 1000], // Simulación de datos semanales
    monthly: [3000, 3500, 3300, 3800, 4200, 4500, 4700] // Simulación de datos mensuales
  };

  // Datos para el gráfico de ventas diarias
  const dailySalesChart = {
    labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    datasets: [
      {
        label: 'Ventas Diarias',
        data: salesData.daily,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  // Datos para el gráfico de ventas semanales
  const weeklySalesChart = {
    labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
    datasets: [
      {
        label: 'Ventas Semanales',
        data: salesData.weekly.slice(0, 4),
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  // Datos para el gráfico de ventas mensuales
  const monthlySalesChart = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
    datasets: [
      {
        label: 'Ventas Mensuales',
        data: salesData.monthly,
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  return (
    <div className="p-6 ml-12 lg:ml-12 pt-16">
      <h3 className="text-2xl font-bold text-slate-900">Panel de Control</h3>

      {/* Resumen con las tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <Link to="/admin-empleados">
          <SummaryCard
            icon={<FaUser className="text-white text-3xl" />}
            text="Total de Empleados"
            number={employees.length}
            color="bg-teal-600"
          />
        </Link>
        <Link to="/admin-ventas">
          <SummaryCard
            icon={<FaShopify className="text-white text-3xl" />}
            text="Total de Ventas"
            number={getMonthlySales()}
            color="bg-yellow-600"
          />
        </Link>
        <Link to="/admin-clientes">
          <SummaryCard
            icon={<FaUser className="text-white text-3xl" />}
            text="Total de Clientes"
            number={clients.length}
            color="bg-blue-600"
          />
        </Link>
        <Link to="/admin-productos">
          <SummaryCard
            icon={<FaSearchDollar className="text-white text-3xl" />}
            text="Total de Productos"
            number={products.length}
            color="bg-green-600"
          />
        </Link>
      </div>

      {/* Gráficos de ventas */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-slate-800 mb-4">Gráficas de Ventas</h3>

        {/* Gráfico de Ventas Diarias */}
        <div className="mb-8">
          <h4 className="text-lg font-medium text-slate-700">Ventas Diarias</h4>
          <Line data={dailySalesChart} />
        </div>

        {/* Gráfico de Ventas Semanales */}
        <div className="mb-8">
          <h4 className="text-lg font-medium text-slate-700">Ventas Semanales</h4>
          <Line data={weeklySalesChart} />
        </div>

        {/* Gráfico de Ventas Mensuales */}
        <div>
          <h4 className="text-lg font-medium text-slate-700">Ventas Mensuales</h4>
          <Line data={monthlySalesChart} />
        </div>
      </div>
    </div>
  );
};

export default AdminSummary;
