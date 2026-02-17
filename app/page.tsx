import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-cream">
      {/* Hero Section - Cyber-Japandi */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden">
        {/* Background Pattern - Seigaiha waves */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M25 50 Q 25 37.5 37.5 37.5 T 50 50' stroke='%231A1F24' fill='none' stroke-width='2'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div>
              <h1 className="text-5xl md:text-6xl font-heading font-bold text-dark mb-6">
                Optimizá tu espacio con un{' '}
                <span className="text-red-accent">toque 3D</span>
              </h1>
              <p className="text-xl font-body text-dark/80 mb-8">
                Impresión 3D de precisión. Prototipado maker y gadgets para gaming.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-heading font-bold text-red-accent">48h</div>
                  <div className="text-sm font-body text-dark/70">ENTREGA</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-heading font-bold text-teal">+20</div>
                  <div className="text-sm font-body text-dark/70">GADGETS PARA ELEGIR</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-heading font-bold text-dark">100%</div>
                  <div className="text-sm font-body text-dark/70">PROYECTOS PERSONALIZABLES</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/catalog"
                  className="px-8 py-4 bg-dark text-cream font-body font-bold rounded hover:bg-teal transition-colors"
                >
                  Catálogo de gadgets
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-red-accent text-cream font-body font-bold rounded hover:bg-red-accent/90 transition-colors"
                >
                  Desbloqueá tu personalizado
                </Link>
              </div>
            </div>

            {/* Right: Great Wave Illustration */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-teal/30 via-red-accent/20 to-dark/30 rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4">🌊</div>
                  <p className="text-2xl font-heading font-bold text-dark">
                    The Great Wave
                  </p>
                  <p className="text-sm font-body text-dark/70">
                    Inspired by Kanagawa
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-16 bg-dark/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-heading font-bold text-cream text-center mb-4">
            Arsenal
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
