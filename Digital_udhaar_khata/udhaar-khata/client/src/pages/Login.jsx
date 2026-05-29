import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import API from "../services/api";

import toast from "react-hot-toast";

function Login() {

  const navigate =
    useNavigate();

  const [formData, setFormData] =
    useState({

      email: "",

      password: ""

    });

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value

    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await API.post(

        "/auth/login",

        formData

      );

      // SAVE TOKEN

      localStorage.setItem(

        "token",

        res.data.token

      );

      // SAVE USER INFO

      localStorage.setItem(

        "userInfo",

        JSON.stringify(res.data)

      );

      toast.success(

        "Login Successful"

      );

      // ROLE BASED REDIRECT

      if (

        res.data.role === "owner"

      ) {

        navigate("/dashboard");

      }

      else {

        navigate(

          "/customer-dashboard"

        );

      }

    }

    catch (error) {

      toast.error(

        error.response?.data?.message ||

        "Login Failed"

      );

    }

  };

  return (

    <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900">

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-lg w-[400px]"
      >

        <h1 className="text-3xl font-bold mb-8 text-center text-black dark:text-white">

          Login

        </h1>

        {/* EMAIL */}

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border dark:border-gray-700 bg-white dark:bg-gray-700 p-3 rounded-lg mb-4 text-black dark:text-white"
        />

        {/* PASSWORD */}

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full border dark:border-gray-700 bg-white dark:bg-gray-700 p-3 rounded-lg mb-6 text-black dark:text-white"
        />

        {/* BUTTON */}

        <button
          type="submit"
          className="w-full bg-black dark:bg-blue-600 text-white py-3 rounded-lg"
        >

          Login

        </button>

        <p className="text-center mt-6 text-black dark:text-white">

          Don't have an account?

        </p>

        <Link
          to="/register"
          className="block text-center text-blue-500 mt-2"
        >

          Register

        </Link>

      </form>

    </div>

  );

}

export default Login;