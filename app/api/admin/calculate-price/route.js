import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Settings from '@/models/Settings';
import { verifyRole } from '@/lib/auth';

/**
 * POST /api/admin/calculate-price
 * Receives { weight, hours } and calculates the suggested price based on Master settings.
 */
export const POST = verifyRole(['master'], async (req) => {
  await dbConnect();
  
  try {
    const { weight, hours } = await req.json();
    
    if (weight === undefined || hours === undefined) {
      return NextResponse.json({ message: 'Peso y horas son requeridos' }, { status: 400 });
    }

    const settings = await Settings.findOne({ key: 'default' });
    
    if (!settings) {
      return NextResponse.json({ 
        message: 'Configuración de costos no encontrada. Por favor inicializa los valores en el panel Master.' 
      }, { status: 404 });
    }

    const {
      spoolPrice,
      spoolWeight,
      energyCost,
      printerWattage,
      laborRate,
      amortizationPerHour,
      errorMargin,
      profitMargin
    } = settings;

    // 1. Costo de Material (por gramo)
    const precioGramo = spoolPrice / spoolWeight;
    const costoMaterial = weight * precioGramo;

    // 2. Costo de Energía (kWh * horas * precio)
    const costoEnergia = (printerWattage / 1000) * hours * energyCost;

    // 3. Costo Laboral y Amortización
    const costoLaboral = hours * laborRate;
    const costoAmortizacion = hours * amortizationPerHour;

    // 4. Subtotal (Costo Fijo Total)
    const costoFijoTotal = costoMaterial + costoEnergia + costoLaboral + costoAmortizacion;

    // 5. Aplicar Margen de Error y Ganancia
    const conMargenError = costoFijoTotal * (1 + (errorMargin / 100));
    const finalPrice = conMargenError * (1 + (profitMargin / 100));

    return NextResponse.json({
      breakdown: {
        precioGramo: Number(precioGramo.toFixed(2)),
        costoMaterial: Number(costoMaterial.toFixed(2)),
        costoEnergia: Number(costoEnergia.toFixed(2)),
        costoLaboral: Number(costoLaboral.toFixed(2)),
        costoAmortizacion: Number(costoAmortizacion.toFixed(2)),
        costoFijoTotal: Number(costoFijoTotal.toFixed(2)),
        conMargenError: Number(conMargenError.toFixed(2)),
      },
      finalPrice: Math.round(finalPrice)
    });

  } catch (error) {
    console.error('Error calculating price:', error);
    return NextResponse.json({ message: 'Error interno en el cálculo' }, { status: 500 });
  }
});
