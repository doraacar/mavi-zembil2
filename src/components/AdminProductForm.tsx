import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { X, Upload, AlertCircle } from 'lucide-react';
import { optimizeImage } from '../utils/imageOptimization';

interface AdminProductFormProps {
  product: Product | null;
  onClose: () => void;
  onSave: () => void;
}

export default function AdminProductForm({ product, onClose, onSave }: AdminProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    image: '',
    badge: '',
    colors: '',
    sizes: '',
    in_stock: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        description: product.description,
        image: product.image,
        badge: product.badge || '',
        colors: product.colors || '',
        sizes: product.sizes || '',
        in_stock: product.in_stock,
      });
      setImagePreview(product.image);
    }
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setError('');
        setUploading(true);
        setImageFile(file);
        const base64 = await optimizeImage(file);
        setImagePreview(base64);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata oluştu';
        setError(`Resim işleme hatası: ${errorMessage}`);
      } finally {
        setUploading(false);
      }
    }
  };

  const convertImageToBase64 = async (file: File): Promise<string> => {
    try {
      const base64 = await optimizeImage(file);
      return base64;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata oluştu';
      console.error('Image conversion error:', error);
      setError(`Resim dönüştürme hatası: ${errorMessage}`);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      let imageData = formData.image;

      if (imageFile) {
        imageData = await convertImageToBase64(imageFile);
      }

      if (!imageData) {
        setError('Lütfen bir resim ekleyin (URL veya dosya yükle)');
        setSaving(false);
        return;
      }

      const payload = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        description: formData.description,
        image: imageData,
        badge: formData.badge || null,
        colors: formData.colors || null,
        sizes: formData.sizes || null,
        in_stock: formData.in_stock,
      };

      if (product) {
        const { error: updateError } = await supabase
          .from('products')
          .update(payload)
          .eq('id', product.id);

        if (updateError) {
          throw new Error(updateError.message || 'Ürün güncellenirken hata oluştu');
        }
      } else {
        const { error: insertError } = await supabase
          .from('products')
          .insert([payload]);

        if (insertError) {
          throw new Error(insertError.message || 'Ürün eklenirken hata oluştu');
        }
      }

      onSave();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata oluştu';
      console.error('Save error:', error);
      setError(`Ürün kaydedilirken hata: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  const categories = ['Tekstil', 'Ayakkabı', 'Hobi', 'Sanat'];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">
            {product ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
          </h1>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {error && (
            <div className="flex gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                Ürün Adı *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ürün adı"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
                Kategori *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Kategori seçin</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-2">
                Fiyat (₺) *
              </label>
              <input
                id="price"
                name="price"
                type="number"
                required
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="badge" className="block text-sm font-medium text-slate-700 mb-2">
                Badge (El Yapımı, Yeni, vb.)
              </label>
              <input
                id="badge"
                name="badge"
                type="text"
                value={formData.badge}
                onChange={handleInputChange}
                placeholder="Badge metni"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="colors" className="block text-sm font-medium text-slate-700 mb-2">
                Mevcut Renkler
              </label>
              <input
                id="colors"
                name="colors"
                type="text"
                value={formData.colors}
                onChange={handleInputChange}
                placeholder="Siyah, Beyaz, Mavi"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-500 mt-1">Virgülle ayırarak girin</p>
            </div>

            <div>
              <label htmlFor="sizes" className="block text-sm font-medium text-slate-700 mb-2">
                Mevcut Bedenler/Numaralar
              </label>
              <input
                id="sizes"
                name="sizes"
                type="text"
                value={formData.sizes}
                onChange={handleInputChange}
                placeholder="36, 37, 38, 39"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-500 mt-1">Virgülle ayırarak girin</p>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
              Açıklama *
            </label>
            <textarea
              id="description"
              name="description"
              required
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Ürün açıklaması"
              rows={4}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Resim</label>
            <div className="space-y-4">
              <div>
                <label htmlFor="imageUrl" className="block text-xs font-medium text-slate-600 mb-1">
                  Resim URL'si
                </label>
                <input
                  id="imageUrl"
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={uploading}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto group-hover:text-blue-400 transition" />
                  <p className="text-sm text-slate-600">
                    {uploading ? 'Yükleniyor...' : 'Resim yüklemek için tıkla veya sürükle'}
                  </p>
                </div>
              </div>

              {imagePreview && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-slate-600 mb-2">Önizleme:</p>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border border-slate-300"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="in_stock"
              name="in_stock"
              type="checkbox"
              checked={formData.in_stock}
              onChange={handleInputChange}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="in_stock" className="text-sm font-medium text-slate-700">
              Stokta Var
            </label>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold py-3 rounded-lg transition"
            >
              {saving ? 'Kaydediliyor...' : (product ? 'Güncelle' : 'Ürün Ekle')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-300 hover:bg-slate-400 text-slate-900 font-semibold py-3 rounded-lg transition"
            >
              İptal
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
