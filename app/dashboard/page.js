'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '@/lib/store';
import { User, MapPin, Phone, Mail } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border-2 border-dark/10 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal to-teal-light text-cream p-8">
            <div className="flex items-center space-x-4">
              <div className="bg-cream/20 p-4 rounded-full relative">
                <User size={48} className="text-cream" />
                {user.role && user.role !== 'user' && (
                  <span className="absolute -top-2 -right-2 bg-red-accent text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                    {user.role}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-heading font-bold">
                  {user.nombre} {user.apellido}
                </h1>
                <p className="text-cream/90 font-body">Panel de Usuario</p>
              </div>
              {user.role && ['admin', 'master'].includes(user.role) && (
                <div>
                  <button 
                    onClick={() => router.push('/admin')}
                    className="bg-red-accent hover:bg-red-600 text-white px-4 py-2 rounded font-bold font-body transition-colors text-sm"
                  >
                    Ir al Admin Panel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="p-8">
            <h2 className="text-2xl font-heading font-bold text-dark mb-6">
              Información Personal
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="flex items-start space-x-3">
                <div className="bg-teal/10 p-2 rounded">
                  <Mail size={20} className="text-teal" />
                </div>
                <div>
                  <p className="text-sm text-dark/60 font-body">Email</p>
                  <p className="font-body font-medium text-dark">{user.email}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-3">
                <div className="bg-teal/10 p-2 rounded">
                  <Phone size={20} className="text-teal" />
                </div>
                <div>
                  <p className="text-sm text-dark/60 font-body">Teléfono</p>
                  <p className="font-body font-medium text-dark">{user.telefono}</p>
                </div>
              </div>

              {/* Address */}
              <div className="md:col-span-2 flex items-start space-x-3">
                <div className="bg-teal/10 p-2 rounded">
                  <MapPin size={20} className="text-teal" />
                </div>
                <div>
                  <p className="text-sm text-dark/60 font-body">Dirección de Envío</p>
                  <p className="font-body font-medium text-dark">
                    {user.direccion?.calle} {user.direccion?.altura}
                    <br />
                    {user.direccion?.ciudad}, CP {user.direccion?.codigoPostal}
                  </p>
                </div>
              </div>
            </div>

            {/* Future Features Placeholder */}
            <div className="mt-8 p-6 bg-dark/5 rounded-lg border-2 border-dashed border-dark/20">
              <h3 className="text-lg font-heading font-bold text-dark mb-2">
                Próximamente
              </h3>
              <ul className="space-y-2 font-body text-dark/70">
                <li>• Historial de Compras</li>
                <li>• Pedidos en Curso</li>
                <li>• Proyectos Personalizados</li>
                <li>• Favoritos Guardados</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
