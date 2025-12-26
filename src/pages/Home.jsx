import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <h1>Read smarter. Grow deeper.</h1>
        <p>Your digital library for knowledge, stories, and mastery.</p>
        <div className="hero-buttons">
          <button onClick={() => navigate('/books')}>Explore Books</button>
          <button onClick={() => navigate('/books')}>Start Reading</button>
        </div>
      </section>

      {/* Why Shelf Section */}
      <section className="why-shelf">
        <h2>Why Shelf?</h2>
        <div className="features">
          <div className="feature-card">
            <h3>Instant Access</h3>
            <p>Read your books instantly without downloads.</p>
          </div>
          <div className="feature-card">
            <h3>Preview Before You Buy</h3>
            <p>Read the first chapter before purchasing.</p>
          </div>
          <div className="feature-card">
            <h3>Your Personal Library</h3>
            <p>All your purchased books in one place.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <ol>
          <li>Browse books</li>
          <li>Read preview</li>
          <li>Buy & read full book</li>
        </ol>
      </section>

      {/* Call To Action Section */}
      <section className="call-to-action">
        <h2>Start building your library today.</h2>
        <button onClick={() => navigate('/books')}>Browse Books</button>
      </section>
    </div>
  );
};

export default Home;
