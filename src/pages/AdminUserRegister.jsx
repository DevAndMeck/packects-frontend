import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

const UserRegister = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('employee');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [users, setUsers] = useState([]); // Estado para los usuarios registrados

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError('');

        const userData = { name, email, password, role };

        try {
            const response = await fetch('http://localhost:3000/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error('Error al registrar el usuario');
            }

            const newUser = await response.json();
            setUsers((prevUsers) => [...prevUsers, newUser]);

            alert('Usuario registrado correctamente');
            setName('');
            setEmail('');
            setPassword('');
            setRole('employee');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id) => {
        alert(`Editar usuario con id ${id}`);
    };

    const handleDelete = (id) => {
        setUsers(users.filter(user => user.id !== id));
    };

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch('http://localhost:3000/api/users');
            const data = await response.json();
            setUsers(data);
        };

        fetchUsers();
    }, []);

    return (
        <Layout>
            <div className="max-w-6xl mx-auto p-8 bg-white shadow-lg rounded-lg">
                <h2 className="text-4xl font-bold text-center text-blue-600 mb-8">Crear Usuario</h2>
                {error && <div className="text-red-500 text-center mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg mb-8">
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Nombre</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Correo electrónico</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="role" className="block text-sm font-semibold text-gray-700">Rol</label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="employee">Empleado</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className={`w-full px-4 py-2 bg-blue-600 text-white rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Registrando...' : 'Registrar Usuario'}
                        </button>
                    </div>
                </form>

                {/* <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-gray-600">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left">Nombre</th>
                                <th className="px-4 py-2 text-left">Correo</th>
                                <th className="px-4 py-2 text-left">Rol</th>
                                <th className="px-4 py-2 text-left">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-2">{user.name}</td>
                                    <td className="px-4 py-2">{user.email}</td>
                                    <td className="px-4 py-2">{user.role}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex space-x-2 justify-center">
                                            <button
                                                onClick={() => handleEdit(user.id)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div> */}
            </div>
        </Layout>
    );
};

export default UserRegister;
