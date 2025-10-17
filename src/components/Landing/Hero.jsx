export default function Hero() {
  return (
    <section className="bg-blue-600 text-white text-center py-20 px-6">
      <h2 className="text-4xl font-bold mb-4">¡Bienvenido a TechStore!</h2>
      <p className="text-lg mb-6">
        Los mejores productos tecnológicos al mejor precio 💻⚡
      </p>
      <a
        href="#productos"
        className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-200"
      >
        Ver productos
      </a>
    </section>
  );
}
