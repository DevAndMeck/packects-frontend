import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { loadClients, addClient, saveEditedClient, deleteClient } from '../components/clientBD';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newClient, setNewClient] = useState({ name: '', address: '', email: '', dpi: '', nit: '', phone: '' });
  const [editingClient, setEditingClient] = useState(null);

  // Cargar clientes desde IndexedDB
  const fetchClients = async () => {
    const allClients = await loadClients();
    setClients(allClients);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Agregar cliente
  const handleAddClient = async () => {
    const id = await addClient(newClient);
    setClients([...clients, { ...newClient, id }]);
    setNewClient({ name: '', address: '', email: '', dpi: '', nit: '', phone: '' });
  };

  // Editar cliente
  const handleEditClient = async () => {
    await saveEditedClient(editingClient);
    setClients(clients.map(client => client.id === editingClient.id ? editingClient : client));
    setEditingClient(null);
  };

  // Eliminar cliente
  const handleDeleteClient = async (id) => {
    const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este cliente?");
    if (confirmed) {
      await deleteClient(id);
      setClients(clients.filter(client => client.id !== id));
    }
  };

  // Filtrar clientes
  const filteredClients = clients.filter(client =>
    client.dpi.includes(searchTerm) ||
    client.nit.includes(searchTerm) ||
    client.phone.includes(searchTerm)
  );

  return (
    <Layout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <h3 className="text-3xl font-bold text-gray-800 mb-6">Clientes</h3>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Buscar por DPI, NIT o Teléfono"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />
        </div>

        {/* Formulario para agregar nuevo cliente */}
        <div className="mb-10 bg-white p-6 rounded-lg shadow-lg">
          <h4 className="text-xl font-semibold text-gray-700 mb-4">Agregar Cliente</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['name', 'address', 'email', 'dpi', 'nit', 'phone'].map(field => (
              <input
                key={field}
                type="text"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={newClient[field]}
                onChange={(e) => setNewClient({ ...newClient, [field]: e.target.value })}
                className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>
          <button onClick={handleAddClient} className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition">
            Agregar Cliente
          </button>
        </div>

        {/* Tabla de clientes */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-lg">
            <thead className="bg-blue-100">
              <tr>
                {['ID', 'Nombre', 'Dirección', 'Correo Electrónico', 'DPI', 'NIT', 'Teléfono', 'Acciones'].map(header => (
                  <th key={header} className="py-3 px-4 text-gray-700 font-semibold text-left">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredClients.map(client => (
                <tr key={client.id} className="border-b">
                  <td className="py-3 px-4">{client.id}</td>
                  <td className="py-3 px-4">{client.name}</td>
                  <td className="py-3 px-4">{client.address}</td>
                  <td className="py-3 px-4">{client.email}</td>
                  <td className="py-3 px-4">{client.dpi}</td>
                  <td className="py-3 px-4">{client.nit}</td>
                  <td className="py-3 px-4">{client.phone}</td>
                  <td className="py-3 px-4">
                    <button onClick={() => setEditingClient(client)} className="bg-yellow-500 text-white py-1 px-3 rounded-lg hover:bg-yellow-400 transition">Editar</button>
                    <button onClick={() => handleDeleteClient(client.id)} className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-400 transition ml-2">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Formulario para editar cliente */}
        {editingClient && (
          <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
            <h4 className="text-xl font-semibold text-gray-700 mb-4">Editar Cliente</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['name', 'address', 'email', 'dpi', 'nit', 'phone'].map(field => (
                <input
                  key={field}
                  type="text"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={editingClient[field]}
                  onChange={(e) => setEditingClient({ ...editingClient, [field]: e.target.value })}
                  className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>
            <div className="mt-4">
              <button onClick={handleEditClient} className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-400 transition">Guardar Cambios</button>
              <button onClick={() => setEditingClient(null)} className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-400 transition ml-2">Cancelar</button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Clients;
