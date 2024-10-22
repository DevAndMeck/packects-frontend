import React from 'react';
import { useAuth } from '../context/authContext'; 
import AdminSidebar from '../components/dashboard/AdminSidebar';
import Navbar from '../components/dashboard/Navbar';
import AdminSummary from '../components/dashboard/AdminSumary';
import { Routes } from 'react-router-dom';


const AdminDashboard = () => {
    const { user } = useAuth(); // Aquí usas useAuth correctamente

    return(
      <div className='flex'>
        
        <div className='flex-1 ml-64 bg-gray-100 h-screen'>
          <Routes>
            
          </Routes>
          <Navbar/>
          <AdminSidebar/>
          <AdminSummary/>
        </div>
      </div>
    );
};

export default AdminDashboard;
