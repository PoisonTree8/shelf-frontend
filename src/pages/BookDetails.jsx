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
      <div className="book-details">
        {book.coverImageUrl && (
          <img src={book.coverImageUrl} alt={book.title} />
        )}

        <h1>{book.title}</h1>
        <p><strong>Author:</strong> {book.author}</p>
        <p><strong>Price:</strong> {book.price} BD</p>
        <p>{book.description}</p>

        <button className="primary" onClick={handleRead}>
          {hasPurchased ? 'Read Full Book' : 'Read Preview'}
        </button>

        <br /><br />

        {!user && <p>Please login to purchase this book</p>}

        {user && !hasPurchased && (
          <button className="secondary" onClick={handleBuy}>
            Buy Book
          </button>
        )}

        {user && hasPurchased && (
          <p style={{ color: 'green' }}>Already Purchased</p>
        )}

        <hr />

        <h3>Ratings</h3>

        {ratings.length === 0 && <p>No ratings yet</p>}

        <ul className="rating-list">
          {ratings.map((rating) => (
            <li key={rating._id}>
              <strong>{rating.user_id?.username}:</strong>{' '}
              {rating.ratingValue} / 5
            </li>
          ))}
        </ul>

        {user && hasPurchased && (
          <div>
            <h4>Add your rating</h4>

            <select
              value={ratingValue}
              onChange={(e) => setRatingValue(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>

            <br /><br />

            <button
              className="primary"
              onClick={handleAddRating}
              disabled={submittingRating}
            >
              {submittingRating ? 'Submitting...' : 'Submit Rating'}
            </button>
          </div>
        )}

        {user && !hasPurchased && (
          <p>You must purchase the book to rate it</p>
        )}
      </div>
    </div>
  );
}
