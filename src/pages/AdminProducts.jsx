import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { addProduct, getProducts, deleteProduct } from '../components/productoDB';

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
    loadProducts();
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

    await addProduct(newProduct);
    loadProducts();

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
      loadProducts();
    }
  };

  return (
    <Layout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <h3 className="text-3xl font-bold text-gray-800 mb-6">Productos</h3>
        
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h4 className="text-xl font-semibold text-gray-700 mb-4">{editingProduct ? 'Editar Producto' : 'Agregar Producto'}</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Nombre del Producto"
              value={formData.name}
              onChange={handleInputChange}
              className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="number"
              name="amount"
              placeholder="Monto"
              value={formData.amount}
              onChange={handleInputChange}
              className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="barcode"
              placeholder="Código de Barras"
              value={formData.barcode}
              onChange={handleInputChange}
              className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="file"
              onChange={handleFileChange}
              className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {imagePreview && <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-lg shadow-sm" />}
          </div>
          <button type="submit" className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition">
            {editingProduct ? 'Actualizar Producto' : 'Agregar Producto'}
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-lg">
            <thead className="bg-blue-100">
              <tr>
                {['ID', 'Nombre', 'Monto', 'Código de Barras', 'Imagen', 'Acciones'].map(header => (
                  <th key={header} className="py-3 px-4 text-gray-700 font-semibold text-left">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-100 transition">
                  <td className="py-3 px-4">{product._id}</td>
                  <td className="py-3 px-4">{product.name}</td>
                  <td className="py-3 px-4">Q.{product.amount}</td>
                  <td className="py-3 px-4">{product.barcode}</td>
                  <td className="py-3 px-4">
                    {product.image && (
                      <img src={product.image} alt={product.name} className="h-16 w-16 object-cover rounded-lg shadow-sm" />
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <button onClick={() => handleEdit(product)} className="mr-2 px-2 py-1 bg-sky-500 text-white rounded-lg hover:bg-sky-400 transition">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-400 transition">
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

export default Products;
