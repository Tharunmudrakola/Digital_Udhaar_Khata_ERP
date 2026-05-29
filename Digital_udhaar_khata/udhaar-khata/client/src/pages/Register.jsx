import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import API from "../services/api";

import toast from "react-hot-toast";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({

    name: "",
    email: "",
    password: "",
    role: "customer"

  });

  const [loading, setLoading] = useState(false);

  // HANDLE CHANGE

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value

    });

  };

  // HANDLE SUBMIT

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      const res = await API.post(

        "/auth/register",

        formData

      );

      toast.success(
        "Registration Successful"
      );

      // STORE USER INFO

      localStorage.setItem(

        "userInfo",

        JSON.stringify(res.data)

      );

      // STORE TOKEN

      localStorage.setItem(

        "token",

        res.data.token

      );

      // ROLE BASED REDIRECT

      if (res.data.role === "owner") {

        navigate("/dashboard");

      }

      else {

        navigate("/customer-dashboard");

      }

    }

    catch (error) {

      toast.error(

        error.response?.data?.message ||

        "Registration Failed"

      );

    }

    finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4">

      {/* CARD */}

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">

        {/* LOGO */}

        <div className="flex justify-center mb-6">

          <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">

            <span className="text-white text-4xl font-bold">

              ₹

            </span>

          </div>

        </div>

        {/* TITLE */}

        <div className="text-center mb-8">

          <h1 className="text-4xl font-extrabold text-gray-900">

            Create Account

          </h1>

          <p className="text-gray-500 mt-3">

            Register to continue

          </p>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* NAME */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">

              Full Name

            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full text-black placeholder-gray-500 bg-white border border-gray-200 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* EMAIL */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">

              Email Address

            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full text-black placeholder-gray-500 bg-white border border-gray-200 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* PASSWORD */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">

              Password

            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full text-black placeholder-gray-500 bg-white border border-gray-200 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* ROLE */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">

              Select Role

            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full text-black bg-white border border-gray-200 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-blue-500"
            >

              <option value="customer">

                Customer

              </option>

              <option value="owner">

                Owner

              </option>

            </select>

          </div>

          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-blue-500/30"
          >

            {

              loading

                ? "Creating Account..."

                : "Register"

            }

          </button>

        </form>

        {/* LOGIN LINK */}

        <p className="text-center text-gray-500 mt-8">

          Already have an account?
          {" "}

          <Link
            to="/"
            className="text-blue-600 font-semibold hover:underline"
          >

            Login

          </Link>

        </p>

      </div>

    </div>

  );

}

export default Register;