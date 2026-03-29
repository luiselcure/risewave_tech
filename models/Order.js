import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Optional if we allow guest checkouts eventually, but currently system requires login
  },
  comprador: {
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    telefono: { type: String, required: true }
  },
  datosEnvio: {
    calle: { type: String, required: true },
    altura: { type: String, required: true },
    ciudad: { type: String, required: true },
    codigoPostal: { type: String, required: true },
    provincia: { type: String, required: false } // Adding as optional since it wasn't required in User model yet
  },
  items: [{
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    titulo: { type: String, required: true },
    precio: { type: Number, required: true },
    cantidad: { type: Number, required: true },
    color: { type: String, required: false } // Important for variants
  }],
  total: {
    type: Number,
    required: true
  },
  estado_pago: {
    type: String,
    enum: ['Pendiente', 'Pagado', 'Rechazado'],
    default: 'Pendiente'
  },
  estado_envio: {
    type: String,
    enum: ['Preparando', 'Enviado', 'Entregado', 'Cancelado'],
    default: 'Preparando'
  },
  mp_preference_id: {
    type: String,
    required: false
  },
  mp_payment_id: {
    type: String,
    required: false
  }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
