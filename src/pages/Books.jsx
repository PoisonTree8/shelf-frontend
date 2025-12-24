import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Books.css';

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

  const filteredBooks = books.filter((book) => {
    return (
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="container">
        <p>Loading books...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Books</h1>

      <input
        type="text"
        placeholder="Search books..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: '0.6rem', maxWidth: '400px', marginBottom: '2rem' }}
      />

      <div className="books-grid">
        {filteredBooks.map((book) => (
          <div className="book-card" key={book._id}>
            {book.coverImageUrl && (
              <img
                src={book.coverImageUrl}
                alt={book.title}
                className="book-cover"
              />
            )}

            <div className="book-card-body">
              <div className="book-title">{book.title}</div>
              <div className="book-author">{book.authorName}</div>
              <div className="book-price">{book.price} BD</div>

              <Link to={`/books/${book._id}`}>
                <button>View Book</button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && <p>No books found</p>}
    </div>
  );
};

export default BooksPage;
