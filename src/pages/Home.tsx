import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

export function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(() => {
      fetchProducts();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <ProductGrid products={products} loading={loading} navigate={navigate} />
      <Story />
    </div>
  );
}

function Hero() {
  return (
    <section className="min-h-screen pt-24 md:pt-0 bg-zembil-beige">
      <div className="container mx-auto px-6 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-zembil-blue leading-tight">
              Küratörlüğümüzle Hayatınıza Renk Katın
            </h1>
            <p className="text-lg md:text-xl font-light text-gray-700 leading-relaxed">
              Özenle seçilmiş tekstil, ayakkabı, hobi ve sanat ürünlerini Mavi Zembil'in zanaatkar dokunuşuyla keşfedin.
            </p>
            <button
              onClick={() => {
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-zembil-terracotta hover:bg-opacity-90 text-white px-10 py-4 rounded-full font-medium text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Koleksiyonu Keşfet
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[500px] md:h-[600px] lg:h-[700px] rounded-2xl overflow-hidden shadow-2xl"
          >
            <img
              src="/mavi.webp"
              alt="Mavi Zembil curated collection"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ProductGrid({
  products,
  loading,
  navigate
}: {
  products: Product[];
  loading: boolean;
  navigate: (path: string) => void;
}) {
  const { addToCart } = useCart();
  const [cartToast, setCartToast] = useState<string | null>(null);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (product.in_stock) {
      addToCart(product);
      setCartToast(product.id);
      setTimeout(() => setCartToast(null), 2000);
    }
  };

  if (loading) {
    return (
      <section className="py-24 bg-white" id="products">
        <div className="container mx-auto px-6">
          <div className="text-center text-gray-600">Yükleniyor...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white" id="products">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-zembil-blue mb-4">
            Öne Çıkan Hazineler
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Özenle seçilmiş {products.length} ürünümüzü keşfedin
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.3, delay: Math.min(index * 0.01, 0.2) }}
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border border-gray-100 flex flex-col relative"
            >
              <div
                onClick={() => navigate(`/product/${product.id}`)}
                className="relative aspect-[4/5] overflow-hidden bg-zembil-grey cursor-pointer"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {product.badge && (
                  <span className="absolute top-2 left-2 bg-zembil-terracotta text-white px-2 py-0.5 rounded-full text-[10px] font-medium shadow-md">
                    {product.badge}
                  </span>
                )}
                {!product.in_stock && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="bg-white text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
                      Stokta Yok
                    </span>
                  </div>
                )}
              </div>
              <div
                onClick={() => navigate(`/product/${product.id}`)}
                className="p-2.5 flex flex-col cursor-pointer"
              >
                <h3 className="font-serif text-sm font-semibold text-gray-800 mb-1 line-clamp-2 min-h-[2.5rem]">
                  {product.name}
                </h3>
                <div className="flex items-baseline justify-between mt-auto">
                  <span className="text-lg font-bold text-zembil-blue">
                    {product.price.toFixed(0)} TL
                  </span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wide">{product.category}</span>
                </div>
              </div>
              {cartToast === product.id && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-xl text-sm font-medium pointer-events-none z-10"
                >
                  Sepete Eklendi!
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Story() {
  const artisanalImages = [
    {
      src: 'https://images.pexels.com/photos/1570264/pexels-photo-1570264.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Oil paint texture',
    },
    {
      src: 'https://images.pexels.com/photos/3738382/pexels-photo-3738382.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Natural fabric weave',
    },
    {
      src: 'https://images.pexels.com/photos/1682812/pexels-photo-1682812.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Leather craftsmanship',
    },
    {
      src: 'https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Artisan tools',
    },
  ];

  return (
    <section className="py-24 bg-zembil-blue text-white" id="hakkımızda">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              Mavi Zembil Felsefesi
            </h2>
            <div className="space-y-6 text-lg leading-relaxed">
              <p>
                Mavi Zembil, sıradan bir e-ticaret platformu değil; her ürünün bir hikayesi olduğuna
                inanan, kaliteyi niceliğe tercih eden bir küratörlük projesidir.
              </p>
              <p>
                Tekstilden ayakkabıya, hobiden sanata kadar her kategoride, yerel zanaatkarlardan ve
                dünya çapında tanınan markalardan özenle seçilmiş ürünleri sizlerle buluşturuyoruz.
              </p>
              <p>
                Bizim için her "zembil" bir hazine sandığı gibidir. İçinde keşfedilmeyi bekleyen,
                yaşamınıza değer katacak, size ilham verecek ürünler barındırır.
              </p>
              <p className="font-semibold text-zembil-beige">
                Mavi Zembil ile alışveriş yapmak, sadece bir şey satın almak değil; bir yaşam tarzını
                benimsemektir.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-2 gap-4"
          >
            {artisanalImages.map((image, index) => (
              <motion.img
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                src={image.src}
                alt={image.alt}
                className={`w-full h-64 object-cover rounded-lg shadow-xl ${
                  index === 1 ? 'mt-8' : index === 2 ? '-mt-8' : ''
                }`}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
