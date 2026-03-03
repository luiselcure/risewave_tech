'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import useStore from '@/lib/store';
import { Trash2, Plus, Minus, ShoppingBag, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY, { locale: 'es-AR' });

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart, isAuthenticated, user } = useStore();
  const [preferenceId, setPreferenceId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      setIsProcessing(true);
      const res = await fetch('/api/checkout/mercadopago', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart,
          payer: {
            email: user?.email,
            name: user?.nombre,
            surname: user?.apellido
          }
        }),
      });

      const data = await res.json();

      if (data.preferenceId) {
         setPreferenceId(data.preferenceId);
      } else {
         console.error('Error del servidor:', data.message);
         alert('Hubo un problema procesando el pago. Verifica la consola.');
      }
    } catch (error) {
       console.error('Error al iniciar Checkout:', error);
       alert('Hubo un error de red al intentar procesar el pago.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-dark/5 rounded-full mb-6">
            <ShoppingBag size={48} className="text-dark/30" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-dark mb-4">
            Tu carrito está vacío
          </h1>
          <p className="text-dark/70 font-body mb-8">
            Explora nuestro catálogo y añade productos increíbles
          </p>
          <Link
            href="/catalog"
            className="inline-block px-8 py-3 bg-red-accent text-cream font-body font-bold rounded hover:bg-red-accent/90 transition-colors"
          >
            Ver Catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-heading font-bold text-dark mb-8">
          Carrito de Compras
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white border-2 border-dark/10 rounded-lg p-4 flex items-center space-x-4"
              >
                {/* Product Image Placeholder */}
                <div className="w-20 h-20 bg-gradient-to-br from-teal/20 to-red-accent/20 rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-heading text-dark/30">3D</span>
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <h3 className="font-heading font-bold text-dark">{item.titulo}</h3>
                  <p className="text-red-accent font-body font-bold">
                    ${item.precio.toLocaleString()}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 bg-dark/10 rounded hover:bg-dark/20 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-body font-bold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 bg-dark/10 rounded hover:bg-dark/20 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-red-accent hover:bg-red-accent/10 rounded transition-colors"
                  title="Eliminar del carrito"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border-2 border-dark/10 rounded-lg p-6 sticky top-20">
              <h2 className="text-xl font-heading font-bold text-dark mb-4">
                Resumen del Pedido
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between font-body">
                  <span className="text-dark/70">Subtotal</span>
                  <span className="font-bold text-dark">${getCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-body">
                  <span className="text-dark/70">Envío</span>
                  <span className="font-bold text-teal">GRATIS</span>
                </div>
                <div className="border-t-2 border-dark/10 pt-3 flex justify-between">
                  <span className="font-heading font-bold text-dark">Total</span>
                  <span className="font-heading font-bold text-red-accent text-xl">
                    ${getCartTotal().toLocaleString()}
                  </span>
                </div>
              </div>

              {!preferenceId ? (
                <button
                  onClick={handleCheckout}
                  disabled={cart.length === 0 || isProcessing}
                  className="w-full bg-red-accent text-cream py-3 px-6 rounded font-body font-bold hover:bg-red-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mb-3"
                >
                  <CreditCard size={20} />
                  <span>{isProcessing ? 'Procesando...' : 'Proceder al Pago'}</span>
                </button>
              ) : (
                <div className="w-full mt-4">
                  <Wallet initialization={{ preferenceId: preferenceId }} customization={{ texts: { valueProp: 'smart_option' } }} />
                </div>
              )}

              <button
                onClick={clearCart}
                className="w-full border-2 border-dark/20 text-dark py-2 px-4 rounded font-body hover:bg-dark/5 transition-colors"
              >
                Vaciar Carrito
              </button>

              {!isAuthenticated && (
                <p className="text-xs text-center text-dark/60 font-body mt-4">
                  Debes iniciar sesión para proceder al pago
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
