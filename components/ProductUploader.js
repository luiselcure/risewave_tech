'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema } from '@/lib/validations/productSchema';
import { UploadCloud, CheckCircle, XCircle, Calculator } from 'lucide-react';
import CostCalculator from '@/components/CostCalculator';
import { useEffect } from 'react';

export default function ProductUploader({ onSuccess, initialData }) {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData?.image?.url || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success' | 'error' | null
  const [userRole, setUserRole] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const storeStr = localStorage.getItem('auth-storage');
    if (storeStr) {
      const { state } = JSON.parse(storeStr);
      if (state?.user?.role) {
        setUserRole(state.user.role);
        console.log('Detected User Role:', state.user.role);
      }
    }
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: initialData ? {
      titulo: initialData.titulo,
      categoria: initialData.categoria,
      precio: initialData.precio,
      stock: initialData.stock,
      descripcion: initialData.descripcion
    } : {
      precio: 0,
      stock: 0,
    }
  });

  // Effect to reset form when initialData changes (e.g., when switching between edit and create)
  useEffect(() => {
    if (initialData) {
      reset({
        titulo: initialData.titulo,
        categoria: initialData.categoria,
        precio: initialData.precio,
        stock: initialData.stock,
        descripcion: initialData.descripcion
      });
      setImagePreview(initialData.image?.url || null);
    } else {
      reset({ titulo: '', categoria: '', precio: 0, stock: 0, descripcion: '' });
      setImagePreview(null);
    }
  }, [initialData, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setIsUploading(true);
    setUploadStatus(null);
    try {
      let cloudinaryData = null;

      // 1. Upload logic to Cloudinary if image exists
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);

        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) throw new Error('Error al subir imagen');
        const uploadResult = await uploadRes.json();
        cloudinaryData = uploadResult.image;
      }

      // 2. Prepare payload for DB
      const payload = {
        ...data,
        image: cloudinaryData || { public_id: '', url: 'https://via.placeholder.com/300' } // Fallback if no image
      };

      // 3. Save or Update Product
      const endpoint = initialData ? `/api/admin/products/${initialData._id}` : '/api/products';
      const method = initialData ? 'PUT' : 'POST';

      const dbRes = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!dbRes.ok) throw new Error('Error al guardar producto en BD');

      setUploadStatus('success');
      if (!initialData) {
        reset();
        setImageFile(null);
        setImagePreview(null);
      }
      if (onSuccess) onSuccess();

    } catch (error) {
      console.error(error);
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border-2 border-dark/10">
      <h2 className="text-xl font-heading font-bold text-dark mb-6">
        {initialData ? 'Editar Producto' : 'Añadir Nuevo Producto (Upload a Cloudinary)'}
      </h2>
      
      {uploadStatus === 'success' && (
        <div className="mb-4 p-4 bg-teal/10 text-teal rounded flex items-center">
          <CheckCircle className="mr-2" size={20} />
          Producto {initialData ? 'actualizado' : 'creado y assets cargados'} exitosamente.
        </div>
      )}

      {uploadStatus === 'error' && (
        <div className="mb-4 p-4 bg-red-accent/10 text-red-accent rounded flex items-center">
          <XCircle className="mr-2" size={20} />
          Hubo un error al procesar el producto. Revisa consola.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1">Título</label>
            <input 
              {...register('titulo')} 
              className="w-full p-2 border-2 rounded focus:border-teal outline-none"
            />
            {errors.titulo && <span className="text-red-500 text-sm">{errors.titulo.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Categoría</label>
            <select 
              {...register('categoria')}
              className="w-full p-2 border-2 rounded focus:border-teal outline-none"
            >
              <option value="">Seleccionar...</option>
              <option value="Artículos de Oficina">Oficina</option>
              <option value="Gadgets Gaming">Gaming</option>
              <option value="Mejoras para el Hogar">Hogar</option>
            </select>
            {errors.categoria && <span className="text-red-500 text-sm">{errors.categoria.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Precio (ARS)</label>
            <input 
              type="number" 
              {...register('precio', { valueAsNumber: true })} 
              className="w-full p-2 border-2 rounded focus:border-teal outline-none"
            />
            {errors.precio && <span className="text-red-500 text-sm">{errors.precio.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Stock</label>
            <input 
              type="number" 
              {...register('stock', { valueAsNumber: true })} 
              className="w-full p-2 border-2 rounded focus:border-teal outline-none"
            />
            {errors.stock && <span className="text-red-500 text-sm">{errors.stock.message}</span>}
          </div>
        </div>

        {/* 3D Printing Cost Engine - Structural Fix */}
        {['admin', 'master'].includes(userRole) && (
          <div className="bg-cream/30 p-4 border-2 border-teal/20 rounded flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-heading font-bold text-teal text-sm">3D Printing Cost Engine</span>
              <span className="text-xs text-dark/60 font-body">Calcula un precio base preciso según tus costos.</span>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="bg-teal text-cream px-4 py-2 rounded font-heading text-sm hover:scale-105 transition-transform flex items-center space-x-2 shadow-sm"
            >
              <Calculator size={16} />
              <span>Calcular precio</span>
            </button>
          </div>
        )}

        <div>
          <label className="block text-sm font-bold mb-1">Descripción</label>
          <textarea 
            {...register('descripcion')} 
            rows={3}
            className="w-full p-2 border-2 rounded focus:border-teal outline-none"
          />
          {errors.descripcion && <span className="text-red-500 text-sm">{errors.descripcion.message}</span>}
        </div>

        {/* 3D Printing Cost Engine - Modal Version */}
        <CostCalculator 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          setValue={setValue} 
          role={userRole} 
        />

        <div className="border-2 border-dashed border-dark/20 p-6 rounded-lg text-center items-center justify-center flex flex-col hover:border-teal transition-colors">
          {imagePreview ? (
            <div className="relative">
              <img src={imagePreview} alt="Preview" className="h-48 object-contain mb-4 rounded" />
              <button 
                type="button" 
                onClick={() => { setImageFile(null); setImagePreview(null); }}
                className="absolute top-0 right-0 bg-red-accent text-white rounded-full p-1 translate-x-1/2 -translate-y-1/2"
              >
                <XCircle size={20} />
              </button>
            </div>
          ) : (
            <>
              <UploadCloud size={48} className="text-dark/40 mb-2" />
              <p className="text-sm text-dark/60 mb-4">Sube la imagen del producto (Cloudinary)</p>
            </>
          )}
          
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageChange}
            className={`text-sm ${imagePreview ? 'hidden' : ''}`}
            id="file-upload"
          />
        </div>

        <button 
          type="submit" 
          disabled={isUploading}
          className="w-full bg-teal text-white font-bold py-3 rounded hover:bg-teal-light transition-colors disabled:opacity-50 flex items-center justify-center"
        >
          {isUploading ? 'Procesando & Subiendo...' : (initialData ? 'Actualizar Producto' : 'Crear Producto')}
        </button>

      </form>
    </div>
  );
}
