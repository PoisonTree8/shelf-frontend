import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './BookDetails.css';

import { buyBook, checkPurchase } from '../services/purchases';
import { getBookRatings, addRating } from '../services/ratings';

export default function BookDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const [hasPurchased, setHasPurchased] = useState(false);

  const [ratings, setRatings] = useState([]);
  const [ratingValue, setRatingValue] = useState(5);
  const [submittingRating, setSubmittingRating] = useState(false);

  // fetch book
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`http://localhost:3000/books/${id}`);
        const data = await res.json();
        setBook(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  // check purchase
  useEffect(() => {
    if (!user || !book) return;

    const check = async () => {
      try {
        const res = await checkPurchase(book._id);
        setHasPurchased(res.purchased);
      } catch (err) {
        console.error(err);
      }
    };

    check();
  }, [user, book]);

  // fetch ratings
  useEffect(() => {
    if (!book) return;

    const fetchRatings = async () => {
      try {
        const data = await getBookRatings(book._id);
        setRatings(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRatings();
  }, [book]);

  const handleBuy = async () => {
    try {
      await buyBook(book._id);
      setHasPurchased(true);
    } catch (err) {
      alert('Purchase failed');
    }
  };

  const handleRead = () => {
    const url = hasPurchased
      ? book.fullPdfUrl
      : book.previewPdfUrl;

    if (!url) {
      alert('No PDF available');
      return;
    }

    window.open(url, '_blank');
  };

  const handleAddRating = async () => {
    try {
      setSubmittingRating(true);
      const newRating = await addRating(book._id, ratingValue);
      setRatings([newRating, ...ratings]);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <p>Loading...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container">
        <p>Book not found</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="book-details" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        {book.coverImageUrl ? (
          <img
            src={book.coverImageUrl}
            alt={book.title}
            style={{
              width: '220px',
              height: 'auto',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          />
        ) : (
          <img
            src="/path/to/placeholder-image.jpg"
            alt="Placeholder"
            style={{
              width: '220px',
              height: 'auto',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          />
        )}

        <div style={{ flex: 1 }}>
          <h1>{book.title}</h1>
          <p><strong>Author:</strong> {book.authorName}</p>
          <p><strong>Price:</strong> {book.price} BD</p>
          <p>{book.description}</p>

          <div className="book-actions" style={{ marginTop: '20px' }}>
            <button className="primary" onClick={handleRead}>
              {hasPurchased ? 'Read Full Book' : 'Read Preview'}
            </button>

            {user && !hasPurchased && (
              <button className="secondary" onClick={handleBuy} style={{ marginLeft: '10px' }}>
                Buy Book
              </button>
            )}
          </div>

          {user && hasPurchased && (
            <p style={{ color: 'green', marginTop: '10px' }}>Already Purchased</p>
          )}
        </div>
      </div>

      <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px solid #ddd' }} />

      <div className="ratings-section" style={{ textAlign: 'center' }}>
        <h3>Ratings</h3>
        {ratings.length === 0 ? (
          <p>No ratings yet</p>
        ) : (
          <ul className="rating-list" style={{ listStyle: 'none', padding: 0 }}>
            {ratings.map((rating) => (
              <li key={rating._id} style={{ marginBottom: '10px' }}>
                <strong>{rating.user_id?.username}:</strong> {rating.ratingValue} / 5
              </li>
            ))}
          </ul>
        )}

        {user && hasPurchased && (
          <div className="rating-section" style={{ marginTop: '20px' }}>
            <h4>Add Your Rating</h4>

            <div className="rating-input" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <label htmlFor="rating-select" style={{ fontWeight: 'bold' }}>Rating:</label>
              <select
                id="rating-select"
                value={ratingValue}
                onChange={(e) => setRatingValue(Number(e.target.value))}
                style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>
                ))}
              </select>

              <button
                className="primary"
                onClick={handleAddRating}
                disabled={submittingRating}
                style={{ padding: '0.5rem 1rem', borderRadius: '4px', fontWeight: 'bold' }}
              >
                {submittingRating ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
