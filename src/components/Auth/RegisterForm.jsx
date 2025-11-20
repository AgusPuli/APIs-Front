import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/slices/userSlice"; 
import toast from "react-hot-toast";

export default function RegisterForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading: loginLoading } = useSelector((state) => state.user);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Estado local de carga solo para el fetch de registro
  const [registerLoading, setRegisterLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Las contrasenas no coinciden");
      return;
    }

    setRegisterLoading(true);

    try {
      // 1. Registrar usuario (Llamada directa al backend)
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      if (!response.ok) {
        let errorMsg = "Error al registrarse";
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }

      toast.success("Usuario registrado correctamente");

      // 2. Login automático con Redux
      const resultAction = await dispatch(loginUser({ email, password }));
      
      if (loginUser.fulfilled.match(resultAction)) {
        navigate("/");
      }

    } catch (err) {
      toast.error(err.message || "Error en el registro");
    } finally {
      setRegisterLoading(false);
    }
  };

  const isLoading = registerLoading || loginLoading;

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Nombre"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="form-input block w-full px-3 py-3 rounded-lg border border-gray-300 dark:border-gray-700"
        />
        <input
          type="text"
          placeholder="Apellido"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="form-input block w-full px-3 py-3 rounded-lg border border-gray-300 dark:border-gray-700"
        />
        <input
          type="email"
          placeholder="Correo electronico"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input block w-full px-3 py-3 rounded-lg border border-gray-300 dark:border-gray-700"
        />
        <input
          type="password"
          placeholder="Contrasena"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-input block w-full px-3 py-3 rounded-lg border border-gray-300 dark:border-gray-700"
        />
        <input
          type="password"
          placeholder="Confirmar contrasena"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="form-input block w-full px-3 py-3 rounded-lg border border-gray-300 dark:border-gray-700"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="group relative w-full flex justify-center py-3 px-4 rounded-lg bg-primary text-white font-medium disabled:opacity-70"
      >
        {isLoading ? "Procesando..." : "Crear Cuenta"}
      </button>

      <p className="text-sm text-center mt-2">
        Ya tienes cuenta?{" "}
        <button
          type="button"
          className="text-primary hover:underline"
          onClick={() => navigate("/login")}
        >
          Iniciar sesion
        </button>
      </p>
    </form>
  );
}