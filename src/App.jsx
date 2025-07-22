import { Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, Gift, Mail, X } from "lucide-react";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Student from "./components/Student";
import Footer from "./components/Footer";
import Contact from "./components/Contact";
import Birthday from "./components/Birthday";

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

const App = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateTo = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/birthday" element={<Birthday />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleMenu}
          className="w-14 h-14 rounded-full bg-black border border-white/20 flex items-center justify-center shadow-lg hover:bg-white/10 transition-all"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </button>

        {/* Popup Menu */}
        {isMenuOpen && (
          <div className="absolute bottom-16 right-0 w-48 bg-black border border-white/20 rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={() => navigateTo("/birthday")}
              className="w-full px-4 py-3 flex items-center hover:bg-white/10 transition-all"
            >
              <Gift className="w-5 h-5 mr-3 text-pink-400" />
              <span>Birthday</span>
            </button>
            <button
              onClick={() => navigateTo("/contact")}
              className="w-full px-4 py-3 flex items-center hover:bg-white/10 transition-all border-t border-white/10"
            >
              <Mail className="w-5 h-5 mr-3 text-blue-400" />
              <span>Contact</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default App;