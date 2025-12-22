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
    <nav className="navbar">
      {/* Left */}
      <div className="nav-left">
        <Link to="/">Home</Link>
        <Link to="/books">Books</Link>
        {user && <Link to="/library">Library</Link>}
        {user?.role === 'admin' && (
          <Link to="/admin/add-book">Add Book</Link>
        )}
      </div>

      {/* Right */}
      <div className="nav-right">
        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        ) : (
          <>
            <span className="nav-user">Hello, {user.username}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
