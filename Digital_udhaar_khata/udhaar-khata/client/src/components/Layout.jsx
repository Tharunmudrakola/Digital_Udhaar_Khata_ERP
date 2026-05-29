import { useState } from "react";

import {

  Link,
  useLocation

} from "react-router-dom";

import {

  Menu,
  X,
  LayoutDashboard,
  Users,
  ArrowLeftRight,
  Settings,
  LogOut,
  ReceiptText,
  BarChart3,
  Moon,
  Sun

} from "lucide-react";

import {

  useTheme

} from "../context/ThemeContext";

function Layout({ children }) {

  const [sidebarOpen,

    setSidebarOpen] = useState(false);

  const location =
    useLocation();

  const {

    theme,

    toggleTheme

  } = useTheme();

  // LOGOUT

  const handleLogout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "userInfo"
    );

    window.location.href = "/";

  };

  // ACTIVE NAV STYLE

  const navLinkClass =
    (path) =>

      `flex items-center gap-4

      px-5 py-4 rounded-2xl

      text-[15px] lg:text-[17px]

      font-semibold transition-all duration-300

      ${

        location.pathname === path

          ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xl shadow-violet-500/20"

          : "text-gray-300 hover:bg-white/10 hover:text-white"

      }`;

  return (

    <div className="flex min-h-screen bg-[#eef2ff]

    dark:bg-[#020617] text-gray-900 dark:text-white">

      {/* MOBILE TOPBAR */}

      <div className="lg:hidden fixed top-0 left-0 right-0 h-16

      bg-[#0f172a]/95 backdrop-blur-xl border-b border-white/10

      text-white flex items-center justify-between px-4 z-50">

        {/* LEFT */}

        <div className="flex items-center gap-4">

          <button
            onClick={() =>
              setSidebarOpen(true)
            }
            className="hover:scale-110 transition"
          >

            <Menu size={28} />

          </button>

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-2xl

            bg-gradient-to-r from-violet-500 to-indigo-600

            flex items-center justify-center font-black">

              ₹

            </div>

            <h1 className="text-xl font-black">

              Udhaar Khata

            </h1>

          </div>

        </div>

        {/* THEME */}

        <button
          onClick={toggleTheme}
          className="bg-white/10 p-2 rounded-xl"
        >

          {

            theme === "dark"

              ? <Sun size={18} />

              : <Moon size={18} />

          }

        </button>

      </div>

      {/* OVERLAY */}

      {

        sidebarOpen && (

          <div

            onClick={() =>
              setSidebarOpen(false)
            }

            className="fixed inset-0 bg-black/60

            backdrop-blur-sm z-40 lg:hidden"

          />

        )

      }

      {/* SIDEBAR */}

      <aside

        className={`fixed lg:static top-0 left-0 h-screen

        w-[85%] sm:w-72

        bg-gradient-to-b from-[#0f172a] to-[#020617]

        border-r border-white/10

        text-white p-6 flex flex-col

        transition-transform duration-300 z-50

        ${

          sidebarOpen

            ? "translate-x-0"

            : "-translate-x-full"

        }

        lg:translate-x-0`}

      >

        {/* MOBILE CLOSE */}

        <button

          onClick={() =>
            setSidebarOpen(false)
          }

          className="lg:hidden absolute top-5 right-5"

        >

          <X size={28} />

        </button>

        {/* LOGO */}

        <div className="mb-10 flex items-center gap-4">

          <div className="w-14 h-14 rounded-3xl

          bg-gradient-to-r from-violet-500 to-indigo-600

          flex items-center justify-center

          text-2xl font-black shadow-xl">

            ₹

          </div>

          <div>

            <h1 className="text-2xl font-black">

              Udhaar Khata

            </h1>

            <p className="text-gray-400 text-sm mt-1">

              Digital ERP Ledger

            </p>

          </div>

        </div>

        {/* NAVIGATION */}

        <nav className="flex flex-col gap-3">

          <Link

            to="/dashboard"

            className={navLinkClass("/dashboard")}

            onClick={() =>
              setSidebarOpen(false)
            }

          >

            <LayoutDashboard size={20} />

            Dashboard

          </Link>

          <Link

            to="/analytics"

            className={navLinkClass("/analytics")}

            onClick={() =>
              setSidebarOpen(false)
            }

          >

            <BarChart3 size={20} />

            Analytics

          </Link>

          <Link

            to="/customers"

            className={navLinkClass("/customers")}

            onClick={() =>
              setSidebarOpen(false)
            }

          >

            <Users size={20} />

            Customers

          </Link>

          <Link

            to="/transactions"

            className={navLinkClass("/transactions")}

            onClick={() =>
              setSidebarOpen(false)
            }

          >

            <ArrowLeftRight size={20} />

            Transactions

          </Link>

          <Link

            to="/bills"

            className={navLinkClass("/bills")}

            onClick={() =>
              setSidebarOpen(false)
            }

          >

            <ReceiptText size={20} />

            Bills

          </Link>

          <Link

            to="/settings"

            className={navLinkClass("/settings")}

            onClick={() =>
              setSidebarOpen(false)
            }

          >

            <Settings size={20} />

            Settings

          </Link>

        </nav>

        {/* THEME TOGGLE */}

        <button

          onClick={toggleTheme}

          className="mt-6 flex items-center justify-center gap-3

          bg-white/10 hover:bg-white/20

          py-4 rounded-2xl transition-all duration-300"

        >

          {

            theme === "dark"

              ? (

                <>

                  <Sun size={18} />

                  Light Mode

                </>

              )

              : (

                <>

                  <Moon size={18} />

                  Dark Mode

                </>

              )

          }

        </button>

        {/* USER */}

        <div className="mt-auto">

          <div className="bg-white/10 border border-white/10

          p-5 rounded-3xl mb-4">

            <p className="text-sm text-gray-400">

              Logged in as

            </p>

            <h2 className="font-bold text-lg mt-1">

              Admin User

            </h2>

          </div>

          {/* LOGOUT */}

          <button

            onClick={handleLogout}

            className="w-full bg-red-500 hover:bg-red-600

            py-4 rounded-2xl flex items-center justify-center

            gap-3 font-semibold transition-all duration-300"

          >

            <LogOut size={18} />

            Logout

          </button>

        </div>

      </aside>

      {/* MAIN CONTENT */}

      <main className="flex-1 overflow-y-auto

      bg-[#eef2ff] dark:bg-[#0b1220]

      transition-all duration-300">

        <div className="p-4 sm:p-6 lg:p-10

        pt-24 lg:pt-10">

          {children}

        </div>

      </main>

    </div>

  );

}

export default Layout;