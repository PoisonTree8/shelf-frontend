import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminAddBook() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    description: '',
    previewPdfUrl: '',
    fullPdfUrl: '',
  });

  // hide page completely if not admin
  if (!user || user.role !== 'admin') {
    return null;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      const res = await fetch('http://localhost:3000/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to add book');
      }

      navigate('/books');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h1>Add New Book</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <input
          name="author"
          placeholder="Author"
          value={formData.author}
          onChange={handleChange}
          required
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <input
          name="previewPdfUrl"
          placeholder="Preview PDF URL"
          value={formData.previewPdfUrl}
          onChange={handleChange}
          required
        />

        <input
          name="fullPdfUrl"
          placeholder="Full PDF URL"
          value={formData.fullPdfUrl}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Book</button>
      </form>
    </div>
  );
}
