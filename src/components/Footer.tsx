import { Phone, Mail, Instagram, Facebook, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white py-16" id="iletişim">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="font-serif text-2xl font-bold mb-4">MAVİ ZEMBİL</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Her ürünün bir hikayesi olan, özenle küratör edilmiş yaşam ürünleriyle hayatınıza değer katıyoruz.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Hızlı Linkler</h4>
            <ul className="space-y-3">
              {['Ana Sayfa', 'Ürünler', 'Hakkımızda', 'İletişim'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-zembil-terracotta transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">İletişim</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone size={16} className="flex-shrink-0" />
                <span>+90 546 576 86 39</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail size={16} className="flex-shrink-0" />
                <span>info@mavizembil.com</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <Mail size={16} className="flex-shrink-0 mt-1" />
                <span>İstanbul, Türkiye</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Sosyal Medya</h4>
            <div className="flex gap-4 mb-6">
              <a href="#" className="text-gray-400 hover:text-zembil-terracotta transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-zembil-terracotta transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-zembil-terracotta transition-colors">
                <MessageCircle size={24} />
              </a>
            </div>
            <p className="text-gray-500 text-xs mb-2">Güvenli Ödeme</p>
            <div className="flex gap-2 flex-wrap">
              {['VISA', 'MC', 'AMEX'].map((card) => (
                <div
                  key={card}
                  className="bg-gray-800 px-3 py-1.5 rounded text-xs text-gray-400 border border-gray-700"
                >
                  {card}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2024 Mavi Zembil. Tüm hakları saklıdır.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
                Gizlilik Politikası
              </a>
              <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
                Kullanım Koşulları
              </a>
              <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
                İade Politikası
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
