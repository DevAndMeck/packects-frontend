import React from 'react';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUser } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };


    return (
        
        <nav className="bg-gradient-to-r from-blue-600 to-slate-950 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <FaUser className="h-8 w-8 text-white" />
                        <div className="ml-4">
                            <p className="text-lg font-medium">
                                Bienvenido,{' '}
                                <span className="font-bold animate-pulse">
                                    {user ? user.name : ''}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div>
                        <button 
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                            onClick={handleLogout}
                        >
                            <FaSignOutAlt className="mr-2 h-4 w-4" />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;