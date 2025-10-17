const products = [
  { id: 1, name: "Notebook Lenovo", price: "$850.000" },
  { id: 2, name: "Mouse Logitech", price: "$25.000" },
  { id: 3, name: "Auriculares Sony", price: "$65.000" },
];

export default function FeaturedProducts() {
  return (
    <section id="productos" className="py-16 px-8 bg-gray-50">
      <h3 className="text-3xl font-bold text-center mb-10">
        Productos destacados
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white shadow-md p-6 rounded-lg hover:scale-105 transform transition"
          >
            <div className="h-40 bg-gray-200 mb-4 rounded-lg"></div>
            <h4 className="text-xl font-semibold mb-2">{p.name}</h4>
            <p className="text-gray-600 mb-4">{p.price}</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
