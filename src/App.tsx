import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { CartDrawer } from './components/CartDrawer';
import { ScrollToTop } from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { ProductDetail } from './pages/ProductDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <BrowserRouter>
      <AdminProvider>
        <CartProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/*"
              element={
                <div className="min-h-screen bg-white font-sans">
                  <Header scrollY={scrollY} onCartClick={() => setCartOpen(true)} />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                  </Routes>
                  <Footer />
                  <WhatsAppButton />
                  <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
                </div>
              }
            />
          </Routes>
        </CartProvider>
      </AdminProvider>
    </BrowserRouter>
  );
}

export default App;
