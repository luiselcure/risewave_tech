import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Settings from '@/models/Settings';
import { verifyRole } from '@/lib/auth';

/**
 * GET /api/admin/settings
 * Returns the default cost settings (Master Only)
 */
export const GET = verifyRole(['admin', 'master'], async (req) => {
  await dbConnect();
  
  try {
    let settings = await Settings.findOne({ key: 'default' });
    
    // Default values if none exist yet
    if (!settings) {
      settings = {
        spoolPrice: 0,
        spoolWeight: 1000,
        energyCost: 0,
        printerWattage: 0,
        laborRate: 0,
        amortizationPerHour: 0,
        errorMargin: 0,
        profitMargin: 0
      };
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ message: 'Error al obtener configuración' }, { status: 500 });
  }
});

/**
 * POST /api/admin/settings
 * Upserts the default cost settings (Master Only)
 */
export const POST = verifyRole(['admin', 'master'], async (req) => {
  await dbConnect();
  
  try {
    const body = await req.json();
    
    const settings = await Settings.findOneAndUpdate(
      { key: 'default' },
      { ...body, updatedAt: Date.now() },
      { new: true, upsert: true, runValidators: true }
    );
    
    return NextResponse.json({
      message: 'Configuración guardada exitosamente',
      settings
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ 
      message: 'Error al guardar configuración',
      error: error.message 
    }, { status: 500 });
  }
});
