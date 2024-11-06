import React from 'react';
import { useAuth } from '../context/authContext'; 
import EmployeesSidebar from '../components/dashboard/EmployeesSidebar';
import EmNavbar from '../components/dashboard/EmNavbar';
import EmployeesSumary from '../components/dashboard/EmployeesSumary';
import { Routes } from 'react-router-dom';


const EmployeesDashboard = () => {
    const { user } = useAuth(); // Aquí usas useAuth correctamente

    return(
      <div className='flex'>
        
        <div className='flex-1 ml-64 bg-gray-100 h-screen'>
          <Routes>
            
          </Routes>
          <EmNavbar/>
          <EmployeesSidebar/>
          <EmployeesSumary/>
        </div>
      </div>
    );
};

export default EmployeesDashboard;
