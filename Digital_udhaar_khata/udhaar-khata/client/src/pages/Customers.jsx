import { useEffect, useState } from "react";

import API from "../services/api";

import Layout from "../components/Layout";

import toast from "react-hot-toast";

import { Link } from "react-router-dom";

import {

  Search,
  Users,
  Mail,
  Phone,
  MapPin,
  Wallet,
  Pencil,
  Trash2,
  Eye,
  UserPlus

} from "lucide-react";

function Customers() {

  const [customers,
    setCustomers] = useState([]);

  const [search,
    setSearch] = useState("");

  const [editingCustomer,
    setEditingCustomer] = useState(null);

  const [formData,
    setFormData] = useState({

      name: "",
      email: "",
      phone: "",
      address: ""

    });

  useEffect(() => {

    fetchCustomers();

  }, []);

  // FETCH CUSTOMERS

  const fetchCustomers =
    async () => {

      try {

        const token =
          localStorage.getItem("token");

        const res =
          await API.get(

            "/customers",

            {

              headers: {

                Authorization:
                  `Bearer ${token}`

              }

            }

          );

        setCustomers(
          res.data
        );

      }

      catch (error) {

        toast.error(
          "Failed to fetch customers"
        );

      }

    };

  // HANDLE CHANGE

  const handleChange =
    (e) => {

      setFormData({

        ...formData,

        [e.target.name]:
          e.target.value

      });

    };

  // ADD / UPDATE

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        const token =
          localStorage.getItem("token");

        if (editingCustomer) {

          await API.put(

            `/customers/${editingCustomer._id}`,

            formData,

            {

              headers: {

                Authorization:
                  `Bearer ${token}`

              }

            }

          );

          toast.success(
            "Customer Updated"
          );

          setEditingCustomer(null);

        }

        else {

          await API.post(

            "/customers",

            formData,

            {

              headers: {

                Authorization:
                  `Bearer ${token}`

              }

            }

          );

          toast.success(
            "Customer Added"
          );

        }

        fetchCustomers();

        setFormData({

          name: "",
          email: "",
          phone: "",
          address: ""

        });

      }

      catch (error) {

        toast.error(

          error.response?.data?.message ||

          "Something went wrong"

        );

      }

    };

  // DELETE

  const handleDelete =
    async (id) => {

      try {

        const token =
          localStorage.getItem("token");

        await API.delete(

          `/customers/${id}`,

          {

            headers: {

              Authorization:
                `Bearer ${token}`

            }

          }

        );

        toast.success(
          "Customer Deleted"
        );

        fetchCustomers();

      }

      catch (error) {

        toast.error(
          "Delete Failed"
        );

      }

    };

  // FILTER

  const filteredCustomers =
    customers.filter((c) =>

      c.name.toLowerCase().includes(

        search.toLowerCase()

      )

    );

  return (

    <Layout>

      <div className="space-y-8 min-h-screen

      bg-[#f4f7fb]

      p-2 sm:p-4 lg:p-6 transition-all duration-300">

        {/* HERO */}

        <div className="relative overflow-hidden

        rounded-[28px] sm:rounded-[40px]

        bg-gradient-to-r

        from-[#ff512f]

        via-[#dd2476]

        to-[#6a11cb]

        p-5 sm:p-8 lg:p-10 text-white

        shadow-[0_20px_80px_rgba(221,36,118,0.25)]">

          {/* GLOW */}

          <div className="absolute -top-20 -right-20

          w-72 h-72 bg-white/10 rounded-full blur-3xl">

          </div>

          <div className="absolute bottom-0 left-0

          w-80 h-80 bg-pink-500/10 rounded-full blur-3xl">

          </div>

          <div className="relative z-10 flex flex-col lg:flex-row

          justify-between gap-8">

            {/* LEFT */}

            <div>

              <div className="flex items-center gap-5">

                <div className="w-16 h-16 sm:w-20 sm:h-20

                rounded-[28px]

                bg-white/15

                backdrop-blur-xl

                border border-white/20

                flex items-center justify-center shadow-xl">

                  <Users
                    size={38}
                    className="text-white"
                  />

                </div>

                <div>

                  <h1 className="text-3xl sm:text-5xl lg:text-6xl

                  font-black tracking-tight leading-tight">

                    Customers

                  </h1>

                  <p className="text-white/80

                  text-base sm:text-lg mt-3">

                    Manage all your customer records professionally

                  </p>

                </div>

              </div>

            </div>

            {/* RIGHT STATS */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="bg-white/10 backdrop-blur-xl

              border border-white/20 rounded-[28px]

              p-5 min-w-full sm:min-w-[220px]">

                <p className="text-white/70 text-sm">

                  Total Customers

                </p>

                <h2 className="text-4xl sm:text-5xl

                font-black mt-3">

                  {customers.length}

                </h2>

              </div>

              <div className="bg-white/10 backdrop-blur-xl

              border border-white/20 rounded-[28px]

              p-5 min-w-full sm:min-w-[220px]">

                <p className="text-white/70 text-sm">

                  Active Records

                </p>

                <h2 className="text-4xl sm:text-5xl

                font-black mt-3">

                  {filteredCustomers.length}

                </h2>

              </div>

            </div>

          </div>

        </div>

        {/* SEARCH */}

        <div className="relative">

          <Search
            size={20}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input

            type="text"

            placeholder="Search customers..."

            value={search}

            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }

            className="w-full lg:w-[420px]

            pl-14 pr-5 py-4 rounded-2xl

            border border-gray-200

            bg-white

            dark:bg-[#111827]

            dark:border-gray-700

            dark:text-white outline-none"

          />

        </div>

        {/* FORM */}

        <form

          onSubmit={handleSubmit}

          className="bg-gradient-to-br

          from-white to-[#f8fafc]

          p-5 sm:p-8 rounded-[32px]

          border border-gray-100

          shadow-lg"

        >

          <div className="flex flex-col lg:flex-row

          justify-between lg:items-center gap-4 mb-8">

            <div>

              <h2 className="text-2xl sm:text-3xl

              font-black">

                {

                  editingCustomer

                    ? "Update Customer"

                    : "Add New Customer"

                }

              </h2>

              <p className="text-gray-500 mt-2">

                Manage customer details and records

              </p>

            </div>

            <div className="w-14 h-14 rounded-2xl

            bg-pink-100 flex items-center justify-center">

              <UserPlus
                size={28}
                className="text-pink-600"
              />

            </div>

          </div>

          {/* INPUTS */}

          <div className="grid grid-cols-1

          md:grid-cols-2 xl:grid-cols-4 gap-5">

            <input

              name="name"

              value={formData.name}

              onChange={handleChange}

              placeholder="Customer Name"

              required

              className="p-4 rounded-2xl border

              bg-white outline-none

              focus:ring-2 focus:ring-pink-500"

            />

            <input

              type="email"

              name="email"

              value={formData.email}

              onChange={handleChange}

              placeholder="Email Address"

              required

              className="p-4 rounded-2xl border

              bg-white outline-none

              focus:ring-2 focus:ring-pink-500"

            />

            <input

              name="phone"

              value={formData.phone}

              onChange={handleChange}

              placeholder="Phone Number"

              className="p-4 rounded-2xl border

              bg-white outline-none

              focus:ring-2 focus:ring-pink-500"

            />

            <input

              name="address"

              value={formData.address}

              onChange={handleChange}

              placeholder="Address"

              className="p-4 rounded-2xl border

              bg-white outline-none

              focus:ring-2 focus:ring-pink-500"

            />

          </div>

          {/* BUTTON */}

          <button

            type="submit"

            className="mt-6 w-full sm:w-auto

            bg-gradient-to-r

            from-[#ff512f]

            to-[#6a11cb]

            hover:scale-[1.02]

            text-white px-8 py-4 rounded-2xl

            font-bold transition-all duration-300"

          >

            {

              editingCustomer

                ? "Update Customer"

                : "Add Customer"

            }

          </button>

        </form>

        {/* CUSTOMER GRID */}

        <div className="grid grid-cols-1

        md:grid-cols-2 2xl:grid-cols-3 gap-6">

          {

            filteredCustomers.map((customer) => (

              <div

                key={customer._id}

                className="bg-gradient-to-br

                from-white to-[#f8fafc]

                p-6 rounded-[30px]

                border border-gray-100

                shadow-lg hover:shadow-2xl

                hover:-translate-y-2

                transition-all duration-300"

              >

                {/* TOP */}

                <div className="flex items-start justify-between">

                  <div>

                    <h2 className="text-2xl sm:text-3xl

                    font-black">

                      {customer.name}

                    </h2>

                    <p className="text-gray-500 mt-2 flex items-center gap-2">

                      <Mail size={16} />

                      {customer.email}

                    </p>

                  </div>

                  <div className="w-14 h-14 rounded-2xl

                  bg-pink-100 flex items-center justify-center">

                    <Users
                      size={24}
                      className="text-pink-600"
                    />

                  </div>

                </div>

                {/* INFO */}

                <div className="mt-6 space-y-3">

                  <p className="text-gray-500 flex items-center gap-2">

                    <Phone size={16} />

                    {customer.phone || "No phone"}

                  </p>

                  <p className="text-gray-500 flex items-center gap-2">

                    <MapPin size={16} />

                    {customer.address || "No address"}

                  </p>

                </div>

                {/* BALANCE */}

                <div className="mt-6

                bg-gradient-to-r

                from-green-50 to-emerald-50

                rounded-2xl p-5">

                  <p className="text-gray-500 text-sm flex items-center gap-2">

                    <Wallet size={16} />

                    Current Balance

                  </p>

                  <h3 className="text-3xl sm:text-4xl

                  font-black text-green-600 mt-2">

                    ₹ {customer.balance}

                  </h3>

                </div>

                {/* ACTIONS */}

                <div className="flex flex-wrap gap-3 mt-6">

                  <Link

                    to={`/customers/${customer._id}`}

                    className="flex items-center gap-2

                    bg-green-600 hover:bg-green-700

                    text-white px-5 py-3 rounded-2xl

                    transition-all"

                  >

                    <Eye size={18} />

                    View

                  </Link>

                  <button

                    onClick={() => {

                      setEditingCustomer(customer);

                      setFormData({

                        name:
                          customer.name,

                        email:
                          customer.email,

                        phone:
                          customer.phone,

                        address:
                          customer.address

                      });

                    }}

                    className="flex items-center gap-2

                    bg-blue-600 hover:bg-blue-700

                    text-white px-5 py-3 rounded-2xl

                    transition-all"

                  >

                    <Pencil size={18} />

                    Edit

                  </button>

                  <button

                    onClick={() =>
                      handleDelete(
                        customer._id
                      )
                    }

                    className="flex items-center gap-2

                    bg-red-500 hover:bg-red-600

                    text-white px-5 py-3 rounded-2xl

                    transition-all"

                  >

                    <Trash2 size={18} />

                    Delete

                  </button>

                </div>

              </div>

            ))

          }

        </div>

      </div>

    </Layout>

  );

}

export default Customers;