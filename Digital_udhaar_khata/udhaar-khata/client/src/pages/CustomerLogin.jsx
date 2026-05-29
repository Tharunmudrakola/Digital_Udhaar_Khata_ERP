import React from "react";

import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";

function CustomerLogin() {

  const {
    register,
    handleSubmit,
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (formData) => {

    try {

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      // STORE USER INFO

      localStorage.setItem(
        "userInfo",
        JSON.stringify(data)
      );

      // REDIRECT BASED ON ROLE

      if (data.role === "owner") {

        navigate("/dashboard");

      }

      else {

        navigate("/customer-dashboard");

      }

    }

    catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="flex justify-center items-center h-screen">

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-[300px] p-6 shadow-lg rounded-lg"
      >

        <h1 className="text-2xl font-bold text-center">

          Customer Login

        </h1>

        <input
          type="email"
          placeholder="Enter Email"
          {...register("email")}
          className="border p-2 rounded"
        />

        <input
          type="password"
          placeholder="Enter Password"
          {...register("password")}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-black text-white p-2 rounded"
        >
          Login
        </button>

      </form>

    </div>

  );

}

export default CustomerLogin;