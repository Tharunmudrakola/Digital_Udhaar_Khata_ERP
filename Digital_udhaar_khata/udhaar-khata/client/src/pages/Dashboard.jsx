import { useEffect, useState } from "react";

import Layout from "../components/Layout";

import API from "../services/api";

import {

  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend

} from "recharts";

import {

  Users,
  Wallet,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Clock3,
  Sparkles

} from "lucide-react";

function Dashboard() {

  const [dashboard,
    setDashboard] =
    useState(null);

  const [currentTime,
    setCurrentTime] =
    useState(new Date());

  // ================= FETCH =================

  useEffect(() => {

    fetchDashboard();

    const timer =
      setInterval(() => {

        setCurrentTime(
          new Date()
        );

      }, 1000);

    return () =>
      clearInterval(timer);

  }, []);

  const fetchDashboard =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await API.get(

            "/dashboard",

            {

              headers: {

                Authorization:
                  `Bearer ${token}`

              }

            }

          );

        setDashboard({

          ...res.data,

          totalBalance:

            (res.data.totalCredit || 0)

            -

            (res.data.totalDebit || 0)

        });

      }

      catch (error) {

        console.log(error);

      }

    };

  // ================= LOADING =================

  if (!dashboard) {

    return (

      <Layout>

        <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center">

          <div className="text-center">

            <div className="w-20 h-20 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto">

            </div>

            <h1 className="text-gray-800 text-3xl font-black mt-6">

              Loading Dashboard...

            </h1>

          </div>

        </div>

      </Layout>

    );

  }

  // ================= PIE =================

  const pieData = [

    {

      name: "Credit",

      value:
        dashboard.totalCredit || 0

    },

    {

      name: "Debit",

      value:
        dashboard.totalDebit || 0

    }

  ];

  const COLORS = [

    "#06b6d4",

    "#f43f5e"

  ];

  // ================= MONTHLY =================

  const monthlyChartData =

    dashboard.monthlyData?.map(
      (item) => ({

        month:
          `M${item._id.month}`,

        credit:
          item.credit,

        debit:
          item.debit

      })

    ) || [];

  // ================= GREETING =================

  const hour =
    new Date().getHours();

  let greeting =
    "Good Evening";

  if (hour < 12) {

    greeting =
      "Good Morning";

  }

  else if (hour < 18) {

    greeting =
      "Good Afternoon";

  }

  return (

    <Layout>

      <div className="min-h-screen bg-[#f4f7fb] p-4 md:p-6 lg:p-8">

        {/* HERO */}

        <div className="relative overflow-hidden rounded-[40px]

        bg-gradient-to-r

        from-[#ff512f]

        via-[#dd2476]

        to-[#6a11cb]

        p-8 lg:p-10

        shadow-[0_20px_80px_rgba(221,36,118,0.30)]">

          {/* GLOW */}

          <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-white/10 blur-3xl rounded-full">

          </div>

          <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-pink-400/20 blur-3xl rounded-full">

          </div>

          <div className="relative z-10 flex flex-col xl:flex-row justify-between gap-10">

            {/* LEFT */}

            <div>

              <div className="flex items-center gap-5">

                <div className="w-20 h-20 rounded-[28px]

                bg-white/15

                border border-white/20

                backdrop-blur-2xl

                flex items-center justify-center">

                  <Sparkles
                    size={40}
                    className="text-white"
                  />

                </div>

                <div>

                  <h1 className="text-5xl lg:text-7xl font-black leading-tight text-white">

                    {greeting}
                    <br />
                    Admin 👋

                  </h1>

                  <p className="text-white/80 text-lg mt-4">

                    Welcome to your professional ERP analytics center

                  </p>

                </div>

              </div>

              {/* CLOCK */}

              <div className="mt-10 flex items-center gap-4">

                <div className="w-14 h-14 rounded-2xl

                bg-white/15

                flex items-center justify-center">

                  <Clock3
                    size={28}
                    className="text-white"
                  />

                </div>

                <div>

                  <h2 className="text-3xl font-black text-white">

                    {

                      currentTime.toLocaleTimeString()

                    }

                  </h2>

                  <p className="text-white/70">

                    {

                      currentTime.toDateString()

                    }

                  </p>

                </div>

              </div>

            </div>

            {/* RIGHT */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[30px] p-6 min-w-[220px]">

                <div className="flex justify-between">

                  <div>

                    <p className="text-white/70">

                      Active Customers

                    </p>

                    <h2 className="text-5xl font-black text-white mt-3">

                      {

                        dashboard.totalCustomers || 0

                      }

                    </h2>

                  </div>

                  <Users
                    size={36}
                    className="text-white"
                  />

                </div>

              </div>

              <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[30px] p-6 min-w-[220px]">

                <div className="flex justify-between">

                  <div>

                    <p className="text-white/70">

                      Net Balance

                    </p>

                    <h2 className="text-5xl font-black text-white mt-3">

                      ₹ {

                        dashboard.totalBalance

                      }

                    </h2>

                  </div>

                  <Wallet
                    size={36}
                    className="text-white"
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* KPI */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

          {/* CUSTOMERS */}

          <div className="bg-white rounded-[32px] border border-gray-100 p-7 shadow-sm hover:shadow-xl transition-all">

            <div className="flex justify-between">

              <div>

                <p className="text-gray-500 text-lg">

                  Total Customers

                </p>

                <h2 className="text-6xl font-black text-gray-900 mt-5">

                  {

                    dashboard.totalCustomers

                  }

                </h2>

              </div>

              <div className="w-16 h-16 rounded-[24px] bg-orange-100 flex items-center justify-center">

                <Users
                  size={34}
                  className="text-orange-500"
                />

              </div>

            </div>

          </div>

          {/* CREDIT */}

          <div className="bg-white rounded-[32px] border border-gray-100 p-7 shadow-sm hover:shadow-xl transition-all">

            <div className="flex justify-between">

              <div>

                <p className="text-gray-500 text-lg">

                  Total Credit

                </p>

                <h2 className="text-6xl font-black text-cyan-500 mt-5">

                  ₹ {

                    dashboard.totalCredit

                  }

                </h2>

              </div>

              <div className="w-16 h-16 rounded-[24px] bg-cyan-100 flex items-center justify-center">

                <TrendingUp
                  size={34}
                  className="text-cyan-500"
                />

              </div>

            </div>

          </div>

          {/* DEBIT */}

          <div className="bg-white rounded-[32px] border border-gray-100 p-7 shadow-sm hover:shadow-xl transition-all">

            <div className="flex justify-between">

              <div>

                <p className="text-gray-500 text-lg">

                  Total Debit

                </p>

                <h2 className="text-6xl font-black text-pink-500 mt-5">

                  ₹ {

                    dashboard.totalDebit

                  }

                </h2>

              </div>

              <div className="w-16 h-16 rounded-[24px] bg-pink-100 flex items-center justify-center">

                <TrendingDown
                  size={34}
                  className="text-pink-500"
                />

              </div>

            </div>

          </div>

          {/* BALANCE */}

          <div className="bg-white rounded-[32px] border border-gray-100 p-7 shadow-sm hover:shadow-xl transition-all">

            <div className="flex justify-between">

              <div>

                <p className="text-gray-500 text-lg">

                  Net Balance

                </p>

                <h2 className="text-6xl font-black text-violet-500 mt-5">

                  ₹ {

                    dashboard.totalBalance

                  }

                </h2>

              </div>

              <div className="w-16 h-16 rounded-[24px] bg-violet-100 flex items-center justify-center">

                <Wallet
                  size={34}
                  className="text-violet-500"
                />

              </div>

            </div>

          </div>

        </div>

        {/* CHARTS */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-7 mt-8">

          {/* PIE */}

          <div className="bg-white rounded-[34px] border border-gray-100 p-7 shadow-sm">

            <div className="flex justify-between mb-8">

              <div>

                <h2 className="text-4xl font-black text-gray-900">

                  Credit vs Debit

                </h2>

                <p className="text-gray-500 mt-2">

                  Financial overview

                </p>

              </div>

              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">

                <ArrowUpRight
                  size={24}
                  className="text-gray-700"
                />

              </div>

            </div>

            <div className="h-[380px]">

              <ResponsiveContainer width="100%" height="100%">

                <PieChart>

                  <Pie

                    data={pieData}

                    cx="50%"

                    cy="50%"

                    outerRadius={130}

                    dataKey="value"

                    label

                  >

                    {

                      pieData.map(
                        (entry, index) => (

                          <Cell
                            key={index}
                            fill={COLORS[index]}
                          />

                        )
                      )

                    }

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>

          {/* BAR */}

          <div className="bg-white rounded-[34px] border border-gray-100 p-7 shadow-sm">

            <div className="flex justify-between mb-8">

              <div>

                <h2 className="text-4xl font-black text-gray-900">

                  Monthly Analytics

                </h2>

                <p className="text-gray-500 mt-2">

                  Revenue & expense trends

                </p>

              </div>

              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">

                <Activity
                  size={24}
                  className="text-gray-700"
                />

              </div>

            </div>

            <div className="h-[380px]">

              <ResponsiveContainer width="100%" height="100%">

                <BarChart data={monthlyChartData}>

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis dataKey="month" />

                  <YAxis />

                  <Tooltip />

                  <Legend />

                  <Bar
                    dataKey="credit"
                    fill="#06b6d4"
                    radius={[12, 12, 0, 0]}
                  />

                  <Bar
                    dataKey="debit"
                    fill="#f43f5e"
                    radius={[12, 12, 0, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>

        {/* HIGH DUE */}

        <div className="bg-white rounded-[34px] border border-gray-100 p-7 shadow-sm mt-8">

          <div className="flex items-center gap-5 mb-8">

            <div className="w-16 h-16 rounded-[24px] bg-red-100 flex items-center justify-center">

              <AlertTriangle
                size={32}
                className="text-red-500"
              />

            </div>

            <div>

              <h2 className="text-4xl font-black text-gray-900">

                High Due Customers

              </h2>

              <p className="text-gray-500 mt-2">

                Pending balances above ₹5000

              </p>

            </div>

          </div>

          <div className="space-y-5">

            {

              dashboard.highDueCustomers?.length > 0

                ?

                dashboard.highDueCustomers.map(
                  (customer) => (

                    <div

                      key={customer._id}

                      className="bg-red-50 border border-red-100 rounded-[28px] p-6 flex flex-col lg:flex-row justify-between lg:items-center"

                    >

                      <div>

                        <h3 className="text-3xl font-black text-gray-900">

                          {

                            customer.name

                          }

                        </h3>

                        <p className="text-gray-500 mt-2">

                          {

                            customer.phone

                          }

                        </p>

                      </div>

                      <div className="mt-5 lg:mt-0 text-right">

                        <h2 className="text-4xl font-black text-red-500">

                          ₹ {

                            customer.balance

                          }

                        </h2>

                        <p className="text-red-400 mt-2">

                          Pending Amount

                        </p>

                      </div>

                    </div>

                  )
                )

                :

                <div className="bg-gray-50 rounded-[24px] p-6 text-gray-500">

                  No high due customers found

                </div>

            }

          </div>

        </div>

      </div>

    </Layout>

  );

}

export default Dashboard;