import React from 'react';
import AdminSidebar from './dashboard/AdminSidebar';
import Navbar from './dashboard/Navbar';

const Layout = ({ children }) => {
  return (
    <div className='flex'>
      {/* Sidebar */}
      <AdminSidebar />

      {/* Contenido principal con el Navbar */}
      <div className='flex-1 ml-64 bg-gray-100 min-h-screen'>
        <Navbar />
        {/* Contenido dinámico que será pasado a través de children */}
        <div className='p-6'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
