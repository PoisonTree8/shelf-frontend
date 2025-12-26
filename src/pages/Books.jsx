import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Books.css';

const BooksPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/books`);
      const data = await res.json();
      setBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load books:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (bookId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/books/${bookId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.ok) {
        setBooks(books.filter((book) => book._id !== bookId));
      } else {
        console.error('Failed to delete book');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
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
              <div className="book-authorName">{book.authorName}</div>
              <div className="book-price">{book.price} BD</div>

              <Link to={`/books/${book._id}`}>
                <button>View Book</button>
              </Link>
              {user?.role === 'admin' && (
                <>
                  <button
                    onClick={() => deleteBook(book._id)}
                    style={{
                      marginLeft: '10px',
                      backgroundColor: 'red',
                      color: 'white',
                    }}
                  >
                    Delete Book
                  </button>
                  <button
                    onClick={() => navigate(`/admin/edit-book/${book._id}`)}
                    style={{
                      marginLeft: '10px',
                      backgroundColor: 'blue',
                      color: 'white',
                    }}
                  >
                    Edit Book
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && <p>No books found</p>}
    </div>
  );
};

export default BooksPage;
