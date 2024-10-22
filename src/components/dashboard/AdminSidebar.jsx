import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaCogs, FaSearchDollar, FaShopify, FaTachometerAlt, FaUser } from 'react-icons/fa';

const AdminSidebar = () => {
  return (
    <div className='bg-blue-600 text-white h-screen fixed left-0 top-0 bottom-0 w-64 lg:w-72 z-40 shadow-lg'>
      {/* Título sección */}
      <div className='bg-slate-900 h-16 flex items-center justify-center'>
        <h3 className='text-2xl text-center font-bold tracking-wide'>Empleados</h3>
      </div>
      
      {/* Logo de la empresa */}
      <div className='flex items-center justify-center py-8 bg-blue-600'>
        <img src='/src/assets/a.png' alt='Logo de la empresa' className='w-36 h-36 rounded-full shadow-md' />
      </div>

      {/* Links de navegación */}
      <div className='px-4 mt-4 space-y-2'>
        <NavLink 
          to="/admin-dashboard" 
          className='flex items-center text-lg font-medium space-x-4 block py-3 px-4 rounded-md hover:bg-slate-700 transition duration-200 transform hover:scale-105'>
          <FaTachometerAlt className='text-2xl' />
          <span>DashBoard</span>
        </NavLink>

        <NavLink to="/admin-empleados" className='flex items-center text-lg font-medium space-x-4 block py-3 px-4 rounded-md hover:bg-slate-700 transition duration-200 transform hover:scale-105'>
          <FaUser className='text-2xl' />
          <span>Empleados</span>
        </NavLink>

        <NavLink to="/admin-ventas" className='flex items-center text-lg font-medium space-x-4 block py-3 px-4 rounded-md hover:bg-slate-700 transition duration-200 transform hover:scale-105'>
          <FaShopify className='text-2xl' />
          <span>Ventas</span>
        </NavLink>

        <NavLink to="/admin-clientes" className='flex items-center text-lg font-medium space-x-4 block py-3 px-4 rounded-md hover:bg-slate-700 transition duration-200 transform hover:scale-105'>
          <FaUser className='text-2xl' />
          <span>Clientes</span>
        </NavLink>

        <NavLink to="/admin-productos" className='flex items-center text-lg font-medium space-x-4 block py-3 px-4 rounded-md hover:bg-slate-700 transition duration-200 transform hover:scale-105'>
          <FaSearchDollar className='text-2xl' />
          <span>Productos</span>
        </NavLink>

        {/* <NavLink to="/admin-administrar" className='flex items-center text-lg font-medium space-x-4 block py-3 px-4 rounded-md hover:bg-slate-700 transition duration-200 transform hover:scale-105'>
          <FaCogs className='text-2xl' />
          <span>Administrar</span>
        </NavLink> */}
      </div>
    </div>
  );
};

export default AdminSidebar;
