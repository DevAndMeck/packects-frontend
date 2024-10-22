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
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-4">Clientes</h3>

        <input
          type="text"
          placeholder="Buscar por DPI, NIT o Teléfono"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 p-2 border rounded w-full"
        />

        {/* Formulario para agregar nuevo cliente */}
        <div className="mb-6">
          <h4 className="text-xl font-semibold">Agregar Cliente</h4>
          {['name', 'address', 'email', 'dpi', 'nit', 'phone'].map(field => (
            <input
              key={field}
              type="text"
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={newClient[field]}
              onChange={(e) => setNewClient({ ...newClient, [field]: e.target.value })}
              className="p-2 border rounded mr-2 mb-2"
            />
          ))}
          <button onClick={handleAddClient} className="bg-blue-600 text-white py-2 px-4 rounded">Agregar Cliente</button>
        </div>

        {/* Tabla de clientes */}
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Nombre</th>
              <th className="py-2 px-4">Dirección</th>
              <th className="py-2 px-4">Correo Electrónico</th>
              <th className="py-2 px-4">DPI</th>
              <th className="py-2 px-4">NIT</th>
              <th className="py-2 px-4">Teléfono</th>
              <th className="py-2 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map(client => (
              <tr key={client.id} className="border-t">
                <td className="py-2 px-4 text-center">{client.id}</td>
                <td className="py-2 px-4 text-center">{client.name}</td>
                <td className="py-2 px-4 text-center">{client.address}</td>
                <td className="py-2 px-4 text-center">{client.email}</td>
                <td className="py-2 px-4 text-center">{client.dpi}</td>
                <td className="py-2 px-4 text-center">{client.nit}</td>
                <td className="py-2 px-4 text-center">{client.phone}</td>
                <td className="py-2 px-4 text-center">
                  <button onClick={() => setEditingClient(client)} className="bg-sky-500 text-white py-1 px-2 rounded">Editar</button>
                  <button onClick={() => handleDeleteClient(client.id)} className="bg-yellow-700 text-white py-1 px-2 rounded ml-2">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Formulario para editar cliente */}
        {editingClient && (
          <div className="mt-6">
            <h4 className="text-xl font-semibold">Editar Cliente</h4>
            {['name', 'address', 'email', 'dpi', 'nit', 'phone'].map(field => (
              <input
                key={field}
                type="text"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={editingClient[field]}
                onChange={(e) => setEditingClient({ ...editingClient, [field]: e.target.value })}
                className="p-2 border rounded mr-2 mb-2"
              />
            ))}
            <button onClick={handleEditClient} className="bg-green-500 text-white py-2 px-4 rounded">Guardar Cambios</button>
            <button onClick={() => setEditingClient(null)} className="bg-red-500 text-white py-2 px-4 rounded ml-2">Cancelar</button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Clients;
