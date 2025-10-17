export default function Header() {
  return (
    <header className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-600">TechStore</h1>

      <input
        type="text"
        placeholder="Buscar productos..."
        className="border rounded-lg px-4 py-2 w-1/3 focus:outline-none focus:ring focus:ring-blue-300"
      />

      <nav className="space-x-6">
        <a href="/" className="text-gray-700 hover:text-blue-600">
          Inicio
        </a>
        <a href="/cart" className="text-gray-700 hover:text-blue-600">
          Carrito
        </a>
      </nav>
    </header>
  );
}
