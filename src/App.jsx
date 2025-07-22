import { Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Student from "./components/Student";

const Home = () => (
  <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
    <Hero />
    <Navbar />
    <Student />
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
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* ✅ Floating Watermark SMANPUL */}
      <div
        style={{
          position: "fixed",
          bottom: "1rem",
          right: "1rem",
          background: "rgba(0,0,0,0.6)",
          color: "white",
          padding: "6px 12px",
          borderRadius: "999px",
          fontSize: "12px",
          fontWeight: "500",
          zIndex: 9999,
          pointerEvents: "none",
          maxWidth: "90vw",
        }}
      >
        SMAN 10 PTK
      </div>
    </>
  );
};

export default App;
