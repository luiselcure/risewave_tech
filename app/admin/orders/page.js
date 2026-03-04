'use client';

import { useEffect, useState } from 'react';
import { Package, Search, Filter, Eye, RefreshCw, CheckCircle2, Truck, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Client-side role protection
    const storeStr = localStorage.getItem('risewave-storage');
    if (storeStr) {
      const { state } = JSON.parse(storeStr);
      if (!state?.user || !['admin', 'master'].includes(state.user.role)) {
        router.push('/');
        return;
      }
    } else {
      router.push('/login');
      return;
    }

    fetchOrders();
  }, [router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, estado_envio: newStatus })
      });
      if (res.ok) {
        // Update local state without full refetch
        setOrders(orders.map(o => o._id === orderId ? { ...o, estado_envio: newStatus } : o));
      } else {
        alert('Error al actualizar el estado.');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error de red al actualizar estado.');
    }
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pagado':
        return <span className="bg-teal/10 text-teal px-2 py-1 rounded text-xs font-bold border border-teal/20 flex items-center justify-center gap-1 w-max"><CheckCircle2 size={12}/> Pagado</span>;
      case 'Pendiente':
        return <span className="bg-yellow-500/10 text-yellow-600 px-2 py-1 rounded text-xs font-bold border border-yellow-500/20 flex items-center justify-center gap-1 w-max"><RefreshCw size={12} className="animate-spin-slow" /> Pendiente</span>;
      case 'Rechazado':
        return <span className="bg-red-accent/10 text-red-accent px-2 py-1 rounded text-xs font-bold border border-red-accent/20 flex items-center justify-center gap-1 w-max">Rechazado</span>;
      default:
        return <span className="bg-dark/10 text-dark px-2 py-1 rounded text-xs font-bold border border-dark/20 w-max">{status}</span>;
    }
  };

  const filteredOrders = orders.filter(o => 
    o._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.comprador.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.comprador.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-dark">Gestión de Pedidos</h1>
          <p className="text-dark/60 font-body">Revisa las compras, pagos y coordina los envíos.</p>
        </div>
        <button 
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center space-x-2 bg-white border-2 border-dark/10 text-dark px-4 py-2 text-sm font-bold rounded hover:border-teal hover:text-teal transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          <span>Actualizar Lista</span>
        </button>
      </div>

      <div className="bg-white border-2 border-dark/10 rounded-lg p-6 relative">
        
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/40" size={20} />
            <input 
              type="text"
              placeholder="Buscar por ID, cliente o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-dark/10 rounded outline-none focus:border-teal font-body text-sm"
            />
          </div>
          <div className="flex items-center space-x-2 text-sm text-dark/60 font-medium">
             Total: <span className="font-bold text-dark">{filteredOrders.length}</span> órdenes
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b-2 border-dark/10">
                <th className="p-3 font-heading font-bold text-dark/70 text-sm whitespace-nowrap">ID / Fecha</th>
                <th className="p-3 font-heading font-bold text-dark/70 text-sm">Cliente</th>
                <th className="p-3 font-heading font-bold text-dark/70 text-sm">Pago</th>
                <th className="p-3 font-heading font-bold text-dark/70 text-sm">Envío</th>
                <th className="p-3 font-heading font-bold text-dark/70 text-sm">Total</th>
                <th className="p-3 font-heading font-bold text-dark/70 text-sm text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-dark/60">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <RefreshCw className="animate-spin text-teal" size={32} />
                      <p>Cargando órdenes desde la base de datos...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-dark/60 font-body">
                    No se encontraron pedidos.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="border-b border-dark/5 hover:bg-dark/[0.02] transition-colors">
                    <td className="p-3 align-top">
                      <div className="font-mono text-xs font-bold text-teal">#{order._id.substring(order._id.length - 6).toUpperCase()}</div>
                      <div className="text-xs text-dark/50 mt-1 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString()}
                        <br/>
                        {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </td>
                    <td className="p-3 align-top">
                      <div className="font-bold text-sm text-dark">{order.comprador?.nombre}</div>
                      <div className="text-xs text-dark/60">{order.comprador?.email}</div>
                    </td>
                    <td className="p-3 align-top">
                      {getStatusBadge(order.estado_pago)}
                    </td>
                    <td className="p-3 align-top">
                      <select
                        value={order.estado_envio}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="text-xs font-bold border-2 border-dark/10 rounded px-2 py-1 outline-none focus:border-teal cursor-pointer bg-white"
                      >
                        <option value="Preparando">📦 Preparando</option>
                        <option value="Enviado">🚚 Enviado</option>
                        <option value="Entregado">✅ Entregado</option>
                        <option value="Cancelado">❌ Cancelado</option>
                      </select>
                    </td>
                    <td className="p-3 font-bold text-sm text-dark align-top">
                      ${order.total?.toLocaleString() ?? 0}
                    </td>
                    <td className="p-3 text-right align-top">
                      <button 
                        onClick={() => openModal(order)}
                        className="px-3 py-1.5 text-xs font-bold text-teal hover:bg-teal hover:text-white border-2 border-teal rounded transition-colors inline-flex items-center space-x-1" 
                        title="Ver Detalles"
                      >
                        <Eye size={14} />
                        <span>Detalle</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal Overlay */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-dark/10 flex justify-between items-center bg-cream">
              <div>
                <h3 className="text-lg font-heading font-bold text-dark">Detalle del Pedido</h3>
                <p className="text-xs font-mono text-teal font-bold uppercase">#{selectedOrder._id}</p>
              </div>
              <button onClick={closeModal} className="text-dark/50 hover:text-red-accent transition-colors p-1">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <h4 className="text-sm font-bold text-dark/50 uppercase tracking-wider mb-2">Comprador</h4>
                   <p className="font-body text-sm font-bold text-dark">{selectedOrder.comprador?.nombre}</p>
                   <p className="font-body text-sm text-dark/70">Email: {selectedOrder.comprador?.email}</p>
                   <p className="font-body text-sm text-dark/70">Tel: {selectedOrder.comprador?.telefono || 'N/A'}</p>
                </div>
                
                <div className="space-y-2">
                   <h4 className="text-sm font-bold text-dark/50 uppercase tracking-wider mb-2">Envío</h4>
                   {selectedOrder.datosEnvio ? (
                     <p className="font-body text-sm text-dark/80 leading-relaxed">
                       {selectedOrder.datosEnvio.calle} {selectedOrder.datosEnvio.altura}<br/>
                       {selectedOrder.datosEnvio.ciudad}, CP: {selectedOrder.datosEnvio.codigoPostal}<br/>
                       {selectedOrder.datosEnvio.provincia && selectedOrder.datosEnvio.provincia}
                     </p>
                   ) : (
                     <p className="text-sm italic text-dark/50">Sin datos de envío</p>
                   )}
                </div>
              </div>

              <div className="pt-4 border-t border-dark/10">
                <h4 className="text-sm font-bold text-dark/50 uppercase tracking-wider mb-4">Productos Comprados</h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-dark/5 border border-dark/10 rounded">
                      <div>
                        <p className="font-bold text-sm text-dark">{item.titulo}</p>
                        <div className="flex gap-3 text-xs text-dark/60 mt-1">
                          <span>Cantidad: <span className="font-bold">{item.cantidad}</span></span>
                          {item.color && <span>Color: <span className="font-bold text-dark">{item.color}</span></span>}
                        </div>
                      </div>
                      <div className="font-bold text-dark text-sm">
                        ${(item.precio * item.cantidad).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center text-lg">
                <span className="font-bold text-dark/70">Gran Total</span>
                <span className="font-heading font-bold text-red-accent text-2xl">${selectedOrder.total?.toLocaleString() ?? 0}</span>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-dark/10 bg-cream flex justify-end">
              <button 
                onClick={closeModal}
                className="px-6 py-2 bg-dark text-white font-bold rounded hover:bg-dark/80 transition-colors"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
