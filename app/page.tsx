import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="bg-cream">
      {/* Hero Section - Cyber-Japandi */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden bg-cream">
        
        {/* Right: Great Wave Illustration (Absolute Background) */}
        <div className="absolute right-0 bottom-0 top-0 w-full md:w-3/5 opacity-40 md:opacity-100 flex justify-end items-end pointer-events-none">
          <div className="w-full h-full relative">
            {/* Gradient fade to seamlessly blend the image with the cream background on the left */}
            <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/50 to-transparent z-10 hidden md:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-cream via-transparent to-transparent z-10 md:hidden" />
            <Image 
              src="/great_wave.png" 
              alt="The Great Wave illustration" 
              fill
              className="object-cover md:object-contain object-right-bottom drop-shadow-2xl mix-blend-multiply"
              priority
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-20 w-full">
          <div className="max-w-xl lg:max-w-2xl">
            {/* Title */}
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-dark mb-6 leading-tight">
              Optimizá tu espacio con un{' '}
              <span className="text-teal">toque 3D</span>
            </h1>
            
            {/* Description */}
            <p className="text-lg md:text-xl font-body font-bold text-dark/80 mb-8 uppercase tracking-wide">
              Impresión 3D de precisión,<br className="hidden sm:block" />prototipado maker y gadgets para gaming.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Link
                href="/catalog"
                className="px-6 py-3 bg-dark text-cream font-body font-bold rounded-md hover:bg-dark/90 transition-colors shadow-lg leading-tight"
              >
                Catálogo de<br />gadgets
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 bg-red-accent text-white font-body font-bold rounded-md hover:bg-red-600 transition-colors shadow-lg leading-tight"
              >
                Desbloqueá tu<br />personalizado
              </Link>
            </div>

            {/* Divider Line */}
            <div className="w-full h-[2px] bg-dark/70 mb-8"></div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-4xl md:text-5xl font-heading font-bold text-red-accent mb-1 tracking-tight">48h</div>
                <div className="text-xs font-body font-bold text-dark/80 uppercase">ENTREGA</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-heading font-bold text-dark mb-1 tracking-tight">+20</div>
                <div className="text-xs font-body font-bold text-dark/80 uppercase">GADGETS PARA<br/>ELEGIR</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-heading font-bold text-red-accent mb-1 tracking-tight">100%</div>
                <div className="text-xs font-body font-bold text-dark/80 uppercase">PROYECTOS<br/>PERSONALIZABLES</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-16 bg-dark/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-heading font-bold text-cream text-center mb-4">
            Nuestro Catálogo
          </h2>
          <p className="text-lg font-body text-cream/80 text-center mb-12">
            Categorías principales
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Office */}
            <div className="bg-cream/10 backdrop-blur p-8 rounded-lg border-2 border-cream/20 hover:border-teal transition-all">
              <h3 className="text-2xl font-heading font-bold text-red-accent mb-3">
                Artículos de Oficina
              </h3>
              <p className="text-cream/80 font-body mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed diam.
              </p>
              <Link
                href="/catalog?category=Artículos de Oficina"
                className="text-teal font-body font-bold hover:text-teal-light transition-colors"
              >
                Ver más →
              </Link>
            </div>

            {/* Gaming */}
            <div className="bg-cream/10 backdrop-blur p-8 rounded-lg border-2 border-cream/20 hover:border-teal transition-all">
              <h3 className="text-2xl font-heading font-bold text-red-accent mb-3">
                Gadgets Gaming
              </h3>
              <p className="text-cream/80 font-body mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed diam.
              </p>
              <Link
                href="/catalog?category=Gadgets Gaming"
                className="text-teal font-body font-bold hover:text-teal-light transition-colors"
              >
                Ver más →
              </Link>
            </div>

            {/* Home */}
            <div className="bg-cream/10 backdrop-blur p-8 rounded-lg border-2 border-cream/20 hover:border-teal transition-all">
              <h3 className="text-2xl font-heading font-bold text-red-accent mb-3">
                Mejoras para el Hogar
              </h3>
              <p className="text-cream/80 font-body mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed diam.
              </p>
              <Link
                href="/catalog?category=Mejoras para el Hogar"
                className="text-teal font-body font-bold hover:text-teal-light transition-colors"
              >
                Ver más →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
