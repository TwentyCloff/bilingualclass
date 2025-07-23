// src/App.jsx
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, Gift, Mail, X, Heart } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebaseConfig";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Student from "./components/Student";
import Footer from "./components/Footer";
import Contact from "./components/Contact";
import Birthday from "./components/Birthday";
import SignIn from "./components/Auth";
import Achievment from "./components/Achievment";
import Confess from "./components/Confess";
import AdminConfessions from "./components/AdminConfessions";
import List from "./components/List"
import Kas from "./components/Kas"
import AdminKas from "./components/AdminKas"

const Home = () => (
  <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
    <Hero />
    <Navbar />
    <Student />
    <Footer />
  </div>
);

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
    <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
    <p className="text-xl text-gray-700 mb-8">Halaman tidak ditemukan.</p>
    <a href="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Kembali ke Beranda</a>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/Sign-In" replace />;
};

const App = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateTo = (path) => {
    if ((path === '/birthday' || path === '/contact') && !user) {
      navigate('/Sign-In');
      return;
    }
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Sign-In" element={<SignIn />} />
        <Route path="/Achievement" element={<Achievment />} />
        <Route path="/confess" element={<Confess />} />
        <Route path="/admin/confessions" element={<AdminConfessions />} />
        <Route path="/list" element={<List />} />
        <Route path="/kas" element={<Kas />} />
        <Route path="/manage/kas" element={<AdminKas />} />
        <Route 
          path="/contact" 
          element={
            <ProtectedRoute>
              <Contact />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/birthday" 
          element={
            <ProtectedRoute>
              <Birthday />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleMenu}
          className="w-14 h-14 rounded-full bg-black border border-white/20 flex items-center justify-center shadow-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-110"
        >
          <div className={`transform transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : 'rotate-0'}`}>
            {isMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </div>
        </button>

        {/* Popup Menu */}
        <div className={`absolute bottom-16 right-0 w-48 bg-black border border-white/20 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 origin-bottom-right ${
          isMenuOpen 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
        }`}>
          <button
            onClick={() => navigateTo("/confess")}
            style={{ animationDelay: '50ms' }}
            className={`w-full px-4 py-3 flex items-center hover:bg-white/10 transition-all duration-200 transform ${
              isMenuOpen ? 'animate-slide-in-right' : ''
            }`}
          >
            <Heart className="w-5 h-5 mr-3 text-red-400" />
            <span>Confess</span>
          </button>
          <button
            onClick={() => navigateTo("/birthday")}
            style={{ animationDelay: '100ms' }}
            className={`w-full px-4 py-3 flex items-center hover:bg-white/10 transition-all duration-200 border-t border-white/10 transform ${
              isMenuOpen ? 'animate-slide-in-right' : ''
            }`}
          >
            <Gift className="w-5 h-5 mr-3 text-pink-400" />
            <span>Birthday</span>
          </button>
          <button
            onClick={() => navigateTo("/contact")}
            style={{ animationDelay: '150ms' }}
            className={`w-full px-4 py-3 flex items-center hover:bg-white/10 transition-all duration-200 border-t border-white/10 transform ${
              isMenuOpen ? 'animate-slide-in-right' : ''
            }`}
          >
            <Mail className="w-5 h-5 mr-3 text-blue-400" />
            <span>Contact</span>
          </button>
          {!user && (
            <button
              onClick={() => navigateTo("/")}
              style={{ animationDelay: '200ms' }}
              className={`w-full px-4 py-3 flex items-center hover:bg-white/10 transition-all duration-200 border-t border-white/10 text-sm text-yellow-400 transform ${
                isMenuOpen ? 'animate-slide-in-right' : ''
              }`}
            >
              Sign In Required
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default App;
