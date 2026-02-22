import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="inline-block p-4 bg-red-accent/10 rounded-full animate-pulse">
          <AlertTriangle size={64} className="text-red-accent" />
        </div>
        
        <h1 className="text-5xl font-heading font-bold text-dark tracking-tighter">
          404 - Sistema No Encontrado
        </h1>
        
        <p className="text-lg font-body text-dark/70 max-w-md mx-auto">
          Parece que te has desviado del camino. La página que buscas no existe en nuestra red.
        </p>

        <div className="pt-8">
          <Link 
            href="/"
            className="inline-block bg-teal text-white font-heading font-bold px-8 py-3 rounded-md hover:bg-teal-light transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-teal/20"
          >
            Volver a la Base (Inicio)
          </Link>
        </div>
      </div>
    </div>
  );
}
