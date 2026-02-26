import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
  key: {
    type: String,
    default: "default",
    unique: true,
  },
  spoolPrice: {
    type: Number,
    required: [true, "Por favor ingresa el precio de la bobina"],
    min: 0,
  },
  spoolWeight: {
    type: Number,
    required: [true, "Por favor ingresa el peso de la bobina (g)"],
    min: 1,
  },
  energyCost: {
    type: Number,
    required: [true, "Por favor ingresa el costo de energía (ARS/kWh)"],
    min: 0,
  },
  printerWattage: {
    type: Number,
    required: [true, "Por favor ingresa el consumo de la impresora (W)"],
    min: 0,
  },
  laborRate: {
    type: Number,
    required: [true, "Por favor ingresa el costo de mano de obra (ARS/h)"],
    min: 0,
  },
  amortizationPerHour: {
    type: Number,
    required: [true, "Por favor ingresa la amortización por hora (ARS/h)"],
    min: 0,
  },
  errorMargin: {
    type: Number,
    required: [true, "Por favor ingresa el margen de error (%)"],
    min: 0,
    max: 100,
  },
  profitMargin: {
    type: Number,
    required: [true, "Por favor ingresa el margen de ganancia (%)"],
    min: 0,
    max: 1000,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Settings ||
  mongoose.model("Settings", SettingsSchema);
