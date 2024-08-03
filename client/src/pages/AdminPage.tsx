import React, { useState } from 'react';
import API from '../services/api';

const AdminPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState<File | null>(null);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price.toString());
    if (image) formData.append('image', image);

    try {
      await API.post('/products/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Product added successfully');
    } catch (error) {
      alert('Failed to add product');
    }
  };

  return (
    <div>
      <h2>Admin Page</h2>
      <form onSubmit={handleAddProduct}>
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div>
          <label>Price:</label>
          <input type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} required />
        </div>
        <div>
          <label>Image:</label>
          <input type="file" onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} required />
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AdminPage;
