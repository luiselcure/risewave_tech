'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { XCircle, ShoppingCart, RefreshCcw, Home } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

function PaymentFailureContent() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  // Safely get search params on client side
  const status = searchParams?.get('status');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-[80vh] bg-cream flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[url('/bg-pattern.svg')] bg-repeat">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border-2 border-dark/10 relative">
         {/* Cyber-Japandi Accents */}
         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-red-accent"></div>
         
         <div className="p-8 text-center sm:p-12">
           {/* Failure Icon */}
           <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-accent/10 mb-6 border-2 border-red-accent/20 shadow-[0_0_15px_rgba(200,60,60,0.3)]">
             <XCircle className="h-12 w-12 text-red-accent" aria-hidden="true" />
           </div>

           <h1 className="text-3xl font-heading font-extrabold text-dark tracking-tight mb-2">
             Pago Rechazado
           </h1>
           <p className="text-lg text-dark/70 font-body mb-6">
             Lo sentimos, no pudimos procesar tu pago. ¡No te preocupes, tus productos siguen en el carrito!
           </p>

           {/* Details box */}
           {status && (
             <div className="bg-red-accent/5 rounded-lg p-4 mb-8 text-left border border-red-accent/20">
                <p className="flex justify-between font-body text-sm text-dark/80">
                    <span className="opacity-70">Motivo del rechazo:</span>
                    <span className="font-bold text-red-accent">
                      {status === 'rejected' ? 'Tarjeta rechazada' : status === 'null' ? 'Intento cancelado' : 'Error en pasarela'}
                    </span>
                </p>
             </div>
           )}

           {/* Actions */}
           <div className="space-y-4 font-body">
             <Link
               href="/cart"
               className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-bold text-cream bg-dark hover:bg-dark/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dark transition-colors duration-200"
             >
               <RefreshCcw className="mr-2 -ml-1 h-5 w-5" aria-hidden="true" />
               Reintentar Pago
             </Link>
             <Link
               href="/"
               className="w-full flex items-center justify-center px-4 py-3 border-2 border-dark/10 rounded-md shadow-sm text-base font-medium text-dark bg-transparent hover:bg-dark/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dark transition-colors duration-200 group"
             >
               <Home className="mr-2 -ml-1 h-5 w-5 text-dark/70 group-hover:text-dark transition-colors" aria-hidden="true" />
               Volver al Inicio
             </Link>
           </div>
         </div>
      </div>
    </div>
  );
}

export default function PaymentFailurePage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center">Cargando estado del pago...</div>}>
      <PaymentFailureContent />
    </Suspense>
  );
}
