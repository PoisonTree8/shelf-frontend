import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="books-page">
      <h1>Books</h1>
      <p>Browse available digital books</p>

      {books.length > 0 ? (
        books.map(book => (
          <div key={book._id} style={{ marginBottom: '1rem' }}>
            <h3>{book.title}</h3>
            <p>Author: {book.authorName}</p>
            <p>Price: {book.price} BD</p>

            <Link to={`/books/${book._id}`}>
              View Details
            </Link>
          </div>
        ))
      ) : (
        <p>No books found</p>
      )}
    </div>
  );
};

export default BooksPage;
