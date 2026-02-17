'use client';

import Link from 'next/link';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import useStore from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { isAuthenticated, user, logout, getCartCount } = useStore();
  const router = useRouter();
  const cartCount = getCartCount();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="bg-cream border-b border-dark/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-heading font-bold text-dark">
              RISE<span className="text-red-accent">WAVE</span>
            </span>
          </Link>

          {/* Menu Central */}
          <div className="hidden md:flex space-x-8">
            <Link
              href="/"
              className="text-dark hover:text-red-accent transition-colors font-body font-medium"
            >
              Inicio
            </Link>
            <Link
              href="/catalog"
              className="text-dark hover:text-red-accent transition-colors font-body font-medium"
            >
              Catálogo
            </Link>
            <Link
              href="/contact"
              className="text-dark hover:text-red-accent transition-colors font-body font-medium"
            >
              Contacto
            </Link>
          </div>

          {/* User & Cart Area */}
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 border-2 border-dark text-dark hover:bg-dark hover:text-cream transition-all font-body font-medium rounded"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-red-accent text-cream hover:bg-red-accent/90 transition-all font-body font-medium rounded"
                >
                  Registrarse
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 text-dark hover:text-red-accent transition-colors"
                >
                  <User size={20} />
                  <span className="hidden md:inline font-body">
                    Hola, {user?.nombre}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-dark hover:text-red-accent transition-colors"
                  title="Cerrar Sesión"
                >
                  <LogOut size={20} />
                </button>
              </>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="relative text-dark hover:text-red-accent transition-colors"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-accent text-cream text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
