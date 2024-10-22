import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement } from 'chart.js';

// Registrar las escalas que vas a utilizar
Chart.register(CategoryScale, LinearScale, BarElement);

const SalesCharts = ({ salesData }) => {
  const processData = (timeFrame) => {
    const salesByTimeFrame = salesData.reduce((acc, sale) => {
      const date = new Date(sale.date);
      const key = timeFrame === 'daily' ? date.toLocaleDateString() :
                  timeFrame === 'weekly' ? `${date.getFullYear()}-${date.getWeek()}` :
                  timeFrame === 'biweekly' ? `${date.getFullYear()}-${Math.floor(date.getDate() / 14)}` :
                  date.getMonth() + 1; // monthly

      acc[key] = (acc[key] || 0) + sale.amount;
      return acc;
    }, {});

    return {
      labels: Object.keys(salesByTimeFrame),
      data: Object.values(salesByTimeFrame),
    };
  };

  const dailyData = processData('daily');
  const chartData = {
    labels: dailyData.labels,
    datasets: [
      {
        label: 'Ventas Diarias',
        data: dailyData.data,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <div>
      <h3 className='text-2xl font-bold text-slate-900'>Gráfica de Ventas Diarias</h3>
      <Bar data={chartData} />
    </div>
  );
};

export default SalesCharts;
