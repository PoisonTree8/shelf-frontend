import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Books from "./pages/Books.jsx";
import BookDetailsPage from './pages/BookDetails.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/signUp.jsx';
import Navbar from './components/Navbar';
import Library from './pages/Library';



export default function App() {
  return (
    <div style={{ padding: 20 }}>
      <nav style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <Navbar />  
        
        
       

      </nav>
    

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/books/:id" element={<BookDetailsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/library" element={<Library />} />

      </Routes>
    </div>
  );
}
