import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { buyBook, checkPurchase } from '../services/purchases';

export default function BookDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const [hasPurchased, setHasPurchased] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(false);

  // -----------------------------
  // Fetch book details
  // -----------------------------
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

  // -----------------------------
  // Check purchase status
  // -----------------------------
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

  // -----------------------------
  // Buy handler
  // -----------------------------
  const handleBuy = async () => {
    try {
      await buyBook(book._id);
      setHasPurchased(true);
    } catch (err) {
     alert(err?.message || 'Purchase failed');
    }
  };

  // -----------------------------
  // Render
  // -----------------------------
  if (loading) return <p>Loading...</p>;
  if (!book) return <p>Book not found</p>;

  return (
    <div>
      <h1>{book.title}</h1>
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Price:</strong> {book.price}</p>
      <p>{book.description}</p>

      <hr />

      {/* Purchase UI */}
      {!user && (
        <p>Please login to buy this book</p>
      )}

      {user && checkingPurchase && (
        <p>Checking purchase status...</p>
      )}

      {user && !checkingPurchase && !hasPurchased && (
        <button onClick={handleBuy}>
          Buy
        </button>
      )}

      {user && hasPurchased && (
        <p style={{ color: 'green' }}>
          Already Purchased
        </p>
      )}
    </div>
  );
}
