import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getProducts } from '../components/productoDB'; // Importa la función para obtener productos
import { loadClients } from '../components/clientBD' // Importa la función para obtener clientes
import { fetchEmployees } from '../components/employeesDB'; // Importa la función para obtener empleados

// Función para abrir la base de datos de ventas
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SalesDB', 1);

    request.onerror = (event) => {
      reject('Error al abrir la base de datos.');
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore('sales', { keyPath: '_id' });
    };
  });
};

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    productInputs: [''], // Iniciar con un campo de producto vacío
    clientInput: '',
    employeeInput: '',
    amount: '',
    date: '',
    warranty: ''
  });

  const [editingSale, setEditingSale] = useState(null); // Estado para editar ventas

  useEffect(() => {
    const loadData = async () => {
      const db = await openDB();
      const transaction = db.transaction('sales', 'readonly');
      const store = transaction.objectStore('sales');

      const salesData = await new Promise((resolve) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
      });

      setSales(salesData);

      // Cargar productos, clientes y empleados desde las respectivas fuentes
      const storedProducts = await getProducts(); 
      const storedClients = await loadClients(); // Cambiado a loadClients
      const storedEmployees = await fetchEmployees(); //Cambiado a fetchEmployees 

      setProducts(storedProducts);
      setClients(storedClients);
      setEmployees(storedEmployees);
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
    setFormData((prev) => ({
      ...prev,
      productInputs: [...prev.productInputs, '']
    }));
  };

  const removeProductInput = (index) => {
    const newProductInputs = [...formData.productInputs];
    newProductInputs.splice(index, 1); // Eliminar producto
    setFormData({ ...formData, productInputs: newProductInputs });
  };

  const filteredClients = clients.find(
    (c) => c.nit === formData.clientInput || c.dpi === formData.clientInput || c.phone === formData.clientInput
  );

  const filteredEmployee = employees.find(
    (e) => e.id === formData.employeeInput // Cargar ID del empleado
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
      _id: editingSale ? editingSale._id : Date.now(), // Usar timestamp como ID
      products: filteredProducts,
      client: filteredClients,
      employee: filteredEmployee,
      amount: formData.amount,
      date: formData.date,
      warranty: formData.warranty
    };

    const updatedSales = editingSale
      ? sales.map((sale) => (sale._id === editingSale._id ? newSale : sale))
      : [...sales, newSale];

    setSales(updatedSales);

    // Guardar en IndexedDB
    const db = await openDB();
    const transaction = db.transaction('sales', 'readwrite');
    const store = transaction.objectStore('sales');
    store.put(newSale);

    setFormData({
      productInputs: [''], // Reiniciar la entrada de productos
      clientInput: '',
      employeeInput: '',
      amount: '',
      date: '',
      warranty: ''
    });

    setEditingSale(null); // Reiniciar la edición
  };

  // Función para editar una venta
  const handleEdit = (sale) => {
    setFormData({
      productInputs: sale.products.map(p => p.name),
      clientInput: sale.client.nit || sale.client.dpi || sale.client.phone,
      employeeInput: sale.employee.id, // Cargar ID del empleado
      amount: sale.amount,
      date: sale.date,
      warranty: sale.warranty
    });
    setEditingSale(sale); // Establecer la venta en edición
  };

  // Función para eliminar una venta
  const handleDelete = (saleId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta venta?')) {
      const updatedSales = sales.filter(sale => sale._id !== saleId);
      setSales(updatedSales);

      // Eliminar de IndexedDB
      const db = openDB();
      db.then((database) => {
        const transaction = database.transaction('sales', 'readwrite');
        const store = transaction.objectStore('sales');
        store.delete(saleId);
      });
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-4">Generar Nueva Venta</h3>
        <form onSubmit={handleSubmit} className="mb-4">
          {formData.productInputs.map((input, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                placeholder="Nombre del Producto o Código de Barra"
                value={input}
                onChange={(e) => handleProductInputChange(index, e.target.value)}
                className="border p-2 mr-2"
                required
              />
              <button type="button" onClick={() => removeProductInput(index)} className="px-2 py-1 bg-red-600 text-white rounded-lg">
                Eliminar
              </button>
            </div>
          ))}
          <button type="button" onClick={addProductInput} className="px-4 py-2 bg-green-600 text-white rounded-lg mb-2">
            Agregar Producto
          </button>
          <input
            type="text"
            name="clientInput"
            placeholder="NIT, DPI o Teléfono del Cliente"
            value={formData.clientInput}
            onChange={handleInputChange}
            className="border p-2 mr-2"
            required
          />
          <input
            type="text"
            name="employeeInput"
            placeholder="ID del Empleado"
            value={formData.employeeInput}
            onChange={handleInputChange}
            className="border p-2 mr-2"
            required
          />
          <input
            type="number"
            name="amount"
            placeholder="Monto"
            value={formData.amount}
            onChange={handleInputChange}
            className="border p-2 mr-2"
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="border p-2 mr-2"
            required
          />
          <input
            type="text"
            name="warranty"
            placeholder="Garantía"
            value={formData.warranty}
            onChange={handleInputChange}
            className="border p-2 mr-2"
            required
          />
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            {editingSale ? 'Actualizar Venta' : 'Registrar Venta'}
          </button>
        </form>

        <h3 className="text-2xl font-bold mb-4">Ventas Registradas</h3>
        <ul>
          {sales.map((sale) => (
            <li key={sale._id} className="flex justify-between mb-2 border-b pb-2">
              <div>
                <strong>Cliente:</strong> {sale.client.name}<br />
                <strong>Empleado:</strong> {sale.employee.name}<br />
                <strong>Productos:</strong> {sale.products.map(p => p.name).join(', ')}<br />
                <strong>Monto:</strong> Q.{sale.amount}<br />
                <strong>Fecha:</strong> {sale.date}<br />
                <strong>Garantía:</strong> {sale.warranty}
              </div>
              <div>
                <button onClick={() => handleEdit(sale)} className="px-2 py-1 bg-yellow-500 text-white rounded-lg mr-1">
                  Editar
                </button>
                <button onClick={() => handleDelete(sale._id)} className="px-2 py-1 bg-red-600 text-white rounded-lg">
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
