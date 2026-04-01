import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { LogOut, Plus, CreditCard as Edit2, Trash2, Search, Home } from 'lucide-react';
import AdminProductForm from '../components/AdminProductForm';

export default function AdminDashboard() {
  const { logout } = useAdmin();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleAddClick = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleFormSave = async () => {
    handleFormClose();
    await fetchProducts();
  };

  const handleDeleteClick = (productId: string) => {
    setDeleteConfirm(productId);
  };

  const handleConfirmDelete = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        alert(`Silme hatası: ${error.message || 'Ürün silinirken bir hata oluştu'}`);
        return;
      }
      setProducts(products.filter(p => p.id !== productId));
      setDeleteConfirm(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata oluştu';
      alert(`Silme hatası: ${errorMessage}`);
    }
  };

  const handleToggleStock = async (productId: string, currentStock: boolean) => {
    try {
      const newStock = !currentStock;
      const { error } = await supabase
        .from('products')
        .update({ in_stock: newStock })
        .eq('id', productId);

      if (error) {
        alert(`Güncelleme hatası: ${error.message || 'Stok durumu güncellenirken bir hata oluştu'}`);
        return;
      }
      setProducts(products.map(p => p.id === productId ? { ...p, in_stock: newStock } : p));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata oluştu';
      alert(`Güncelleme hatası: ${errorMessage}`);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showForm) {
    return (
      <AdminProductForm
        product={editingProduct}
        onClose={handleFormClose}
        onSave={handleFormSave}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Paneli</h1>
            <p className="text-slate-600 text-sm mt-1">Ürün yönetimi</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              <Home className="w-4 h-4" />
              Ana Sayfaya Dön
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              Çıkış Yap
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleAddClick}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
            >
              <Plus className="w-5 h-5" />
              Yeni Ürün
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">Ürün bulunamadı</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Ürün Adı</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Kategori</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Fiyat</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Durum</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b border-slate-200 hover:bg-slate-50 transition">
                        <td className="px-6 py-4 text-sm text-slate-900 font-medium">{product.name}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{product.category}</td>
                        <td className="px-6 py-4 text-sm text-slate-900 font-semibold">₺{parseFloat(product.price.toString()).toFixed(2)}</td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => handleToggleStock(product.id, product.in_stock)}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition ${
                              product.in_stock
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}>
                            {product.in_stock ? 'Stokta Var' : 'Tükendi'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm flex gap-2">
                          <button
                            onClick={() => handleEditClick(product)}
                            className="inline-flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded transition"
                          >
                            <Edit2 className="w-4 h-4" />
                            Düzenle
                          </button>
                          <div className="relative group">
                            <button
                              onClick={() => handleDeleteClick(product.id)}
                              className="inline-flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded transition"
                            >
                              <Trash2 className="w-4 h-4" />
                              Sil
                            </button>
                            {deleteConfirm === product.id && (
                              <div className="absolute top-full right-0 mt-2 bg-white border border-slate-300 rounded-lg shadow-lg p-3 z-50 whitespace-nowrap">
                                <p className="text-sm text-slate-700 mb-2">Silmek istediğinizden emin misiniz?</p>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleConfirmDelete(product.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition"
                                  >
                                    Evet
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="bg-slate-300 hover:bg-slate-400 text-slate-900 px-3 py-1 rounded text-sm transition"
                                  >
                                    Hayır
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
