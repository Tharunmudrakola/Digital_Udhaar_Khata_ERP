import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import Layout from "../components/Layout";

import API from "../services/api";

import toast from "react-hot-toast";

import jsPDF from "jspdf";

import {

  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend

} from "recharts";

function CustomerLedger() {

  const { id } =
    useParams();

  const [ledger,
    setLedger] =
    useState(null);

  useEffect(() => {

    fetchLedger();

  }, []);

  // FETCH LEDGER

  const fetchLedger = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await API.get(

        `/customers/${id}/ledger`,

        {

          headers: {

            Authorization:
              `Bearer ${token}`

          }

        }

      );

      setLedger(
        res.data
      );

    }

    catch (error) {

      console.log(error);

    }

  };

  // DOWNLOAD PDF

  const downloadLedgerPDF =
    () => {

      const doc =
        new jsPDF();

      doc.setFontSize(24);

      doc.text(

        "Customer Ledger",

        20,
        20

      );

      doc.line(
        20,
        28,
        190,
        28
      );

      doc.setFontSize(14);

      doc.text(

        `Customer: ${
          ledger.customer.name
        }`,

        20,
        45

      );

      doc.text(

        `Phone: ${
          ledger.customer.phone
        }`,

        20,
        60

      );

      doc.text(

        `Balance: ₹ ${
          ledger.balance
        }`,

        20,
        75

      );

      let y = 100;

      ledger.transactions.forEach(
        (transaction) => {

          doc.text(

            `${transaction.type.toUpperCase()} - ₹ ${transaction.amount} - ${transaction.note}`,

            20,
            y

          );

          y += 12;

        }
      );

      doc.save(
        "ledger.pdf"
      );

    };

  // SHARE WHATSAPP

  const shareOnWhatsApp =
    () => {

      const message =

`Customer Ledger

Name: ${ledger.customer.name}

Phone: ${ledger.customer.phone}

Total Credit: ₹ ${ledger.totalCredit}

Total Debit: ₹ ${ledger.totalDebit}

Balance: ₹ ${ledger.balance}`;

      const whatsappUrl =

`https://wa.me/?text=${encodeURIComponent(message)}`;

      window.open(
        whatsappUrl,
        "_blank"
      );

    };

  // PAYMENT REMINDER

  const sendReminder =
    () => {

      if (!ledger.customer) {

        toast.error(
          "Customer not found"
        );

        return;

      }

      const message =

        `Hello ${ledger.customer.name},\n\n` +

        `Your pending balance is ₹${ledger.balance}.\n\n` +

        `Please clear the payment soon.\n\n` +

        `Thank you 🙏`;

      const encodedMessage =
        encodeURIComponent(
          message
        );

      window.open(

        `https://wa.me/91${ledger.customer.phone}?text=${encodedMessage}`,

        "_blank"

      );

    };

  if (!ledger) {

    return (

      <Layout>

        <p className="text-xl">

          Loading...

        </p>

      </Layout>

    );

  }

  // PIE CHART DATA

  const chartData = [

    {

      name: "Credit",

      value:
        ledger.totalCredit

    },

    {

      name: "Debit",

      value:
        ledger.totalDebit

    }

  ];

  // BAR GRAPH DATA

  const monthlyData = [

    {

      month: "Credit",

      amount:
        ledger.totalCredit

    },

    {

      month: "Debit",

      amount:
        ledger.totalDebit

    }

  ];

  const COLORS = [

    "#22c55e",
    "#ef4444"

  ];

  return (

    <Layout>

      <div className="space-y-8">

        {/* HEADER */}

        <div className="flex flex-col lg:flex-row justify-between gap-5">

          <div>

            <h1 className="text-5xl font-extrabold text-gray-900">

              Customer Ledger

            </h1>

            <p className="text-gray-500 mt-3 text-lg">

              Full customer transaction statement

            </p>

          </div>

          {/* ACTION BUTTONS */}

          <div className="flex flex-wrap gap-4">

            {/* PDF */}

            <button
              onClick={
                downloadLedgerPDF
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300"
            >

              Download PDF

            </button>

            {/* WHATSAPP */}

            <button
              onClick={
                shareOnWhatsApp
              }
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300"
            >

              Share WhatsApp

            </button>

            {/* REMINDER */}

            <button
              onClick={
                sendReminder
              }
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300"
            >

              Send Reminder

            </button>

          </div>

        </div>

        {/* CUSTOMER CARD */}

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">

          <h2 className="text-3xl font-bold text-gray-900">

            {ledger.customer.name}

          </h2>

          <p className="text-gray-500 mt-3">

            📞 {ledger.customer.phone}

          </p>

          <p className="text-gray-500 mt-2">

            📍 {ledger.customer.address}

          </p>

        </div>

        {/* SUMMARY */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* CREDIT */}

          <div className="bg-green-50 p-6 rounded-3xl shadow-sm">

            <h3 className="text-lg font-semibold text-green-700">

              Total Credit

            </h3>

            <p className="text-4xl font-bold mt-4 text-green-600">

              ₹ {ledger.totalCredit}

            </p>

          </div>

          {/* DEBIT */}

          <div className="bg-red-50 p-6 rounded-3xl shadow-sm">

            <h3 className="text-lg font-semibold text-red-700">

              Total Debit

            </h3>

            <p className="text-4xl font-bold mt-4 text-red-600">

              ₹ {ledger.totalDebit}

            </p>

          </div>

          {/* BALANCE */}

          <div className="bg-blue-50 p-6 rounded-3xl shadow-sm">

            <h3 className="text-lg font-semibold text-blue-700">

              Balance

            </h3>

            <p className="text-4xl font-bold mt-4 text-blue-600">

              ₹ {ledger.balance}

            </p>

          </div>

        </div>

        {/* PIE CHART */}

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">

          <h2 className="text-3xl font-bold mb-8 text-gray-900">

            Customer Analytics

          </h2>

          <div className="h-[400px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <PieChart>

                <Pie

                  data={chartData}

                  cx="50%"

                  cy="50%"

                  outerRadius={130}

                  dataKey="value"

                  label

                >

                  {

                    chartData.map(
                      (entry, index) => (

                        <Cell

                          key={`cell-${index}`}

                          fill={
                            COLORS[index]
                          }

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

        {/* BAR GRAPH */}

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">

          <h2 className="text-3xl font-bold mb-8 text-gray-900">

            Monthly Financial Graph

          </h2>

          <div className="h-[400px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={monthlyData}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="month"
                />

                <YAxis />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="amount"
                  fill="#2563eb"
                  radius={[10, 10, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* TRANSACTIONS */}

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">

          <h2 className="text-3xl font-bold mb-8 text-gray-900">

            Transaction History

          </h2>

          <div className="space-y-5">

            {

              ledger.transactions.map(
                (transaction) => (

                  <div
                    key={transaction._id}
                    className="border border-gray-100 p-5 rounded-2xl flex flex-col lg:flex-row justify-between lg:items-center gap-5"
                  >

                    {/* LEFT */}

                    <div>

                      <h3 className="text-xl font-bold text-gray-900">

                        {transaction.note}

                      </h3>

                      <p className="text-gray-500 mt-2">

                        {

                          new Date(
                            transaction.createdAt
                          ).toLocaleDateString()

                        }

                      </p>

                    </div>

                    {/* RIGHT */}

                    <div className="text-right">

                      <p

                        className={

                          transaction.type === "credit"

                            ? "text-green-600 text-2xl font-bold"

                            : "text-red-600 text-2xl font-bold"

                        }

                      >

                        ₹ {transaction.amount}

                      </p>

                      <p className="text-gray-500 capitalize mt-1">

                        {transaction.type}

                      </p>

                    </div>

                  </div>

                )
              )

            }

          </div>

        </div>

      </div>

    </Layout>

  );

}

export default CustomerLedger;