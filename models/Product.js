import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, "Por favor ingresa el título del producto"],
    trim: true,
  },
  descripcion: {
    type: String,
    required: [true, "Por favor ingresa la descripción del producto"],
  },
  precio: {
    type: Number,
    required: [true, "Por favor ingresa el precio"],
    min: [0, "El precio no puede ser negativo"],
  },
  image: {
    public_id: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: [true, "Por favor ingresa la URL de la imagen"],
    },
  },
  categoria: {
    type: String,
    required: [true, "Por favor selecciona una categoría"],
    enum: {
      values: [
        "Artículos de Oficina",
        "Gadgets Gaming",
        "Mejoras para el Hogar",
      ],
      message: "Categoría no válida",
    },
  },
  stock: {
    type: Number,
    required: [true, "Por favor ingresa el stock disponible"],
    min: [0, "El stock debe ser mayor o igual a 0"],
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
