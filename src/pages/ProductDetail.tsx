import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  async function fetchProduct(productId: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching product:', error);
    } else {
      setProduct(data);
    }
    setLoading(false);
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, selectedColor || undefined, selectedSize || undefined);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const colors = product?.colors
    ? product.colors.split(',').map(c => c.trim()).filter(c => c)
    : [];
  const sizes = product?.sizes
    ? product.sizes.split(',').map(s => s.trim()).filter(s => s)
    : [];

  const canAddToCart = product?.in_stock &&
    (colors.length === 0 || selectedColor) &&
    (sizes.length === 0 || selectedSize);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Yükleniyor...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-gray-600">Ürün bulunamadı</div>
        <button
          onClick={() => navigate('/')}
          className="text-zembil-blue hover:underline"
        >
          Ana sayfaya dön
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-6">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-zembil-blue transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Geri Dön
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl bg-zembil-grey"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-6 left-6 bg-zembil-terracotta text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                {product.badge}
              </span>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-center space-y-6"
          >
            <div>
              <span className="text-sm font-medium text-zembil-terracotta uppercase tracking-wider">
                {product.category}
              </span>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-zembil-blue mt-2 mb-4">
                {product.name}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="border-t border-b border-gray-200 py-6">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-zembil-blue">
                  {product.price.toFixed(2)}
                </span>
                <span className="text-2xl text-gray-600">TL</span>
              </div>
            </div>

            <div className="space-y-6">
              {colors.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-zembil-blue mb-3">
                    Renk Seçin
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          selectedColor === color
                            ? 'bg-zembil-terracotta text-white shadow-lg'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {sizes.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-zembil-blue mb-3">
                    Beden Seçin
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          selectedSize === size
                            ? 'bg-zembil-terracotta text-white shadow-lg'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {product.in_stock ? (
                  <>
                    <button
                      onClick={handleAddToCart}
                      disabled={!canAddToCart}
                      className={`w-full px-8 py-4 rounded-lg font-medium text-lg transition-all duration-300 transform flex items-center justify-center gap-3 ${
                        canAddToCart
                          ? 'bg-zembil-terracotta hover:bg-opacity-90 text-white shadow-lg hover:scale-105'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart size={24} />
                      Sepete Ekle
                    </button>
                    {(colors.length > 0 || sizes.length > 0) && !canAddToCart && (
                      <p className="text-sm text-amber-600 text-center font-medium">
                        Lütfen tüm seçenekleri belirleyin
                      </p>
                    )}
                    {canAddToCart && (
                      <p className="text-sm text-green-600 text-center font-medium">
                        Stokta mevcut
                      </p>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4">
                    <span className="text-red-600 font-semibold text-lg">Stokta Yok</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed bottom-8 right-8 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3"
        >
          <ShoppingCart size={24} />
          <span className="font-medium">Ürün sepete eklendi!</span>
        </motion.div>
      )}
    </div>
  );
}
