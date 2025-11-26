import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, loginUser } from "../../store/slices/userSlice";
import toast from "react-hot-toast";

export default function RegisterForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    try {

      await dispatch(registerUser({ 
        firstName, 
        lastName, 
        email, 
        password 
      })).unwrap();

      toast.success("Usuario registrado correctamente");


      await dispatch(loginUser({ email, password })).unwrap();
      

      navigate("/");

    } catch (err) {
      toast.error(err.message || "Error en el registro");
    }
  };

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
          placeholder="Correo electrónico"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input block w-full px-3 py-3 rounded-lg border border-gray-300 dark:border-gray-700"
        />
        <input
          type="password"
          placeholder="Contraseña"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-input block w-full px-3 py-3 rounded-lg border border-gray-300 dark:border-gray-700"
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="form-input block w-full px-3 py-3 rounded-lg border border-gray-300 dark:border-gray-700"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="group relative w-full flex justify-center py-3 px-4 rounded-lg bg-primary text-white font-medium disabled:opacity-70"
      >
        {loading ? "Procesando..." : "Crear Cuenta"}
      </button>

      <p className="text-sm text-center mt-2">
        ¿Ya tienes cuenta?{" "}
        <button
          type="button"
          className="text-primary hover:underline"
          onClick={() => navigate("/login")}
        >
          Iniciar sesión
        </button>
      </p>
    </form>
  );
}