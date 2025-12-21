import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
      

      <span style={{ float: 'right' }}>
        {!user ? (
          <>
          <Link to="/">Home</Link>{' | '}

          <Link to="/books">Books</Link>{' | '}

            <Link to="/login">Login</Link>{' | '}
            
            <Link to="/signup">Sign Up</Link>
          </>
        ) : (
          <>
            <span style={{ marginRight: '1rem' }}>
              Hello, {user.username}
            </span>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </span>
    </nav>
  );
}
