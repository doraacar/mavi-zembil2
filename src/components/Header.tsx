import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, Settings } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  scrollY: number;
  onCartClick: () => void;
}

export function Header({ scrollY, onCartClick }: HeaderProps) {
  const isScrolled = scrollY > 50;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartShake, setCartShake] = useState(false);
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (totalItems > 0) {
      setCartShake(true);
      setTimeout(() => setCartShake(false), 500);
    }
  }, [totalItems]);

  const navItems = [
    { name: 'Ürünler', href: '#products' },
    { name: 'Hakkımızda', href: '#hakkımızda' },
    { name: 'İletişim', href: '#iletişim' },
  ];

  const handleNavClick = (href: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(href);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-4' : 'bg-zembil-beige/95 py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <h1
          onClick={() => navigate('/')}
          className="font-serif font-bold text-2xl md:text-3xl transition-colors duration-300 text-zembil-blue cursor-pointer"
        >
          MAVİ ZEMBİL
        </h1>

        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavClick(item.href)}
              className="text-xs font-light tracking-widest uppercase transition-colors duration-300 hover:text-zembil-terracotta text-gray-700"
            >
              {item.name}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin')}
            className="p-2 text-zembil-blue hover:text-zembil-terracotta transition-all duration-300"
            title="Admin Panel"
          >
            <Settings size={28} />
          </button>

          <button
            onClick={onCartClick}
            className={`relative p-2 text-zembil-blue hover:text-zembil-terracotta transition-all duration-300 ${
              cartShake ? 'animate-shake' : ''
            }`}
          >
            <ShoppingCart size={28} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-zembil-terracotta text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-zembil-blue z-50 relative"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-40 pt-24 px-8"
            >
              <div className="flex flex-col space-y-6">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    className="text-lg font-light text-gray-800 hover:text-zembil-terracotta transition-colors duration-300 border-b border-gray-100 pb-4 text-left"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
