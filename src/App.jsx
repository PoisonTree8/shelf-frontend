import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Books from "./pages/Books.jsx";
import BookDetailsPage from './pages/BookDetails.jsx';

export default function App() {
  return (
    <div style={{ padding: 20 }}>
      <nav style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <Link to="/">Home</Link>
        <Link to="/books">Books</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/books/:id" element={<BookDetailsPage />} />
      </Routes>
    </div>
  );
}
