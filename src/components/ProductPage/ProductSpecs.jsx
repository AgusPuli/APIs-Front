export default function ProductSpecs({ product }) {
  if (!product.specifications) return null;

  return (
    <div className="py-10">
      <h2 className="text-xl font-bold mb-4">Especificaciones</h2>
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        {Object.entries(product.specifications).map(([key, value]) => (
          <div key={key}>
            <p className="font-medium text-white-500">{key}</p>
            <p className="text-white-800">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
