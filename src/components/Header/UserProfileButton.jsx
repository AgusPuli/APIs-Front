import { useState, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/userSlice"; 
export default function UserProfileButton() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Leer estado de usuario desde Redux
  const { user, authenticated } = useSelector((state) => state.user);
  
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDashboardClick = () => {
    if (!user) return;

    // Verificamos el rol que viene en el objeto user de Redux
    if (user.role === "ADMIN") {
      navigate("/admin");
    } else {
      navigate("/user"); 
    }
  };

  const handleLogout = () => {
      dispatch(logout());
      setIsOpen(false);
      navigate("/");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover-lift focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Menu de usuario"
      >
        <FaUserCircle className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50 slide-in-right">
          {!authenticated ? (
            <button
              className="block w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              onClick={() => {
                setIsOpen(false);
                navigate("/login");
              }}
            >
              Iniciar Sesion
            </button>
          ) : (
            <>
              <button
                className="block w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium border-b border-gray-100 dark:border-gray-700"
                onClick={() => {
                  handleDashboardClick();
                  setIsOpen(false);
                }}
              >
                Dashboard
              </button>
              <button
                className="block w-full text-left px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
                onClick={handleLogout}
              >
                Cerrar Sesion
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}