import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function Navbar() {

  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (

    <div className="flex justify-between items-center px-8 py-4
      bg-white/80 dark:bg-gray-900/80 backdrop-blur-md
      border-b border-gray-100 dark:border-gray-800
      text-gray-900 dark:text-white
      transition-all duration-300">

      {/* LOGO */}
      <h1 className="text-2xl font-extrabold tracking-tight">
        Udhaar Khata
      </h1>

      {/* LINKS */}
      <div className="flex gap-6 items-center text-sm font-medium">

        <Link className="hover:text-indigo-500 transition" to="/dashboard">
          Dashboard
        </Link>

        <Link className="hover:text-indigo-500 transition" to="/customers">
          Customers
        </Link>

        <Link className="hover:text-indigo-500 transition" to="/transactions">
          Transactions
        </Link>

        {/* THEME TOGGLE */}
        <button
          onClick={toggleTheme}
          className="
            flex items-center gap-2
            px-4 py-2 rounded-xl
            bg-gray-100 dark:bg-gray-800
            text-gray-800 dark:text-gray-200
            hover:bg-gray-200 dark:hover:bg-gray-700
            active:scale-95
            transition-all duration-200
          "
        >
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="
            px-4 py-2 rounded-xl
            bg-red-500 hover:bg-red-600
            text-white font-medium
            active:scale-95
            transition-all duration-200
          "
        >
          Logout
        </button>

      </div>

    </div>

  );

}

export default Navbar;