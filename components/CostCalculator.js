'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Calculator, AlertCircle, Check } from 'lucide-react';

export default function CostCalculator({ setValue, role }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ weight: '', hours: '' });
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState(null);

  // If role is not master, do not render anything
  if (role !== 'master') return null;

  const handleCalculate = async (e) => {
    e.preventDefault();
    setIsCalculating(true);
    setError(null);
    setResults(null);

    try {
      const res = await fetch('/api/admin/calculate-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weight: parseFloat(formData.weight),
          hours: parseFloat(formData.hours)
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Error al calcular');
      }

      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsCalculating(false);
    }
  };

  const injectPrice = () => {
    if (results && results.finalPrice) {
      // Use react-hook-form's setValue to update the main price field
      setValue('precio', results.finalPrice, { shouldDirty: true, shouldValidate: true });
    }
  };

  return (
    <div className="border-2 border-teal/20 rounded-lg overflow-hidden mb-6 bg-cream/30">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-teal/5 hover:bg-teal/10 transition-colors border-b-2 border-teal/10"
      >
        <div className="flex items-center space-x-2 text-teal">
          <Calculator size={20} />
          <span className="font-heading font-bold uppercase tracking-wider text-sm">3D Printing Cost Engine</span>
        </div>
        {isOpen ? <ChevronUp size={20} className="text-teal" /> : <ChevronDown size={20} className="text-teal" />}
      </button>

      {isOpen && (
        <div className="p-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1 uppercase text-dark/70 font-body">Peso (gramos)</label>
              <input
                type="number"
                step="0.01"
                placeholder="Ej: 150"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full p-2 bg-white border-2 border-teal/20 rounded focus:border-teal outline-none font-body text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 uppercase text-dark/70 font-body">Tiempo (horas)</label>
              <input
                type="number"
                step="0.1"
                placeholder="Ej: 5.5"
                value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                className="w-full p-2 bg-white border-2 border-teal/20 rounded focus:border-teal outline-none font-body text-sm"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleCalculate}
            disabled={isCalculating || !formData.weight || !formData.hours}
            className="w-full py-2 bg-teal text-white font-heading font-bold rounded hover:bg-teal-light transition-all disabled:opacity-50 text-sm shadow-sm"
          >
            {isCalculating ? 'Calculando...' : 'Obtener Sugerencia'}
          </button>

          {error && (
            <div className="p-3 bg-red-accent/10 text-red-accent text-xs rounded flex items-start space-x-2 border border-red-accent/20">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {results && (
            <div className="bg-white/80 border-2 border-teal p-4 rounded-lg space-y-3 animate-in zoom-in-95 duration-200">
              <h4 className="font-heading font-bold text-teal text-center border-b border-teal/10 pb-2 text-sm">DESGLOSE DE COSTOS</h4>
              
              <div className="grid grid-cols-2 gap-y-2 text-xs font-body">
                <span className="text-dark/60">Material (Filamento):</span>
                <span className="text-right font-bold font-heading">ARS {results.breakdown.costoMaterial}</span>
                
                <span className="text-dark/60">Energía Eléctrica:</span>
                <span className="text-right font-bold font-heading">ARS {results.breakdown.costoEnergia}</span>
                
                <span className="text-dark/60">Mano de Obra:</span>
                <span className="text-right font-bold font-heading">ARS {results.breakdown.costoLaboral}</span>
                
                <span className="text-dark/60">Amortización:</span>
                <span className="text-right font-bold font-heading">ARS {results.breakdown.costoAmortizacion}</span>
                
                <div className="col-span-2 border-t border-dashed border-teal/20 my-1"></div>
                
                <span className="text-teal font-bold">TOTAL ESTIMADO:</span>
                <span className="text-right font-bold text-teal font-heading">ARS {results.finalPrice}</span>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={injectPrice}
                  className="w-full py-2 bg-dark text-cream font-heading font-bold rounded hover:bg-teal transition-all flex items-center justify-center space-x-2 text-sm shadow-lg group"
                >
                  <Check size={18} className="group-hover:scale-110 transition-transform" />
                  <span>INYECTAR PRECIO SUGERIDO</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
