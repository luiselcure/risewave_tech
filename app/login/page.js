'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useStore from '@/lib/store';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // We pass null for token since it's now securely stored in an HttpOnly cookie
        setUser(data.user, null);
        router.push('/dashboard');
      } else {
        setError(data.message || 'Error al iniciar sesión.');
      }
    } catch (error) {
      setError('Error al iniciar sesión. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border-2 border-dark/10 rounded-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal/10 rounded-full mb-4">
              <LogIn size={32} className="text-teal" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-dark mb-2">
              Iniciar Sesión
            </h1>
            <p className="text-dark/70 font-body">
              Accede a tu cuenta de RiseWave Tech
            </p>
          </div>

          {error && (
            <div className="bg-red-accent/10 border border-red-accent text-red-accent p-3 rounded mb-6 font-body text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-body font-medium text-dark mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-dark/20 rounded focus:border-teal focus:outline-none font-body"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-body font-medium text-dark mb-1">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-dark/20 rounded focus:border-teal focus:outline-none font-body"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-accent text-cream py-3 px-6 rounded font-body font-bold hover:bg-red-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>

            <p className="text-center text-dark/70 font-body text-sm">
              ¿No tienes cuenta?{' '}
              <Link href="/register" className="text-teal font-bold hover:text-teal-light">
                Regístrate aquí
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
