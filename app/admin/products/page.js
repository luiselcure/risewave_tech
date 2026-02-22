'use client';

import ProductUploader from '@/components/ProductUploader';
import { Package } from 'lucide-react';

export default function AdminProductsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-3 mb-8 pb-4 border-b-2 border-dark/10">
        <Package size={32} className="text-teal" />
        <h1 className="text-3xl font-heading font-bold text-dark">
          Product Manager
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Upload Component */}
        <section>
          <ProductUploader onSuccess={() => {
            // Optional: trigger a refresh of a product list component if we add one below
            console.log('Product created successfully');
            // We could show a toast or refresh data here.
          }} />
        </section>

        {/* Info Box */}
        <section className="bg-white p-6 rounded-lg border-2 border-dark/10">
          <h3 className="font-heading font-bold text-dark mb-2">Instrucciones</h3>
          <ul className="list-disc pl-5 text-sm font-body text-dark/70 space-y-1">
            <li>Las imágenes son obligatorias y se subirán a Cloudinary antes de guardar el producto.</li>
            <li>Si ocurre un error en la subida a la nube, el producto no se guardará en la base de datos.</li>
            <li>Formatos permitidos: JPG, PNG, WEBP.</li>
            <li>Tamaño máximo de imagen recomendado: 2MB.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
