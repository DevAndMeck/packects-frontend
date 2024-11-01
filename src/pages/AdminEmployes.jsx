// Employees.js
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { fetchEmployees, saveEmployee, deleteEmployee } from '../components/employeesDB';

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
    reader.onloadend = () => callback(reader.result);
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

    await saveEmployee(newEmployee);
    setFormData({ id: '', name: '', position: '', email: '', photo: null });
    setEditingEmployee(null);
    setEmployees(await fetchEmployees());
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
    await deleteEmployee(id);
    setEmployees(await fetchEmployees());
  };

  return (
    <Layout>
      <div className="p-8 bg-gray-100 min-h-screen">
        <h3 className="text-4xl font-bold mb-8 text-center text-blue-600">Gestión de Empleados</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-white p-8 rounded-2xl shadow-xl">
          {['id', 'name', 'position', 'email'].map((field) => (
            <input
              key={field}
              type={field === 'email' ? 'email' : 'text'}
              name={field}
              placeholder={`${
                field === 'id' ? 'ID' : field[0].toUpperCase() + field.slice(1)
              } del Empleado`}
              value={formData[field]}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 transition duration-300"
              required
            />
          ))}
          <input
            type="file"
            onChange={handleFileChange}
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 transition duration-300"
          />
          <button
            type="submit"
            className="md:col-span-2 bg-blue-600 text-white font-semibold rounded-lg py-3 hover:bg-blue-500 transition duration-300"
          >
            {editingEmployee ? 'Actualizar Empleado' : 'Agregar Empleado'}
          </button>
        </form>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-white rounded-lg shadow-lg">
            <thead className="bg-blue-600 text-white">
              <tr>
                {['ID', 'Nombre', 'Puesto', 'Correo Electrónico', 'Foto', 'Acciones'].map((header) => (
                  <th key={header} className="py-4 px-6">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee._id} className="border-b hover:bg-gray-100 transition duration-200">
                  <td className="py-4 px-6 text-center">{employee.id}</td>
                  <td className="py-4 px-6 text-center">{employee.name}</td>
                  <td className="py-4 px-6 text-center">{employee.position}</td>
                  <td className="py-4 px-6 text-center">{employee.email}</td>
                  <td className="py-4 px-6 text-center">
                    {employee.photo && (
                      <img src={employee.photo} alt={employee.name} className="h-16 w-16 object-cover rounded-full shadow-md" />
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleEdit(employee)}
                      className="mr-2 bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-300 transition duration-300"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(employee._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition duration-300"
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
