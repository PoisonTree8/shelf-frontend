import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Library.css';

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
        const res = await fetch('http://localhost:3000/purchases/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        // extract book from purchase
        const purchasedBooks = data.map((p) => p.book_id);
        setBooks(purchasedBooks);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, [user]);

  if (!user) {
    return <p>Please login to view your library</p>;
  }

  if (loading) {
    return <p>Loading library...</p>;
  }

  return (
    <div className="library-container">
      <h1 className="library-title">My Library</h1>

      {books.length === 0 && <p className="library-empty">You haven’t purchased any books yet.</p>}

      {books.map((book) => (
        <div
          key={book._id}
          className="library-book"
        >
          <h3 className="book-title">{book.title}</h3>
          <p className="book-author">{book.author}</p>
          <Link to={`/books/${book._id}`} className="book-link">Read / View</Link>
        </div>
      ))}
    </div>
  );
}
