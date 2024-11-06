// Layout.jsx
import React from 'react';
import AdminSidebar from './dashboard/AdminSidebar';
import EmployeesSidebar from './dashboard/EmployeesSidebar';
import Navbar from './dashboard/Navbar';
import { useAuth } from '../context/authContext';

const Layout = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="flex">
      {/* Mostrar AdminSidebar solo si el usuario es admin */}
      {user?.role === 'admin' && <AdminSidebar />}
      {/* Mostrar EmployeesSidebar solo si el usuario es empleado */}
      {user?.role === 'employee' && <EmployeesSidebar />}
      
      <div className="flex-1 ml-64 bg-gray-100 min-h-screen">
        <Navbar />
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
