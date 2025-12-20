import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BookDetailsPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBook();
  }, [id]);

  const loadBook = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3000/books/${id}`);
      const data = await res.json();
      setBook(data);
    } catch (error) {
      console.error('Failed to load book:', error);
      setBook(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading book...</p>;
  }

  if (!book) {
    return <p>Book not found</p>;
  }

  return (
    <div>
      <h1>{book.title}</h1>
      <p><b>Author:</b> {book.authorName}</p>
      <p>{book.description}</p>

      <a href={book.previewPdfUrl} target="_blank" rel="noreferrer">
        Read Preview (Free)
      </a>
    </div>
  );
};

export default BookDetailsPage;
