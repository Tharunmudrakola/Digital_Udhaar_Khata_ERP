import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  Upload,
  Clock3,
  CheckCircle2,
  Search,
  Activity,
  LogOut
} from "lucide-react";

import API from "../services/api";

import toast from "react-hot-toast";

function CustomerDashboard() {

  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );

  const [transactions,
    setTransactions] = useState([]);

  const [filter,
    setFilter] = useState("all");

  const [search,
    setSearch] = useState("");

  useEffect(() => {

    fetchTransactions();

  }, []);

  const fetchTransactions = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await API.get(
        "/transactions/my-transactions",
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setTransactions(res.data);

    }

    catch (error) {

      toast.error(
        "Failed to fetch transactions"
      );

    }

  };

  const uploadScreenshot =
    async (id, file) => {

      try {

        const token =
          localStorage.getItem("token");

        const formData =
          new FormData();

        formData.append(
          "paymentScreenshot",
          file
        );

        await API.put(
          `/transactions/upload-payment/${id}`,
          formData,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
              "Content-Type":
                "multipart/form-data"
            }
          }
        );

        toast.success(
          "Payment uploaded successfully"
        );

        fetchTransactions();

      }

      catch (error) {

        toast.error("Upload failed");

      }

    };

  const totalPending = useMemo(() => {

    return transactions
      .filter(
        (t) =>
          t.status === "Pending"
      )
      .reduce(
        (acc, curr) =>
          acc + curr.amount,
        0
      );

  }, [transactions]);

  const totalPaid = useMemo(() => {

    return transactions
      .filter(
        (t) =>
          t.status === "Paid"
      )
      .reduce(
        (acc, curr) =>
          acc + curr.amount,
        0
      );

  }, [transactions]);

  const totalWaiting = useMemo(() => {

    return transactions
      .filter(
        (t) =>
          t.status === "Waiting"
      ).length;

  }, [transactions]);

  const filteredTransactions =
    transactions.filter((t) => {

      const matchesSearch =
        t.note?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesFilter =
        filter === "all"
          ? true
          : filter === "paid"
          ? t.status === "Paid"
          : filter === "pending"
          ? t.status === "Pending"
          : filter === "credit"
          ? t.type === "credit"
          : filter === "debit"
          ? t.type === "debit"
          : true;

      return matchesSearch && matchesFilter;

    });

  const getButtonStyle = (type) => {

    return filter === type

      ? "bg-gradient-to-r from-[#ff512f] via-[#dd2476] to-[#6a11cb] text-white shadow-xl scale-105"

      : "bg-[#162033] text-gray-200";

  };

  const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("userInfo");

    window.location.href = "/";

  };

  return (

    <div className="min-h-screen

    bg-[#071120]

    p-3 sm:p-5 lg:p-6 relative">

      {/* HERO */}

      <div className="rounded-[32px]

      bg-gradient-to-r

      from-[#ff512f]

      via-[#dd2476]

      to-[#6a11cb]

      p-6 lg:p-10 text-white mb-8">

        <div className="flex flex-col lg:flex-row

        justify-between gap-8">

          <div>

            <div className="flex items-center gap-5">

              <div className="w-16 h-16

              rounded-[24px]

              bg-white/20

              flex items-center justify-center">

                <Activity size={34} />

              </div>

              <div>

                <h1 className="text-4xl lg:text-6xl

                font-black leading-tight">

                  Welcome
                  <br />
                  {userInfo?.name}

                </h1>

                <p className="text-white/80 mt-3">

                  Track your payments professionally

                </p>

              </div>

            </div>

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="bg-white/10

            rounded-[24px]

            p-5 min-w-[140px]">

              <p className="text-white/70 text-sm">

                Total Transactions

              </p>

              <h2 className="text-4xl font-black mt-3">

                {transactions.length}

              </h2>

            </div>

            <div className="bg-white/10

            rounded-[24px]

            p-5 min-w-[140px]">

              <p className="text-white/70 text-sm">

                Waiting Payments

              </p>

              <h2 className="text-4xl font-black mt-3">

                {totalWaiting}

              </h2>

            </div>

          </div>

        </div>

      </div>

      {/* SUMMARY */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="rounded-[28px]

        bg-gradient-to-br

        from-orange-500 to-amber-400

        p-7 text-white">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-lg font-semibold">

                Total Pending

              </p>

              <h1 className="text-5xl font-black mt-5">

                ₹ {totalPending}

              </h1>

            </div>

            <Clock3 size={50} />

          </div>

        </div>

        <div className="rounded-[28px]

        bg-gradient-to-br

        from-teal-500 to-cyan-400

        p-7 text-white">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-lg font-semibold">

                Total Paid

              </p>

              <h1 className="text-5xl font-black mt-5">

                ₹ {totalPaid}

              </h1>

            </div>

            <CheckCircle2 size={50} />

          </div>

        </div>

        <div className="rounded-[28px]

        bg-gradient-to-br

        from-fuchsia-500 to-violet-500

        p-7 text-white">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-lg font-semibold">

                Total Activity

              </p>

              <h1 className="text-5xl font-black mt-5">

                {transactions.length}

              </h1>

            </div>

            <TrendingUp size={50} />

          </div>

        </div>

      </div>

      {/* SEARCH */}

      <div className="relative mb-6">

        <Search
          size={18}
          className="absolute left-5 top-1/2
          -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full lg:w-[420px]

          bg-[#162033]

          border border-[#26344f]

          text-white

          pl-14 pr-5 py-4

          rounded-2xl outline-none"
        />

      </div>

      {/* FILTERS */}

      <div className="flex flex-wrap gap-3 mb-8">

        {

          ["all", "paid", "pending", "credit", "debit"]

            .map((item) => (

              <button
                key={item}
                onClick={() =>
                  setFilter(item)
                }
                className={`px-5 py-3 rounded-2xl

                font-bold transition-all duration-300

                ${getButtonStyle(item)}`}
              >

                {

                  item.charAt(0)
                    .toUpperCase()

                  +

                  item.slice(1)

                }

              </button>

            ))

        }

      </div>

      {/* TRANSACTION HISTORY */}

      <div className="bg-[#101827]

      border border-[#1f2b43]

      rounded-[32px]

      p-6 shadow-2xl">

        <h2 className="text-4xl

        font-black text-white mb-8">

          Transaction History

        </h2>

        {

          filteredTransactions.length === 0 ? (

            <div className="text-center py-20">

              <h1 className="text-3xl

              font-bold text-gray-500">

                No Transactions Found

              </h1>

            </div>

          ) : (

            <div className="space-y-5">

              {

                filteredTransactions.map((transaction) => (

                  <div
                    key={transaction._id}
                    className="bg-[#162033]

                    border border-[#26344f]

                    rounded-[26px]

                    p-6 hover:scale-[1.01]

                    transition-all duration-300"
                  >

                    <div className="flex flex-col

                    lg:flex-row

                    justify-between

                    lg:items-center gap-6">

                      {/* LEFT */}

                      <div>

                        <div className="flex items-center

                        gap-4 mb-3">

                          <span
                            className={`px-4 py-2 rounded-full

                            text-xs font-bold

                            text-white tracking-wider

                            ${
                              transaction.type === "credit"
                                ? "bg-red-500"
                                : "bg-emerald-500"
                            }`}
                          >

                            {
                              transaction.type === "credit"
                                ? "CREDIT"
                                : "DEBIT"
                            }

                          </span>

                          <h2 className="text-2xl

                          font-black text-white">

                            {
                              transaction.note
                                ? transaction.note
                                : "Transaction"
                            }

                          </h2>

                        </div>

                        <p className="text-gray-400 text-sm">

                          {
                            new Date(
                              transaction.createdAt
                            ).toLocaleString()
                          }

                        </p>

                      </div>

                      {/* RIGHT */}

                      <div className="lg:text-right">

                        <h1
                          className={`text-5xl font-black

                          ${
                            transaction.type === "credit"
                              ? "text-red-400"
                              : "text-emerald-400"
                          }`}
                        >

                          ₹ {transaction.amount}

                        </h1>

                        <div className="mt-4">

                          <span
                            className={`px-5 py-2 rounded-full

                            text-sm font-bold text-white

                            ${
                              transaction.status === "Paid"
                                ? "bg-emerald-500"

                                : transaction.status === "Pending"
                                ? "bg-orange-500"

                                : transaction.status === "Waiting"
                                ? "bg-yellow-500"

                                : "bg-red-500"
                            }`}
                          >

                            {transaction.status}

                          </span>

                        </div>

                        {

                          transaction.status === "Pending" && (

                            <div className="mt-5">

                              <label className="inline-flex

                              items-center gap-2

                              bg-gradient-to-r

                              from-[#ff512f]

                              via-[#dd2476]

                              to-[#6a11cb]

                              text-white px-5 py-3

                              rounded-2xl cursor-pointer">

                                <Upload size={18} />

                                Upload Payment

                                <input
                                  type="file"
                                  hidden
                                  accept="image/*"
                                  onChange={(e) =>
                                    uploadScreenshot(
                                      transaction._id,
                                      e.target.files[0]
                                    )
                                  }
                                />

                              </label>

                            </div>

                          )

                        }

                      </div>

                    </div>

                  </div>

                ))

              }

            </div>

          )

        }

      </div>

      {/* LOGOUT */}

      <div className="fixed bottom-6 right-6 z-[9999]">

        <button

          onClick={logout}

          className="flex items-center gap-3

          bg-gradient-to-r

          from-red-500 via-pink-500 to-rose-500

          hover:scale-105 transition-all duration-300

          text-white font-bold

          px-6 py-4 rounded-2xl

          shadow-[0_10px_40px_rgba(239,68,68,0.45)]"

        >

          <LogOut size={20} />

          Logout

        </button>

      </div>

    </div>

  );

}

export default CustomerDashboard;