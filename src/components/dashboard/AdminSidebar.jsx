import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaCogs, FaSearchDollar, FaShopify, FaTachometerAlt, FaUser, FaUsers } from 'react-icons/fa';

const AdminSidebar = () => {
  const navItems = [
    { to: "/admin-dashboard", icon: FaTachometerAlt, label: "Dashboard" },
    { to: "/admin-empleados", icon: FaUsers, label: "Empleados" },
    { to: "/admin-ventas", icon: FaShopify, label: "Ventas" },
    { to: "/admin-clientes", icon: FaUser, label: "Clientes" },
    { to: "/admin-productos", icon: FaSearchDollar, label: "Productos" },
    // { to: "/admin-administrar", icon: FaCogs, label: "Administrar" },
  ];

  return (
    <div className="bg-gradient-to-b from-blue-600 to-slate-950 text-white h-screen fixed left-0 top-0 bottom-0 w-64 lg:w-72 z-40 shadow-xl overflow-y-auto">
      <div className="bg-black bg-opacity-30 h-16 flex items-center justify-center">
        <h3 className="text-3xl text-center font-bold tracking-wide">MENU</h3>
      </div>
      
      <div className="flex items-center justify-center py-8">
        <img src="/assets/a.png" alt="Logo de la empresa" className="w-40 h-40 rounded-full shadow-lg border-4 border-white transition-transform duration-300 hover:scale-105" />
      </div>

      <nav className="px-4 mt-4 space-y-2">
        {navItems.map((item) => (
          <NavLink 
            key={item.to}
            to={item.to} 
            className={({ isActive }) => `
              flex items-center text-lg font-medium space-x-4 py-3 px-4 rounded-lg
              transition duration-300 ease-in-out transform hover:scale-102
              ${isActive 
                ? 'bg-white text-blue-800 shadow-md' 
                : 'hover:bg-blue-600 hover:bg-opacity-50'
              }
            `}
          >
            <item.icon className="text-2xl" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;