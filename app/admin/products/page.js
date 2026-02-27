'use client';

import { useState, useEffect } from 'react';
import ProductUploader from '@/components/ProductUploader';
import { Package, Eye, EyeOff, Edit2, Plus, Info, Trash2 } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploader, setShowUploader] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVisibility = async (id, currentVis) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible: !currentVis })
      });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const updateEstado = async (id, newEstado) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: newEstado })
      });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowUploader(true);
    // Scroll to top where the uploader is
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto de forma permanente?')) return;
    
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-4 border-b-2 border-dark/10">
        <div className="flex items-center space-x-3">
          <Package size={32} className="text-teal" />
          <h1 className="text-3xl font-heading font-bold text-dark">
            Gestión de Catálogo
          </h1>
        </div>
        <button 
          onClick={() => setShowUploader(!showUploader)}
          className="bg-teal text-cream px-4 py-2 rounded font-bold hover:bg-teal-light transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Nuevo Producto</span>
        </button>
      </div>

      {showUploader && (
        <section className="animate-in fade-in slide-in-from-top-4 duration-300">
          <ProductUploader 
            initialData={editingProduct}
            onSuccess={() => {
              setShowUploader(false);
              setEditingProduct(null);
              fetchProducts();
            }} 
          />
          <div className="flex justify-end mt-4">
            <button 
              onClick={() => { setShowUploader(false); setEditingProduct(null); }}
              className="text-dark/60 hover:text-dark font-body text-sm underline"
            >
              Cancelar {editingProduct ? 'Edición' : 'Creación'}
            </button>
          </div>
        </section>
      )}

      {/* Info Box */}
      <section className="bg-teal/5 p-4 rounded-lg flex items-start space-x-3 text-teal">
        <Info size={24} className="flex-shrink-0 mt-1" />
        <p className="text-sm font-body">
          <strong>Tip de Visibilidad:</strong> Ocultar un producto usando el ícono de ojo evitará que los clientes lo vean en la tienda, útil para borradores o productos descontinuados sin perder su historial.
        </p>
      </section>

      {/* Products Table */}
      <div className="bg-white rounded-lg border-2 border-dark/10 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-dark/50">Cargando inventario...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-dark text-cream font-heading">
                  <th className="p-4 border-b border-dark/20 text-sm">Producto</th>
                  <th className="p-4 border-b border-dark/20 text-sm">Precio / Stock</th>
                  <th className="p-4 border-b border-dark/20 text-sm">Categoría</th>
                  <th className="p-4 border-b border-dark/20 text-sm">Estado</th>
                  <th className="p-4 border-b border-dark/20 text-sm text-center">Visibilidad</th>
                  <th className="p-4 border-b border-dark/20 text-sm text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="font-body text-sm text-dark/80">
                {products.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center">No hay productos en el catálogo.</td>
                  </tr>
                )}
                {products.map((p) => (
                  <tr key={p._id} className={`hover:bg-black/5 transition-colors border-b border-dark/10 last:border-0 ${!p.visible ? 'opacity-60 bg-gray-50' : ''}`}>
                    <td className="p-4 flex items-center space-x-3">
                      <img src={p.image?.url || 'https://via.placeholder.com/40'} alt={p.titulo} className="w-10 h-10 object-cover rounded bg-dark/10" />
                      <span className="font-bold">{p.titulo}</span>
                    </td>
                    <td className="p-4">
                      <div>${p.precio}</div>
                      <div className="text-xs text-dark/50">Stock: {p.stock}</div>
                    </td>
                    <td className="p-4">{p.categoria}</td>
                    <td className="p-4">
                      <select 
                        value={p.estado || "Activo"}
                        onChange={(e) => updateEstado(p._id, e.target.value)}
                        className={`border rounded p-1 text-xs outline-none font-bold ${
                          p.estado === 'Activo' ? 'bg-teal/10 text-teal border-teal/20' : 
                          p.estado === 'Pausado' ? 'bg-amber-100 text-amber-700 border-amber-200' : 
                          'bg-red-accent/10 text-red-accent border-red-accent/20'
                        }`}
                      >
                        <option value="Activo">Activo</option>
                        <option value="Pausado">Pausado</option>
                        <option value="Sin Stock">Sin Stock</option>
                      </select>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => toggleVisibility(p._id, p.visible)}
                        className={`p-2 rounded-full transition-colors ${p.visible ? 'text-teal hover:bg-teal/10' : 'text-dark/40 hover:bg-dark/10'}`}
                        title={p.visible ? "Ocultar producto" : "Mostrar producto"}
                      >
                        {p.visible ? <Eye size={20} /> : <EyeOff size={20} />}
                      </button>
                    </td>
                    <td className="p-4 text-center flex items-center justify-center space-x-2">
                      <button 
                        onClick={() => handleEdit(p)}
                        className="p-2 text-teal hover:bg-teal/10 rounded-full transition-colors"
                        title="Editar producto"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(p._id)}
                        className="p-2 text-red-accent hover:bg-red-accent/10 rounded-full transition-colors"
                        title="Eliminar producto"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
