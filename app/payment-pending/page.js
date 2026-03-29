'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, Home, ShoppingBag } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

function PaymentPendingContent() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  const paymentId = searchParams?.get('payment_id');
  const externalReference = searchParams?.get('external_reference');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-[80vh] bg-cream flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[url('/bg-pattern.svg')] bg-repeat">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border-2 border-dark/10 relative">
         {/* Cyber-Japandi Accents */}
         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-dark to-teal"></div>
         
         <div className="p-8 text-center sm:p-12">
            {/* Pending Icon */}
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-yellow-400/10 mb-6 border-2 border-yellow-400/20 shadow-[0_0_15px_rgba(250,204,21,0.3)]">
              <Clock className="h-12 w-12 text-yellow-500" aria-hidden="true" />
            </div>

           <h1 className="text-3xl font-heading font-extrabold text-dark tracking-tight mb-2">
             Pago Pendiente
           </h1>
           <p className="text-lg text-dark/70 font-body mb-6">
             Tu pago está siendo procesado. Te notificaremos cuando se confirme.
           </p>

           {/* Details box */}
           <div className="bg-yellow-50/50 rounded-lg p-4 mb-8 text-left border border-yellow-400/20">
              <h3 className="font-heading font-bold text-dark text-sm uppercase tracking-wider mb-2">Detalles de Referencia</h3>
              <div className="space-y-1 font-body text-sm text-dark/80">
                 {paymentId && (
                   <p className="flex justify-between">
                     <span className="opacity-70">N° de Operación:</span>
                     <span className="font-mono font-bold">{paymentId}</span>
                   </p>
                 )}
                 <p className="flex justify-between">
                     <span className="opacity-70">Estado:</span>
                     <span className="font-bold text-yellow-600">Pendiente</span>
                 </p>
              </div>
           </div>

           {/* Actions */}
           <div className="space-y-4 font-body">
             <Link
               href="/catalog"
               className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-bold text-cream bg-red-accent hover:bg-red-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-accent transition-colors duration-200"
             >
               <ShoppingBag className="mr-2 -ml-1 h-5 w-5" aria-hidden="true" />
               Seguir Comprando
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

export default function PaymentPendingPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center">Cargando estado del pago...</div>}>
      <PaymentPendingContent />
    </Suspense>
  );
}
