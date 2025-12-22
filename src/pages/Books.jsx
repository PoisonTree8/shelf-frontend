import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BooksPage = () => {
const [books, setBooks] = useState([]);
const [loading, setLoading] = useState(true);
const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/books');
      const data = await res.json();
      setBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load books:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Loading books...</p>
      </div>
    );
  }

 return (
  <div>
    <h1>Books</h1>

    {/* Search Bar */}
    <input
      type="text"
      placeholder="Search books..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      style={{
        padding: '8px',
        width: '100%',
        maxWidth: '400px',
        marginBottom: '1rem',
      }}
    />

    {/* Books List */}
    <div>
      {books
        .filter((book) => {
          return (
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        })
        .map((book) => (
          <div
            key={book._id}
            style={{
              border: '1px solid #ddd',
              padding: '1rem',
              marginBottom: '1rem',
              borderRadius: '6px',
            }}
          >
            <h3>{book.title}</h3>
            <p>{book.author}</p>
            <p>{book.price} BD</p>
            <a href={`/books/${book._id}`}>View</a>
          </div>
        ))}

      {/* No results */}
      {books.filter((book) => {
        return (
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }).length === 0 && (
        <p>No books found</p>
      )}
    </div>
  </div>
);
}

export default BooksPage;
