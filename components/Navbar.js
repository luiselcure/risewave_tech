'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import useStore from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const { isAuthenticated, user, logout, getCartCount } = useStore();
  const router = useRouter();
  const cartCount = getCartCount();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-cream border-b border-dark/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
            <Image 
              src="/image_3.png" 
              alt="RiseWave Tech Logo" 
              width={600} 
              height={160} 
              className="h-10 w-auto sm:h-12" 
              priority
            />
          </Link>

          {/* Menú Central y Acciones - Desktop (>= 600px) */}
          <div className="hidden min-[600px]:flex items-center space-x-8">
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

            {/* Separador vertical opcional */}
            <div className="h-6 w-px bg-dark/20"></div>

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

          {/* Acciones Rápidas - Mobile (< 600px) */}
          <div className="min-[600px]:hidden flex items-center space-x-4">
            <Link
              href="/cart"
              className="relative text-dark hover:text-red-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-accent text-cream text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-dark hover:text-red-accent transition-colors p-1"
              aria-label="Menú principal"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Desplegable (Dropdown) - Mobile (< 600px) */}
      {isMenuOpen && (
        <div className="min-[600px]:hidden border-t border-dark/10 bg-cream/95 backdrop-blur-sm absolute w-full left-0 shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-4 flex flex-col">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="block text-dark hover:text-red-accent transition-colors font-body font-medium text-lg pt-2"
            >
              Inicio
            </Link>
            <Link
              href="/catalog"
              onClick={() => setIsMenuOpen(false)}
              className="block text-dark hover:text-red-accent transition-colors font-body font-medium text-lg"
            >
              Catálogo
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="block text-dark hover:text-red-accent transition-colors font-body font-medium text-lg pb-2 border-b border-dark/10"
            >
              Contacto
            </Link>

            {/* Auth Mobile Links */}
            {!isAuthenticated ? (
              <div className="flex flex-col space-y-3 pt-2">
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-center px-4 py-3 border-2 border-dark text-dark hover:bg-dark hover:text-cream transition-all font-body font-medium rounded"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-center px-4 py-3 bg-red-accent text-cream hover:bg-red-accent/90 transition-all font-body font-medium rounded"
                >
                  Registrarse
                </Link>
              </div>
            ) : (
              <div className="flex flex-col space-y-4 pt-2">
                <Link
                  href="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 text-dark hover:text-red-accent transition-colors font-body font-medium text-lg"
                >
                  <User size={24} />
                  <span>Panel de Usuario ({user?.nombre})</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 text-red-accent hover:text-red-600 transition-colors font-body font-medium text-lg text-left"
                >
                  <LogOut size={24} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
