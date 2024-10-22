import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { addProduct, getProducts, deleteProduct } from '../components/productoDB'; // Asegúrate de importar correctamente

const Products = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    barcode: '',
    image: null,
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    loadProducts(); // Cargar productos al iniciar el componente
  }, []);

  const loadProducts = async () => {
    const storedProducts = await getProducts();
    setProducts(storedProducts);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProduct = {
      _id: editingProduct ? editingProduct : Date.now().toString(),
      name: formData.name,
      amount: formData.amount,
      barcode: formData.barcode,
      image: imagePreview,
    };

    // Agregar o actualizar producto en IndexedDB
    await addProduct(newProduct);
    loadProducts(); // Recargar productos

    // Limpiar el formulario
    setFormData({ name: '', amount: '', barcode: '', image: null });
    setImagePreview(null);
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setFormData({ name: product.name, amount: product.amount, barcode: product.barcode, image: null });
    setImagePreview(product.image);
    setEditingProduct(product._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      await deleteProduct(id);
      loadProducts(); // Recargar productos
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-4">Productos</h3>
        <form onSubmit={handleSubmit} className="mb-4">
          <input
            type="text"
            name="name"
            placeholder="Nombre del Producto"
            value={formData.name}
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
            type="text"
            name="barcode"
            placeholder="Código de Barras"
            value={formData.barcode}
            onChange={handleInputChange}
            className="border p-2 mr-2"
            required
          />
          <input
            type="file"
            onChange={handleFileChange}
            className="border p-2 mr-2"
            required
          />
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            {editingProduct ? 'Actualizar Producto' : 'Agregar Producto'}
          </button>
        </form>
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Nombre</th>
              <th className="py-2 px-4">Monto</th>
              <th className="py-2 px-4">Código de Barras</th>
              <th className="py-2 px-4">Imagen</th>
              <th className="py-2 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-t">
                <td className="py-2 px-4 text-center">{product._id}</td>
                <td className="py-2 px-4 text-center">{product.name}</td>
                <td className="py-2 px-4 text-center">Q.{product.amount}</td>
                <td className="py-2 px-4 text-center">{product.barcode}</td>
                <td className="py-2 px-4 text-center">
                  {product.image && (
                    <img src={product.image} alt={product.name} className="h-16 w-16" />
                  )}
                </td>
                <td className="py-2 px-4 text-center">
                  <button onClick={() => handleEdit(product)} className="mr-2 px-2 py-1 bg-sky-500 text-white rounded">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(product._id)} className="px-2 py-1 bg-yellow-700 text-white rounded">
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

export default Products;
