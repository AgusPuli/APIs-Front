import { FiAward, FiUsers, FiTrendingUp } from "react-icons/fi";

export default function AboutUs() {
  const features = [
    {
      icon: FiAward,
      title: "Calidad Garantizada",
      description: "Productos de las mejores marcas con garantía oficial"
    },
    {
      icon: FiUsers,
      title: "Atención Personalizada",
      description: "Equipo experto listo para ayudarte en cada paso"
    },
    {
      icon: FiTrendingUp,
      title: "Innovación Constante",
      description: "Siempre actualizados con la última tecnología"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Content */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Sobre Nosotros
          </h3>
          <p className="text-lg text-gray-700 leading-relaxed">
            En <span className="font-semibold text-blue-600">TechGadget</span> creemos en la innovación, 
            la calidad y el servicio. Ofrecemos productos tecnológicos de vanguardia 
            con atención personalizada para mejorar tu vida diaria.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="text-center p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 hover-lift"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h4>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold mb-1">8+</div>
              <div className="text-blue-100">Años de Experiencia</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">500+</div>
              <div className="text-blue-100">Productos</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">10k+</div>
              <div className="text-blue-100">Clientes</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">98%</div>
              <div className="text-blue-100">Satisfacción</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}