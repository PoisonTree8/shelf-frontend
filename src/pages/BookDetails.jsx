import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

import { buyBook, checkPurchase } from '../services/purchases';
import { getBookRatings, addRating } from '../services/ratings';

export default function BookDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  // --------------------
  // Book
  // --------------------
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // --------------------
  // Purchase
  // --------------------
  const [hasPurchased, setHasPurchased] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(false);

  // --------------------
  // Ratings
  // --------------------
  const [ratings, setRatings] = useState([]);
  const [ratingValue, setRatingValue] = useState(5);
  const [submittingRating, setSubmittingRating] = useState(false);

  // --------------------
  // Fetch book
  // --------------------
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

  // --------------------
  // Check purchase
  // --------------------
  useEffect(() => {
    if (!user || !book) return;

    const check = async () => {
      try {
        setCheckingPurchase(true);
        const res = await checkPurchase(book._id);
        setHasPurchased(res.purchased);
      } catch (err) {
        console.error(err);
      } finally {
        setCheckingPurchase(false);
      }
    };

    check();
  }, [user, book]);

  // --------------------
  // Fetch ratings
  // --------------------
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

  // --------------------
  // Handlers
  // --------------------
  const handleBuy = async () => {
    try {
      await buyBook(book._id);
      setHasPurchased(true);
    } catch (err) {
      alert(err?.message || 'Purchase failed');
    }
  };

  const handleAddRating = async () => {
    try {
      setSubmittingRating(true);
      const newRating = await addRating(book._id, ratingValue);
      setRatings([newRating, ...ratings]);
    } catch (err) {
      alert(err?.message || 'Failed to add rating');
    } finally {
      setSubmittingRating(false);
    }
  };

  // --------------------
  // Render
  // --------------------
  if (loading) return <p>Loading...</p>;
  if (!book) return <p>Book not found</p>;

  return (
    <div>
      <h1>{book.title}</h1>
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Price:</strong> {book.price}</p>
      <p>{book.description}</p>

      <hr />

      {/* Purchase */}
      {!user && <p>Please login to buy this book</p>}

      {user && checkingPurchase && <p>Checking purchase status...</p>}

      {user && !checkingPurchase && !hasPurchased && (
        <button onClick={handleBuy}>Buy</button>
      )}

      {user && hasPurchased && (
        <p style={{ color: 'green' }}>Already Purchased</p>
      )}

      <hr />

      {/* Ratings */}
      <h3>Ratings</h3>

      {ratings.length === 0 && <p>No ratings yet</p>}

      <ul>
        {ratings.map((rating) => (
          <li key={rating._id}>
            <strong>{rating.user_id?.username}:</strong>{' '}
            {rating.ratingValue} / 5
          </li>
        ))}
      </ul>

      {/* Add Rating */}
      {user && hasPurchased && (
        <div>
          <h4>Add your rating</h4>
          <select
            value={ratingValue}
            onChange={(e) => setRatingValue(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          <button onClick={handleAddRating} disabled={submittingRating}>
            {submittingRating ? 'Submitting...' : 'Submit Rating'}
          </button>
        </div>
      )}

      {user && !hasPurchased && (
        <p>You must purchase the book to rate it</p>
      )}
    </div>
  );
}
