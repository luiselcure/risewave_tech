'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Aplicación falló:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-lg">
        <div className="inline-block p-4 bg-red-accent/10 rounded-full">
          <ShieldAlert size={64} className="text-red-accent" />
        </div>
        
        <h1 className="text-4xl font-heading font-bold text-dark tracking-tighter">
          Fallo en la Matriz
        </h1>
        
        <p className="text-lg font-body text-dark/70">
          Un error inesperado ocurrió en nuestros servidores. El equipo técnico ha sido notificado.
        </p>

        <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="bg-dark text-white font-heading font-bold px-8 py-3 rounded-md hover:bg-black transition-colors"
          >
            Intentar de Nuevo
          </button>
          
          <Link 
            href="/"
            className="bg-teal text-white font-heading font-bold px-8 py-3 rounded-md hover:bg-teal-light transition-colors"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
