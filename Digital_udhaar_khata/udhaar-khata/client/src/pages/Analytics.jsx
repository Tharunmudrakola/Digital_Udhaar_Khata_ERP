import {

  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend

} from "recharts";

import { useEffect, useState } from "react";

import Layout from "../components/Layout";

import API from "../services/api";

import {

  TrendingUp,
  Wallet,
  CircleDollarSign,
  FileText,
  Activity,
  PieChart as PieChartIcon

} from "lucide-react";

function Analytics() {

  const [bills, setBills] =
    useState([]);

  // ================= FETCH =================

  useEffect(() => {

    fetchBills();

  }, []);

  const fetchBills =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await API.get(

            "/bills",

            {

              headers: {

                Authorization:
                  `Bearer ${token}`

              }

            }

          );

        setBills(
          res.data
        );

      }

      catch (error) {

        console.log(error);

      }

    };

  // ================= TOTALS =================

  const totalRevenue =

    bills.reduce(

      (acc, bill) =>

        acc + bill.totalAmount,

      0

    );

  const paidRevenue =

    bills

      .filter(

        (bill) =>

          bill.paymentStatus === "paid"

      )

      .reduce(

        (acc, bill) =>

          acc + bill.totalAmount,

        0

      );

  const pendingRevenue =

    bills

      .filter(

        (bill) =>

          bill.paymentStatus === "pending"

      )

      .reduce(

        (acc, bill) =>

          acc + bill.totalAmount,

        0

      );

  // ================= BAR DATA =================

  const revenueData = [

    {

      name: "Paid",

      amount:
        paidRevenue

    },

    {

      name: "Pending",

      amount:
        pendingRevenue

    }

  ];

  // ================= PIE DATA =================

  const pieData = [

    {

      name: "Paid",

      value:
        paidRevenue

    },

    {

      name: "Pending",

      value:
        pendingRevenue

    }

  ];

  // UPDATED COLORS

  const COLORS = [

    "#8b5cf6",

    "#ec4899"

  ];

  return (

    <Layout>

      <div className="min-h-screen bg-[#f4f7fb] p-4 md:p-6 lg:p-8 space-y-8">

        {/* HERO HEADER */}

        <div className="relative overflow-hidden rounded-[40px]

        bg-gradient-to-r

        from-[#ff512f]

        via-[#dd2476]

        to-[#6a11cb]

        p-8 lg:p-10

        shadow-[0_20px_80px_rgba(221,36,118,0.25)]">

          {/* GLOW */}

          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/10 blur-3xl rounded-full">

          </div>

          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-pink-400/20 blur-3xl rounded-full">

          </div>

          <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-10">

            {/* LEFT */}

            <div>

              <div className="flex items-center gap-5">

                <div className="w-20 h-20 rounded-[28px]

                bg-white/15

                border border-white/20

                backdrop-blur-2xl

                flex items-center justify-center">

                  <TrendingUp
                    size={38}
                    className="text-white"
                  />

                </div>

                <div>

                  <h1 className="text-5xl lg:text-6xl font-black text-white">

                    Sales Analytics

                  </h1>

                  <p className="text-white/80 text-lg mt-4">

                    Monitor your business revenue and invoice insights

                  </p>

                </div>

              </div>

            </div>

            {/* RIGHT */}

            <div className="grid grid-cols-2 gap-5">

              <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[30px] p-6 min-w-[180px]">

                <p className="text-white/70">

                  Paid Revenue

                </p>

                <h2 className="text-4xl font-black text-white mt-4">

                  ₹ {paidRevenue}

                </h2>

              </div>

              <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[30px] p-6 min-w-[180px]">

                <p className="text-white/70">

                  Invoices

                </p>

                <h2 className="text-4xl font-black text-white mt-4">

                  {bills.length}

                </h2>

              </div>

            </div>

          </div>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          {/* TOTAL */}

          <div className="bg-gradient-to-br from-white to-[#f8fafc]

          rounded-[30px]

          p-7

          border border-gray-100

          shadow-lg">

            <div className="flex justify-between">

              <div>

                <h3 className="text-gray-500 text-lg">

                  Total Revenue

                </h3>

                <h1 className="text-5xl font-black text-violet-600 mt-5">

                  ₹ {totalRevenue}

                </h1>

              </div>

              <div className="w-16 h-16 rounded-[24px] bg-violet-100 flex items-center justify-center">

                <Wallet
                  size={32}
                  className="text-violet-600"
                />

              </div>

            </div>

          </div>

          {/* PAID */}

          <div className="bg-gradient-to-br from-white to-[#f8fafc]

          rounded-[30px]

          p-7

          border border-gray-100

          shadow-lg">

            <div className="flex justify-between">

              <div>

                <h3 className="text-gray-500 text-lg">

                  Paid Revenue

                </h3>

                <h1 className="text-5xl font-black text-cyan-500 mt-5">

                  ₹ {paidRevenue}

                </h1>

              </div>

              <div className="w-16 h-16 rounded-[24px] bg-cyan-100 flex items-center justify-center">

                <CircleDollarSign
                  size={32}
                  className="text-cyan-500"
                />

              </div>

            </div>

          </div>

          {/* PENDING */}

          <div className="bg-gradient-to-br from-white to-[#f8fafc]

          rounded-[30px]

          p-7

          border border-gray-100

          shadow-lg">

            <div className="flex justify-between">

              <div>

                <h3 className="text-gray-500 text-lg">

                  Pending Revenue

                </h3>

                <h1 className="text-5xl font-black text-pink-500 mt-5">

                  ₹ {pendingRevenue}

                </h1>

              </div>

              <div className="w-16 h-16 rounded-[24px] bg-pink-100 flex items-center justify-center">

                <Activity
                  size={32}
                  className="text-pink-500"
                />

              </div>

            </div>

          </div>

          {/* INVOICES */}

          <div className="bg-gradient-to-br from-white to-[#f8fafc]

          rounded-[30px]

          p-7

          border border-gray-100

          shadow-lg">

            <div className="flex justify-between">

              <div>

                <h3 className="text-gray-500 text-lg">

                  Total Invoices

                </h3>

                <h1 className="text-5xl font-black text-indigo-600 mt-5">

                  {bills.length}

                </h1>

              </div>

              <div className="w-16 h-16 rounded-[24px] bg-indigo-100 flex items-center justify-center">

                <FileText
                  size={32}
                  className="text-indigo-600"
                />

              </div>

            </div>

          </div>

        </div>

        {/* CHARTS */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

          {/* BAR CHART */}

          <div className="bg-gradient-to-br from-white to-[#f8fafc]

          rounded-[34px]

          p-7

          border border-gray-100

          shadow-lg">

            <div className="flex items-center justify-between mb-8">

              <div>

                <h2 className="text-3xl font-black text-gray-900">

                  Revenue Overview

                </h2>

                <p className="text-gray-500 mt-2">

                  Paid vs pending revenue

                </p>

              </div>

              <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center">

                <TrendingUp
                  size={26}
                  className="text-violet-600"
                />

              </div>

            </div>

            <div className="h-[350px]">

              <ResponsiveContainer
                width="100%"
                height={350}
              >

                <BarChart
                  data={revenueData}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                  />

                  <XAxis
                    dataKey="name"
                  />

                  <YAxis />

                  <Tooltip />

                  <Legend />

                  <Bar
                    dataKey="amount"
                    fill="#8b5cf6"
                    radius={[12, 12, 0, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>

          {/* PIE CHART */}

          <div className="bg-gradient-to-br from-white to-[#f8fafc]

          rounded-[34px]

          p-7

          border border-gray-100

          shadow-lg">

            <div className="flex items-center justify-between mb-8">

              <div>

                <h2 className="text-3xl font-black text-gray-900">

                  Payment Distribution

                </h2>

                <p className="text-gray-500 mt-2">

                  Revenue breakdown analysis

                </p>

              </div>

              <div className="w-14 h-14 rounded-2xl bg-pink-100 flex items-center justify-center">

                <PieChartIcon
                  size={26}
                  className="text-pink-500"
                />

              </div>

            </div>

            <div className="h-[350px]">

              <ResponsiveContainer
                width="100%"
                height={350}
              >

                <PieChart>

                  <Pie
                    data={pieData}
                    dataKey="value"
                    outerRadius={110}
                    label
                  >

                    {

                      pieData.map(
                        (
                          entry,
                          index
                        ) => (

                          <Cell
                            key={index}
                            fill={
                              COLORS[index]
                            }
                          />

                        )
                      )

                    }

                  </Pie>

                  <Tooltip />

                  <Legend />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>

      </div>

    </Layout>

  );

}

export default Analytics;