import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/slices/userSlice";

export default function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // Evita recarga de página
    console.log("🖱️ Click en Login detectado");
    
    // Despachamos la acción
    dispatch(loginUser({ email, password }))
      .unwrap() // Esto permite manejar el éxito/error aquí mismo
      .then(() => {
          console.log("✅ Redirigiendo...");
          navigate("/");
      })
      .catch((err) => {
          console.error("❌ Falló el login:", err);
          alert("Error: " + err); // Alerta visual simple
      });
  };

  return (
    <div className="mt-8">
      {/* Mensaje de error visual si existe */}
      {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 border rounded dark:bg-gray-800 dark:text-white"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full p-3 border rounded dark:bg-gray-800 dark:text-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Conectando..." : "Iniciar Sesión"}
        </button>
      </form>
    </div>
  );
}