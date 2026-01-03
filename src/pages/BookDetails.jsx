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

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/books/${id}`);
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

  useEffect(() => {
    if (!user || !book) return;
    const check = async () => {
      const res = await checkPurchase(book._id);
      setHasPurchased(res.purchased);
    };
    check();
  }, [user, book]);

  useEffect(() => {
    if (!book) return;
    const fetchRatings = async () => {
      const data = await getBookRatings(book._id);
      setRatings(data);
    };
    fetchRatings();
  }, [book]);

  const handleBuy = async () => {
    await buyBook(book._id);
    setHasPurchased(true);
  };

  const handleRead = () => {
    const url = hasPurchased ? book.fullPdfUrl : book.previewPdfUrl;
    if (!url) return alert('No PDF available');
    window.open(url, '_blank');
  };

  const handleAddRating = async () => {
    setSubmittingRating(true);
    const newRating = await addRating(book._id, ratingValue);
    setRatings([newRating, ...ratings]);
    setSubmittingRating(false);
  };

  if (loading) return <div className="container">Loading...</div>;
  if (!book) return <div className="container">Book not found</div>;

  return (
    <div className="container">
      <div className="book-details">
        <div className="book-cover">
          <img
            src={book.coverImageUrl || '/placeholder.jpg'}
            alt={book.title}
          />
        </div>

        <div className="book-info">
          <h1 className="book-title">{book.title}</h1>
          <p className="book-author"><strong>Author:</strong> {book.authorName}</p>
          <p className="book-price"><strong>Price:</strong> {book.price} BD</p>
          <p className="book-description">{book.description}</p>

          <div className="book-actions">
            <button className="primary" onClick={handleRead}>
              {hasPurchased ? 'Read Full Book' : 'Read Preview'}
            </button>

            {user && !hasPurchased && (
              <button className="secondary" onClick={handleBuy}>
                Buy Book
              </button>
            )}
          </div>

          {user && hasPurchased && (
            <p className="purchased-text">Already Purchased</p>
          )}
        </div>
      </div>

      <hr className="divider" />

      <div className="ratings-section">
        <h3>Ratings</h3>

        {ratings.length === 0 ? (
          <p>No ratings yet</p>
        ) : (
          <ul className="rating-list">
            {ratings.map((rating) => (
              <li key={rating._id}>
                <strong>{rating.user_id?.username}:</strong> {rating.ratingValue} / 5
              </li>
            ))}
          </ul>
        )}

        {user && hasPurchased && (
          <div className="rating-form">
            <select
              value={ratingValue}
              onChange={(e) => setRatingValue(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>
              ))}
            </select>

            <button
              className="primary"
              onClick={handleAddRating}
              disabled={submittingRating}
            >
              {submittingRating ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
