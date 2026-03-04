'use client';

import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import useStore from '@/lib/store';
import { useState } from 'react';

export default function ProductCard({ product }) {
  const { addToCart, isAuthenticated } = useStore();
  const [selectedColor, setSelectedColor] = useState(null);
  const [showColorWarning, setShowColorWarning] = useState(false);

  const hasColors = product.colores && product.colores.length > 0;

  const handleAddToCart = () => {
    if (hasColors && !selectedColor) {
      setShowColorWarning(true);
      setTimeout(() => setShowColorWarning(false), 2500);
      return;
    }

    addToCart({
      id: product._id,
      titulo: product.titulo,
      precio: product.precio,
      imagenUrl: product.image?.url || '/placeholder.png',
      color: selectedColor, // Adding selected color to payload
    });
    
    // Optional feedback here
  };

  const truncateDescription = (text, maxLength = 80) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white border-2 border-dark/10 rounded-lg overflow-hidden hover:shadow-lg hover:border-teal transition-all duration-300 flex flex-col relative">
      {/* Product Image */}
      <div className="relative h-48 w-full bg-dark/5 flex items-center justify-center">
        {product.image?.url ? (
          <Image
            src={product.image.url}
            alt={product.titulo}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="text-4xl font-heading text-dark/30">3D</div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-heading font-bold text-dark mb-2">
          {product.titulo}
        </h3>
        
        <p className="text-sm text-dark/70 font-body mb-4 flex-1">
          {truncateDescription(product.descripcion)}
        </p>

        {/* Color Selection */}
        {hasColors && (
          <div className="mb-4">
            <span className="text-xs font-bold text-dark/80 block mb-2">Selecciona un color:</span>
            <div className="flex flex-wrap gap-1.5">
              {product.colores.map(color => (
                 <button
                   key={color}
                   onClick={() => {
                     setSelectedColor(color);
                     setShowColorWarning(false);
                   }}
                   className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                     selectedColor === color 
                       ? 'bg-teal/20 border-teal text-teal font-bold' 
                       : 'bg-white border-dark/20 text-dark/70 hover:border-teal/50'
                   }`}
                 >
                   {color}
                 </button>
              ))}
            </div>
            {showColorWarning && (
              <p className="text-red-accent text-xs mt-1 animate-pulse font-medium">Por favor selecciona un color.</p>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-heading font-bold text-red-accent">
            ${product.precio.toLocaleString()}
          </span>
          <span className="text-xs text-dark/50 font-body">
            Stock: {product.stock}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full bg-dark text-cream py-2 px-4 rounded font-body font-medium hover:bg-teal transition-colors disabled:bg-dark/30 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <ShoppingCart size={18} />
          <span>{product.stock > 0 ? 'Añadir al Carrito' : 'Sin Stock'}</span>
        </button>
      </div>
    </div>
  );
}
