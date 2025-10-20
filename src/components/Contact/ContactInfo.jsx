// src/components/Contact/ContactInfo.jsx
"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

export default function ContactInfo() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "", 
  });

  // Ubicación personalizada (latitud y longitud)
  const position = { lat: -34.6037, lng: -58.3816 }; // Buenos Aires

  return (
    <div className="space-y-12">
      {/* Información de contacto */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Información de Contacto</h3>
        <div className="mt-4 space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 text-primary">
              {/* Ícono de correo */}
              <svg fill="currentColor" height="24" width="24" viewBox="0 0 256 256">
                <path d="M224,48H32a8,8,0,0,0-8,8V192a8,8,0,0,0,8,8H224a8,8,0,0,0,8-8V56A8,8,0,0,0,224,48Zm-8,137.66L131.53,118.34a8,8,0,0,0-11.06,0L32,185.66V64H224v121.66Z"/>
              </svg>
            </div>
            <div className="ml-4">
              <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">Correo Electrónico</h4>
              <p className="text-gray-600 dark:text-gray-300">soporte@TechGadget.com</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 text-primary">
              {/* Ícono de teléfono */}
              <svg fill="currentColor" height="24" width="24" viewBox="0 0 256 256">
                <path d="M222.39,157.84l-48-24a8,8,0,0,0-9.53,1.67l-24.5,32.66A120.3,120.3,0,0,1,80,108.18l32.67-24.5a8,8,0,0,0,1.66-9.53l-24-48a8,8,0,0,0-9.6-4.48L32.09,45.24A8,8,0,0,0,26.5,52.92a40.09,40.09,0,0,0,39.57,39.56,128,128,0,0,0,128,128,40.09,40.09,0,0,0,39.57-5.59l23.57-48.64A8,8,0,0,0,222.39,157.84Z"/>
              </svg>
            </div>
            <div className="ml-4">
              <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">Teléfono</h4>
              <p className="text-gray-600 dark:text-gray-300">+54 9 (11) 6767-6767</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 text-primary">
              {/* Ícono de ubicación */}
              <svg fill="currentColor" height="24" width="24" viewBox="0 0 256 256">
                <path d="M128,24a80.09,80.09,0,0,0-80,80c0,57.44,73.45,123.63,75.91,126.1a8,8,0,0,0,8.18,0C134.55,227.63,208,161.44,208,104A80.09,80.09,0,0,0,128,24Zm0,112a32,32,0,1,1,32-32A32,32,0,0,1,128,136Z"/>
              </svg>
            </div>
            <div className="ml-4">
              <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">Dirección</h4>
              <p className="text-gray-600 dark:text-gray-300">Puli Tower (calle Mar Azul 237), CABA, Arg</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mapa interactivo */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Nuestra Ubicación</h3>
        <div className="mt-4 w-full h-80 rounded-lg overflow-hidden">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={position}
              zoom={15}
            >
              <Marker position={position} />
            </GoogleMap>
          ) : (
            <p className="text-gray-700 dark:text-gray-300">Cargando mapa...</p>
          )}
        </div>
      </div>
    </div>
  );
}
