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

  // Cargar los empleados cuando el componente se monta
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
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-4">Lista de Empleados</h3>
        <form onSubmit={handleSubmit} className="mb-4">
          <input
            type="text"
            name="id"
            placeholder="ID del Empleado"
            value={formData.id}
            onChange={handleInputChange}
            className="border p-2 mr-2"
            required
          />
          <input
            type="text"
            name="name"
            placeholder="Nombre del Empleado"
            value={formData.name}
            onChange={handleInputChange}
            className="border p-2 mr-2"
            required
          />
          <input
            type="text"
            name="position"
            placeholder="Puesto"
            value={formData.position}
            onChange={handleInputChange}
            className="border p-2 mr-2"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Correo Electrónico"
            value={formData.email}
            onChange={handleInputChange}
            className="border p-2 mr-2"
            required
          />
          <input
            type="file"
            onChange={handleFileChange}
            className="border p-2 mr-2"
          />
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            {editingEmployee ? 'Actualizar Empleado' : 'Agregar Empleado'}
          </button>
        </form>
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Nombre</th>
              <th className="py-2 px-4">Puesto</th>
              <th className="py-2 px-4">Correo Electrónico</th>
              <th className="py-2 px-4">Foto</th>
              <th className="py-2 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id} className="border-t">
                <td className="py-2 px-4 text-center">{employee.id}</td>
                <td className="py-2 px-4 text-center">{employee.name}</td>
                <td className="py-2 px-4 text-center">{employee.position}</td>
                <td className="py-2 px-4 text-center">{employee.email}</td>
                <td className="py-2 px-4 text-center">
                  {employee.photo && (
                    <img src={employee.photo} alt={employee.name} className="h-16 w-16 object-cover" />
                  )}
                </td>
                <td className="py-2 px-4 text-center">
                  <button onClick={() => handleEdit(employee)} className="mr-2 px-2 py-1 bg-sky-500 text-white rounded">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(employee._id)} className="px-2 py-1 bg-yellow-700 text-white rounded">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Employees;
