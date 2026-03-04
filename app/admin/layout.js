'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, Users, LogOut, Settings, ShoppingCart } from 'lucide-react';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Basic client-side check from local state or token decoding
    // Real protection happens in middleware.ts (Edge) and verifyRole (Server)
    const storeStr = localStorage.getItem('risewave-storage');
    if (storeStr) {
      const { state } = JSON.parse(storeStr);
      if (state && state.user && state.user.role) {
        setRole(state.user.role);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('risewave-storage');
    document.cookie = 'token=; Max-Age=0; path=/';
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex bg-cream">
      {/* Sidebar */}
      <aside className="w-64 bg-dark text-cream flex-col hidden md:flex">
        <div className="p-6 border-b border-white/10">
          <Link href="/admin">
            <h1 className="text-2xl font-heading font-bold text-teal">
              RiseAdmin
            </h1>
          </Link>
          <p className="text-sm font-body mt-2 text-white/60">
            {role === 'master' ? 'Master Control' : 'Panel de Administración'}
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2 font-body">
          <Link 
            href="/admin" 
            className="flex items-center space-x-3 px-4 py-3 rounded hover:bg-white/5 transition-colors"
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>

          <Link 
            href="/admin/orders" 
            className="flex items-center space-x-3 px-4 py-3 rounded hover:bg-white/5 transition-colors"
          >
            <ShoppingCart size={20} />
            <span>Pedidos</span>
          </Link>

          <Link 
            href="/admin/products" 
            className="flex items-center space-x-3 px-4 py-3 rounded hover:bg-white/5 transition-colors"
          >
            <Package size={20} />
            <span>Productos</span>
          </Link>

          {role === 'master' && (
            <Link 
              href="/admin/master-only/users" 
              className="flex items-center space-x-3 px-4 py-3 rounded hover:bg-white/5 transition-colors border-l-2 border-red-accent"
            >
              <Users size={20} />
              <span>Usuarios (Master)</span>
            </Link>
          )}

          {['admin', 'master'].includes(role) && (
            <Link 
              href="/admin/settings" 
              className="flex items-center space-x-3 px-4 py-3 rounded hover:bg-white/5 transition-colors border-l-2 border-teal"
            >
              <Settings size={20} />
              <span>Costos de Impresión</span>
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-white/5 rounded transition-colors font-body"
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
