export default function CheckoutSteps({ currentStep }) {
  const steps = [
    { id: 1, label: "Datos de Envío" },
    { id: 2, label: "Pago" },
    { id: 3, label: "Confirmación" },
  ];

  return (
    <div className="flex justify-between items-center">
      {steps.map((step) => (
        <div key={step.id} className="flex-1 text-center">
          <div
            className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-sm font-bold 
              ${
                currentStep >= step.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-500"
              }`}
          >
            {step.id}
          </div>
          <p
            className={`mt-2 text-sm ${
              currentStep >= step.id
                ? "text-blue-600 dark:text-blue-400 font-medium"
                : "text-gray-500"
            }`}
          >
            {step.label}
          </p>
        </div>
      ))}
    </div>
  );
}
