import { Link } from "react-router-dom";
import { FiArrowRight, FiZap, FiShoppingBag } from "react-icons/fi";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="py-20 sm:py-28 lg:py-32">
          
          {/* Badge */}
          <div className="flex justify-center mb-6 fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <FiZap className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-medium">Ofertas exclusivas este mes</span>
            </div>
          </div>

          {/* Main content */}
          <div className="text-center max-w-4xl mx-auto fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Descubre la{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                Tecnología
              </span>{" "}
              del Futuro
            </h1>
            
            <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Los mejores productos tecnológicos al mejor precio. 
              Innovación, calidad y servicio excepcional en cada compra 💻⚡
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/products"
                className="group btn-primary flex items-center gap-2 px-8 py-4 text-lg shadow-xl hover:shadow-2xl"
              >
                <FiShoppingBag className="w-5 h-5" />
                <span>Explorar Productos</span>
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <a
                href="#productos"
                className="btn-secondary bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 px-8 py-4 text-lg"
              >
                Ver Destacados
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold mb-1">500+</div>
                <div className="text-sm sm:text-base text-blue-200">Productos</div>
              </div>
              <div className="text-center border-x border-white/20">
                <div className="text-3xl sm:text-4xl font-bold mb-1">10k+</div>
                <div className="text-sm sm:text-base text-blue-200">Clientes Felices</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold mb-1">4.9★</div>
                <div className="text-sm sm:text-base text-blue-200">Valoración</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0 text-white dark:text-gray-900">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="currentColor"/>
        </svg>
      </div>
    </section>
  );
}