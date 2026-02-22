'use client';

import { useEffect, useState } from 'react';
import { Package, Users, Activity } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storeStr = localStorage.getItem('auth-storage');
    if (storeStr) {
      const { state } = JSON.parse(storeStr);
      if (state && state.user && state.user.role) {
        setRole(state.user.role);
      }
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b-2 border-dark/10 pb-4">
        <h1 className="text-3xl font-heading font-bold text-dark">Panel de Control</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border-2 border-dark/10 flex flex-col items-center text-center">
          <div className="bg-teal/10 p-4 rounded-full mb-4">
            <Package size={40} className="text-teal" />
          </div>
          <h2 className="text-xl font-heading font-bold mb-2">Catálogo</h2>
          <p className="text-dark/70 font-body mb-4">Gestiona productos, stock e imágenes</p>
          <Link 
            href="/admin/products"
            className="mt-auto bg-dark text-white px-6 py-2 rounded font-bold hover:bg-black transition-colors"
          >
            Administrar
          </Link>
        </div>

        {role === 'master' && (
          <div className="bg-white p-6 rounded-lg border-2 border-dark/10 flex flex-col items-center text-center">
            <div className="bg-red-accent/10 p-4 rounded-full mb-4">
              <Users size={40} className="text-red-accent" />
            </div>
            <h2 className="text-xl font-heading font-bold mb-2">Usuarios</h2>
            <p className="text-dark/70 font-body mb-4">Control exclusivo de cuentas y roles</p>
            <Link 
              href="/admin/master-only/users"
              className="mt-auto bg-red-accent text-white px-6 py-2 rounded font-bold hover:bg-red-600 transition-colors"
            >
              Control Maestro
            </Link>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg border-2 border-dark/10 flex flex-col items-center text-center">
          <div className="bg-dark/5 p-4 rounded-full mb-4">
            <Activity size={40} className="text-dark/50" />
          </div>
          <h2 className="text-xl font-heading font-bold mb-2 text-dark/50">Métricas</h2>
          <p className="text-dark/40 font-body mb-4">Próximamente Analytics y reportes</p>
          <button 
            disabled
            className="mt-auto bg-dark/10 text-dark/40 px-6 py-2 rounded font-bold cursor-not-allowed"
          >
            No disponible
          </button>
        </div>
      </div>
    </div>
  );
}
