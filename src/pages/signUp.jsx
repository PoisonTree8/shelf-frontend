import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './SignUp.css';

export default function SignUp() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/sign-up`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.err || 'Sign up failed');
      }

      const data = await res.json();

      // Save token
      localStorage.setItem('token', data.token);

      const decodedUser = JSON.parse(atob(data.token.split('.')[1]));
      setUser(decodedUser);

      navigate('/books');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sign-up-container">
      <h1 className="sign-up-title">Sign Up</h1>

      {error && <p className="sign-up-error">{error}</p>}

      <form className="sign-up-form" onSubmit={handleSubmit}>
        <div className="sign-up-field">
          <label className="sign-up-label">Username</label>
          <input
            className="sign-up-input"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="sign-up-field">
          <label className="sign-up-label">Email</label>
          <input
            className="sign-up-input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="sign-up-field">
          <label className="sign-up-label">Password</label>
          <input
            className="sign-up-input"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button className="sign-up-button" type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}
