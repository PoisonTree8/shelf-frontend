import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Library() {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchLibrary = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await fetch(`${import.meta.env.VITE_API_URL}/purchases/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        // purchases -> book_id
        const purchasedBooks = Array.isArray(data)
          ? data.map((p) => p.book_id).filter(Boolean)
          : [];

        setBooks(purchasedBooks);
      } catch (err) {
        console.error('Failed to load library:', err);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, [user]);

  // --------------------
  // render
  // --------------------
  if (loading) {
    return <p style={{ textAlign: 'center' }}>Loading your library...</p>;
  }

  if (!user) {
    return (
      <p style={{ textAlign: 'center' }}>
        Please login to view your library.
      </p>
    );
  }

  return (
    <div className="library-page">
      <h1>My Library</h1>

      {books.length === 0 && (
        <p className="library-empty">
          You haven't purchased any books yet.
        </p>
      )}

      <div className="library-grid">
        {books
          .filter((book) => book) 
          .map((book) => (
            <div
              key={book._id}
              className="library-book"
            >
              {book.coverImageUrl && (
                <img
                  src={book.coverImageUrl}
                  alt={book.title}
                  className="library-book-cover"
                />
              )}

              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">{book.author}</p>

              <Link
                to={`/books/${book._id}`}
                className="book-link"
              >
                Read / View
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}

