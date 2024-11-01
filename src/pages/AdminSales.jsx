// Sales.js
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getProducts } from '../components/productoDB'; 
import { loadClients } from '../components/clientBD';
import { fetchEmployees } from '../components/employeesDB';
import { openDB, getAllSales, saveSale, deleteSale } from '../components/salesBD';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    productInputs: [''],
    clientInput: '',
    employeeInput: '',
    amount: '',
    date: '',
    warranty: ''
  });

  const [editingSale, setEditingSale] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const db = await openDB();
      setSales(await getAllSales(db));
      setProducts(await getProducts());
      setClients(await loadClients());
      setEmployees(await fetchEmployees());
    };
    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProductInputChange = (index, value) => {
    const newProductInputs = [...formData.productInputs];
    newProductInputs[index] = value;
    setFormData({ ...formData, productInputs: newProductInputs });
  };

  const addProductInput = () => {
    setFormData(prev => ({
      ...prev,
      productInputs: [...prev.productInputs, '']
    }));
  };

  const removeProductInput = (index) => {
    const newProductInputs = [...formData.productInputs];
    newProductInputs.splice(index, 1);
    setFormData({ ...formData, productInputs: newProductInputs });
  };

  const filteredClients = clients.find(
    (c) => c.nit === formData.clientInput || c.dpi === formData.clientInput || c.phone === formData.clientInput
  );

  const filteredEmployee = employees.find(
    (e) => e.id === formData.employeeInput
  );

  const filteredProducts = formData.productInputs.map((productInput) =>
    products.find((p) => p.name.toLowerCase() === productInput.toLowerCase() || p.barcode === productInput)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (filteredProducts.includes(undefined)) {
      alert('Uno o más productos no fueron encontrados');
      return;
    }

    if (!filteredClients) {
      alert('Cliente no encontrado');
      return;
    }

    if (!filteredEmployee) {
      alert('Empleado no encontrado');
      return;
    }

    const newSale = {
      _id: editingSale ? editingSale._id : Date.now(),
      products: filteredProducts,
      client: filteredClients,
      employee: filteredEmployee,
      amount: formData.amount,
      date: formData.date,
      warranty: formData.warranty
    };

    const db = await openDB();
    await saveSale(db, newSale);
    setSales(await getAllSales(db));

    setFormData({
      productInputs: [''],
      clientInput: '',
      employeeInput: '',
      amount: '',
      date: '',
      warranty: ''
    });
    setEditingSale(null);
  };

  const handleEdit = (sale) => {
    setFormData({
      productInputs: sale.products.map(p => p.name),
      clientInput: sale.client.nit || sale.client.dpi || sale.client.phone,
      employeeInput: sale.employee.id,
      amount: sale.amount,
      date: sale.date,
      warranty: sale.warranty
    });
    setEditingSale(sale);
  };

  const handleDelete = async (saleId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta venta?')) {
      const db = await openDB();
      await deleteSale(db, saleId);
      setSales(await getAllSales(db));
    }
  };

  return (
    <Layout>
      <div className="p-8 bg-gray-100 min-h-screen">
        <h3 className="text-4xl font-bold mb-8 text-center text-blue-600">Generar Nueva Venta</h3>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 rounded-xl shadow-lg">
          {formData.productInputs.map((input, index) => (
            <div key={index} className="flex space-x-2">
              <input
                type="text"
                placeholder="Nombre del Producto o Código de Barra"
                value={input}
                onChange={(e) => handleProductInputChange(index, e.target.value)}
                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:border-blue-500 transition duration-300"
                required
              />
              <button 
                type="button" 
                onClick={() => removeProductInput(index)} 
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300">
                Eliminar
              </button>
            </div>
          ))}
          <button 
            type="button" 
            onClick={addProductInput} 
            className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300">
            Agregar Producto
          </button>
          <input
            type="text"
            name="clientInput"
            placeholder="NIT, DPI o Teléfono del Cliente"
            value={formData.clientInput}
            onChange={handleInputChange}
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:border-blue-500 transition duration-300"
            required
          />
          <input
            type="text"
            name="employeeInput"
            placeholder="ID del Empleado"
            value={formData.employeeInput}
            onChange={handleInputChange}
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:border-blue-500 transition duration-300"
            required
          />
          <input
            type="number"
            name="amount"
            placeholder="Monto"
            value={formData.amount}
            onChange={handleInputChange}
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:border-blue-500 transition duration-300"
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:border-blue-500 transition duration-300"
            required
          />
          <input
            type="text"
            name="warranty"
            placeholder="Garantía"
            value={formData.warranty}
            onChange={handleInputChange}
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:border-blue-500 transition duration-300"
            required
          />
          <button 
            type="submit" 
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300">
            {editingSale ? 'Actualizar Venta' : 'Registrar Venta'}
          </button>
        </form>

        <h3 className="text-4xl font-bold mt-12 mb-6 text-center text-blue-600">Ventas Registradas</h3>
        <ul className="space-y-6">
          {sales.map((sale) => (
            <li key={sale._id} className="p-6 bg-white rounded-lg shadow-md flex justify-between items-center">
              <div>
                <p><strong>Productos:</strong> {sale.products.map(p => p.name).join(', ')}</p>
                <p><strong>Cliente:</strong> {sale.client.name} ({sale.client.nit || sale.client.dpi || sale.client.phone})</p>
                <p><strong>Empleado:</strong> {sale.employee.name} (ID: {sale.employee.id})</p>
                <p><strong>Monto:</strong> Q{sale.amount}</p>
                <p><strong>Fecha:</strong> {sale.date}</p>
                <p><strong>Garantía:</strong> {sale.warranty}</p>
              </div>
              <div className="space-x-3">
                <button
                  onClick={() => handleEdit(sale)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(sale._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default Sales;
