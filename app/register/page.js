'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useStore from '@/lib/store';

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useStore();
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    calle: '',
    altura: '',
    ciudad: '',
    codigoPostal: '',
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
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          direccion: {
            calle: formData.calle,
            altura: formData.altura,
            ciudad: formData.ciudad,
            codigoPostal: formData.codigoPostal,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Auto-login after registration
        const loginResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const loginData = await loginResponse.json();

        if (loginResponse.ok) {
          setUser(loginData.user, null);
          router.push('/dashboard');
        } else {
          // If auto-login fails, redirect to login page
          router.push('/login');
        }
      } else {
        setError(data.message || 'Error de validación en el registro.');
      }
    } catch (error) {
      setError('Error al registrar. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border-2 border-dark/10 rounded-lg p-8">
          <h1 className="text-3xl font-heading font-bold text-dark mb-2">
            Crear Cuenta
          </h1>
          <p className="text-dark/70 font-body mb-6">
            Completa todos los campos para registrarte
          </p>

          {error && (
            <div className="bg-red-accent/10 border border-red-accent text-red-accent p-3 rounded mb-6 font-body">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-body font-medium text-dark mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border-2 border-dark/20 rounded focus:border-teal focus:outline-none font-body"
                />
              </div>
              <div>
                <label className="block text-sm font-body font-medium text-dark mb-1">
                  Apellido *
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border-2 border-dark/20 rounded focus:border-teal focus:outline-none font-body"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-body font-medium text-dark mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border-2 border-dark/20 rounded focus:border-teal focus:outline-none font-body"
                />
              </div>
              <div>
                <label className="block text-sm font-body font-medium text-dark mb-1">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border-2 border-dark/20 rounded focus:border-teal focus:outline-none font-body"
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-body font-medium text-dark mb-1">
                  Contraseña *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border-2 border-dark/20 rounded focus:border-teal focus:outline-none font-body"
                />
                <p className="text-xs text-dark/60 mt-1 font-body">
                  Mínimo 8 caracteres, 1 número y 1 carácter especial
                </p>
              </div>
              <div>
                <label className="block text-sm font-body font-medium text-dark mb-1">
                  Confirmar Contraseña *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border-2 border-dark/20 rounded focus:border-teal focus:outline-none font-body"
                />
              </div>
            </div>

            {/* Address */}
            <div className="border-t-2 border-dark/10 pt-6">
              <h3 className="text-lg font-heading font-bold text-dark mb-4">
                Dirección de Envío
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-body font-medium text-dark mb-1">
                    Calle *
                  </label>
                  <input
                    type="text"
                    name="calle"
                    value={formData.calle}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 border-dark/20 rounded focus:border-teal focus:outline-none font-body"
                  />
                </div>
                <div>
                  <label className="block text-sm font-body font-medium text-dark mb-1">
                    Altura *
                  </label>
                  <input
                    type="text"
                    name="altura"
                    value={formData.altura}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 border-dark/20 rounded focus:border-teal focus:outline-none font-body"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-body font-medium text-dark mb-1">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 border-dark/20 rounded focus:border-teal focus:outline-none font-body"
                  />
                </div>
                <div>
                  <label className="block text-sm font-body font-medium text-dark mb-1">
                    Código Postal *
                  </label>
                  <input
                    type="text"
                    name="codigoPostal"
                    value={formData.codigoPostal}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 border-dark/20 rounded focus:border-teal focus:outline-none font-body"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-accent text-cream py-3 px-6 rounded font-body font-bold hover:bg-red-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>

            <p className="text-center text-dark/70 font-body">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-teal font-bold hover:text-teal-light">
                Iniciar Sesión
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
