import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import { useEffect, useState } from "react";

import Bills from "./pages/Bills";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Transactions from "./pages/Transactions";
import ProtectedRoute from "./components/ProtectedRoute";
import CustomerLedger from "./pages/CustomerLedger";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
import OwnerLogin from "./pages/OwnerLogin";
import OwnerRegister from "./pages/OwnerRegister";

import CustomerLogin from "./pages/CustomerLogin";
import CustomerRegister from "./pages/CustomerRegister";
import CustomerDashboard from "./pages/CustomerDashboard";

function App() {

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  // 🌙 APPLY THEME (FIXED & CLEAN)
  useEffect(() => {

    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);

  }, [theme]);

  // ❌ REMOVED storage listener (not needed)

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/customers"
          element={
            <ProtectedRoute>
              <Customers />
            </ProtectedRoute>
          }
        />

        <Route path="/customers/:id"
          element={
            <ProtectedRoute>
              <CustomerLedger />
            </ProtectedRoute>
          }
        />

        <Route path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />

        <Route path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route path="/bills" element={<Bills />} />

        <Route path="/analytics" element={<Analytics />} />
        <Route path="/owner/login" element={<OwnerLogin />} />

<Route path="/owner/register" element={<OwnerRegister />} />

<Route path="/customer/login" element={<CustomerLogin />} />

<Route path="/customer/register" element={<CustomerRegister />} />
<Route
  path="/customer-dashboard"
  element={<CustomerDashboard />}
/>

      </Routes>

    </BrowserRouter>

  );

}

export default App;