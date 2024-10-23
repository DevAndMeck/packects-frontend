// Employees.js
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { fetchEmployees, saveEmployee, deleteEmployee } from '../components/employeesDB'; // Asegúrate de colocar la ruta correcta

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    position: '',
    email: '',
    photo: null,
  });
  const [editingEmployee, setEditingEmployee] = useState(null);

  useEffect(() => {
    const loadEmployees = async () => {
      const allEmployees = await fetchEmployees();
      setEmployees(allEmployees);
    };
    loadEmployees();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const convertToBase64 = (file, callback) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      convertToBase64(file, (base64Image) => {
        setFormData({ ...formData, photo: base64Image });
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newEmployee = {
      ...formData,
      _id: editingEmployee ? editingEmployee : (employees.length + 1).toString(),
    };

    await saveEmployee(newEmployee); // Guardar empleado en IndexedDB
    setFormData({ id: '', name: '', position: '', email: '', photo: null });
    setEditingEmployee(null);
    const allEmployees = await fetchEmployees();
    setEmployees(allEmployees); // Recargar la lista de empleados
  };

  const handleEdit = (employee) => {
    setFormData({
      id: employee.id,
      name: employee.name,
      position: employee.position,
      email: employee.email,
      photo: null,
    });
    setEditingEmployee(employee._id);
  };

  const handleDelete = async (id) => {
    await deleteEmployee(id);  // Eliminar empleado de IndexedDB
    const allEmployees = await fetchEmployees(); // Recargar la lista de empleados
    setEmployees(allEmployees);
  };

  return (
    <Layout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <h3 className="text-3xl font-semibold mb-6 text-center text-gray-700">Gestión de Empleados</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-white p-6 rounded-lg shadow-lg">
          <input
            type="text"
            name="id"
            placeholder="ID del Empleado"
            value={formData.id}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg p-2"
            required
          />
          <input
            type="text"
            name="name"
            placeholder="Nombre del Empleado"
            value={formData.name}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg p-2"
            required
          />
          <input
            type="text"
            name="position"
            placeholder="Puesto"
            value={formData.position}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg p-2"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Correo Electrónico"
            value={formData.email}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg p-2"
            required
          />
          <input
            type="file"
            onChange={handleFileChange}
            className="border border-gray-300 rounded-lg p-2"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold rounded-lg py-2 px-4 hover:bg-blue-500 transition duration-300 ease-in-out"
          >
            {editingEmployee ? 'Actualizar Empleado' : 'Agregar Empleado'}
          </button>
        </form>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-white rounded-lg shadow-lg">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Nombre</th>
                <th className="py-3 px-4">Puesto</th>
                <th className="py-3 px-4">Correo Electrónico</th>
                <th className="py-3 px-4">Foto</th>
                <th className="py-3 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee._id} className="border-b">
                  <td className="py-3 px-4 text-center">{employee.id}</td>
                  <td className="py-3 px-4 text-center">{employee.name}</td>
                  <td className="py-3 px-4 text-center">{employee.position}</td>
                  <td className="py-3 px-4 text-center">{employee.email}</td>
                  <td className="py-3 px-4 text-center">
                    {employee.photo && (
                      <img src={employee.photo} alt={employee.name} className="h-16 w-16 object-cover rounded-full shadow-md" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleEdit(employee)}
                      className="mr-2 bg-yellow-400 text-white px-3 py-1 rounded-lg hover:bg-yellow-300 transition duration-300 ease-in-out"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(employee._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-500 transition duration-300 ease-in-out"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Employees;
