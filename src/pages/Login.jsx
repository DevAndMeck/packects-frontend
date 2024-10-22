// src/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext'; // Asegúrate de que la ruta sea correcta

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useAuth(); // Asegúrate de que useAuth esté definido y exportado correctamente
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:3000/api/auth/login", 
                { email, password }
            );
            if (response.data.success) {
                login(response.data.user);
                localStorage.setItem("token", response.data.token);
                if (response.data.user.role === "admin") {
                    navigate('/admin-dashboard');
                } else {
                    navigate('/employee-dashboard');
                }
            } else {
                setError(response.data.error || "Error desconocido");
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            setError("Error al intentar iniciar sesión. Verifica tus credenciales.");
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen justify-center bg-gradient-to-b from-blue-600 to-gray-100 space-y-6 p-4">
            <img src="/src/assets/logo.png" alt="Logo de la empresa" className="w-32 h-32 sm:w-40 sm:h-40" />

            <h1 className="font-bold text-3xl sm:text-5xl text-white text-center">Packects</h1>
            <h2 className="font-semibold text-xl sm:text-2xl text-white text-center">Sistema de Optimización de Datos</h2>

            <div className="border shadow-xl rounded-lg p-6 sm:p-8 w-full sm:w-96 bg-white max-w-md">
                <h2 className="font-bold text-2xl sm:text-3xl text-center text-slate-900 mb-4 sm:mb-6">Login</h2>
                {error && <p className='text-red-500'>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-lg text-slate-900">Email</label>
                        <input 
                            type="email" 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ingresa tu correo"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-lg text-slate-900">Contraseña</label>
                        <input 
                            type="password" 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="*******"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-4 flex items-center justify-between">
                        <label className="flex items-center">
                            <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
                            <span className="ml-2 text-slate-900">Recordarme</span>
                        </label>
                        <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">
                            Recuperar Contraseña?
                        </a>
                    </div>
                    <div className="mb-4">
                        <button 
                            type="submit" 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-200"
                        >
                            Ingresar    
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
