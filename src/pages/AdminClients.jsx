import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../components/Layout';
import { loadClients, addClient, saveEditedClient, deleteClient } from '../components/clientBD';
import searchIcon from '/assets/search.svg';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newClient, setNewClient] = useState({ name: '', address: '', email: '', dpi: '', nit: '', phone: '' });
  const [editingClient, setEditingClient] = useState(null);

  const fetchClients = async () => {
    try {
      const allClients = await loadClients();
      setClients(allClients);
    } catch (error) {
      console.error("Error al cargar los clientes:", error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleAddClient = async () => {
    try {
      const id = await addClient(newClient);
      setClients([...clients, { ...newClient, id }]);
      setNewClient({ name: '', address: '', email: '', dpi: '', nit: '', phone: '' });
    } catch (error) {
      console.error("Error al agregar el cliente:", error);
    }
  };

  const handleEditClient = async () => {
    try {
      await saveEditedClient(editingClient);
      setClients(clients.map(client => client.id === editingClient.id ? editingClient : client));
      setEditingClient(null);
    } catch (error) {
      console.error("Error al editar el cliente:", error);
    }
  };

  const handleDeleteClient = async (id) => {
    const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este cliente?");
    if (confirmed) {
      try {
        await deleteClient(id);
        setClients(clients.filter(client => client.id !== id));
      } catch (error) {
        console.error("Error al eliminar el cliente:", error);
      }
    }
  };

  const filteredClients = useMemo(() => {
    return clients.filter(client =>
      (client.dpi || "").includes(searchTerm) ||
      (client.nit || "").includes(searchTerm) ||
      (client.phone || "").includes(searchTerm)
    );
  }, [clients, searchTerm]);

  return (
    <Layout>
      <div className="p-8 bg-gray-100 min-h-screen">
        <h3 className="text-4xl font-bold text-center text-blue-600 mb-8">Clientes</h3>

        <div className="mb-8 flex items-center">
          <div className="relative w-full">
          <img
              src={searchIcon}
              alt="Search icon"
              className="absolute left-3 top-3 text-gray-500 w-5 h-5"
            />
            <input
              type="text"
              placeholder="Buscar por DPI, NIT o Teléfono"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 transition duration-300"
            />
          </div>
        </div>

        <div className="mb-10 bg-white p-6 rounded-lg shadow-lg">
          <h4 className="text-2xl font-semibold text-gray-700 mb-4">Agregar Cliente</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['name', 'address', 'email', 'dpi', 'nit', 'phone'].map(field => (
              <input
                key={field}
                type="text"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={newClient[field]}
                onChange={(e) => setNewClient({ ...newClient, [field]: e.target.value })}
                className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              />
            ))}
          </div>
          <button 
            onClick={handleAddClient} 
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition duration-300">
            Agregar Cliente
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-white rounded-lg shadow-lg">
            <thead className="bg-blue-600 text-white">
              <tr>
                {['ID', 'Nombre', 'Dirección', 'Correo Electrónico', 'DPI', 'NIT', 'Teléfono', 'Acciones'].map(header => (
                  <th key={header} className="py-3 px-4 text-left font-semibold">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredClients.map(client => (
                <tr key={client.id} className="border-b hover:bg-gray-100 transition duration-200">
                  <td className="py-3 px-4">{client.id}</td>
                  <td className="py-3 px-4">{client.name}</td>
                  <td className="py-3 px-4">{client.address}</td>
                  <td className="py-3 px-4">{client.email}</td>
                  <td className="py-3 px-4">{client.dpi}</td>
                  <td className="py-3 px-4">{client.nit}</td>
                  <td className="py-3 px-4">{client.phone}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setEditingClient(client)}
                      className="bg-yellow-500 text-white py-1 px-3 rounded-lg hover:bg-yellow-400 transition duration-300"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteClient(client.id)}
                      className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-400 transition duration-300 ml-2"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editingClient && (
          <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
            <h4 className="text-2xl font-semibold text-gray-700 mb-4">Editar Cliente</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['name', 'address', 'email', 'dpi', 'nit', 'phone'].map(field => (
                <input
                  key={field}
                  type="text"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={editingClient[field]}
                  onChange={(e) => setEditingClient({ ...editingClient, [field]: e.target.value })}
                  className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                />
              ))}
            </div>
            <div className="mt-4 flex space-x-3">
              <button 
                onClick={handleEditClient} 
                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-400 transition duration-300">
                Guardar Cambios
              </button>
              <button 
                onClick={() => setEditingClient(null)} 
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-400 transition duration-300">
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Clients;
