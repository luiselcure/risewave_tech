import { z } from 'zod';

export const productSchema = z.object({
  titulo: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  precio: z.number().positive('El precio debe ser mayor a 0'),
  stock: z.number().int().nonnegative('El stock no puede ser negativo'),
  categoria: z.enum(['Artículos de Oficina', 'Gadgets Gaming', 'Mejoras para el Hogar'], {
    errorMap: () => ({ message: 'Categoría inválida' }),
  }),
  estado: z.enum(['Activo', 'Pausado', 'Sin Stock']).optional(),
  visible: z.boolean().optional(),
  colores: z.array(z.string()).max(4, 'Puedes elegir máximo 4 colores').optional(),
  // For the frontend form, image might be a File object.
  // We'll validate the basic presence, but actual upload handling happens in API/Cloudinary.
  image: z.any().optional(), 
});
