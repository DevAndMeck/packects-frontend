import React from 'react';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa'; // Asegúrate de instalar react-icons

const Navbar = () => {
    const { user, logout } = useAuth(); // Asegúrate de que 'logout' esté disponible en el contexto
    const navigate = useNavigate(); // Usar el hook useNavigate

    const handleLogout = () => {
        logout(); // Llama a la función de logout
        navigate('/login'); // Redirige al login después de cerrar sesión
    };

    return (
        <div className='flex items-center justify-between h-16 bg-slate-900 text-white px-5 shadow-md'>
            <p className='mx-10 text-xl font-bold'>
                Bienvenido, <span className='font-semibold'>{user ? user.name : 'Admin'}</span>
            </p>
            <button 
                className='flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-800 text-white rounded-lg transition duration-200 shadow-lg transform hover:scale-105'
                onClick={handleLogout} // Maneja el evento de clic
            >
                <FaSignOutAlt className='mr-2' /> {/* Icono de salida */}
                Cerrar Sesion
            </button>
        </div>
    );
};

export default Navbar;
