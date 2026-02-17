import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'Por favor ingresa tu nombre'],
    trim: true,
  },
  apellido: {
    type: String,
    required: [true, 'Por favor ingresa tu apellido'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Por favor ingresa tu email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor ingresa un email válido'],
  },
  telefono: {
    type: String,
    required: [true, 'Por favor ingresa tu teléfono'],
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Por favor ingresa una contraseña'],
    minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
    select: false, // Don't return password by default
  },
  direccion: {
    calle: {
      type: String,
      required: [true, 'Por favor ingresa tu calle'],
    },
    altura: {
      type: String,
      required: [true, 'Por favor ingresa la altura'],
    },
    ciudad: {
      type: String,
      required: [true, 'Por favor ingresa tu ciudad'],
    },
    codigoPostal: {
      type: String,
      required: [true, 'Por favor ingresa tu código postal'],
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
