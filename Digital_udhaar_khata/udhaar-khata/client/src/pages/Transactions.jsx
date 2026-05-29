import { useEffect, useMemo, useState } from "react";

import Layout from "../components/Layout";

import API from "../services/api";

import toast from "react-hot-toast";

import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";

import {

  CheckCircle,
  XCircle,
  Download,
  Pencil,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  Activity,
  Search,
  Users,
  PlusCircle

} from "lucide-react";

function Transactions() {

  const [transactions,

    setTransactions] = useState([]);

  const [customers,

    setCustomers] = useState([]);

  const [search,

    setSearch] = useState("");

  const [formData,

    setFormData] = useState({

      customerId: "",

      type: "credit",

      amount: "",

      note: "",

      status: "Pending"

    });

  const [editingId,

    setEditingId] = useState(null);

  const [editData,

    setEditData] = useState({

      type: "",

      amount: "",

      note: "",

      status: ""

    });

  useEffect(() => {

    fetchTransactions();

    fetchCustomers();

  }, []);

  // FETCH TRANSACTIONS

  const fetchTransactions =
    async () => {

      try {

        const token =
          localStorage.getItem("token");

        const res =
          await API.get(

            "/transactions",

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

        console.log(error);

      }

    };

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

        setCustomers(res.data);

      }

      catch (error) {

        console.log(error);

      }

    };

  // HANDLE INPUT

  const handleChange =
    (e) => {

      setFormData({

        ...formData,

        [e.target.name]:
          e.target.value

      });

    };

  // ADD TRANSACTION

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        const token =
          localStorage.getItem("token");

        await API.post(

          "/transactions",

          formData,

          {

            headers: {

              Authorization:
                `Bearer ${token}`

            }

          }

        );

        toast.success(
          "Transaction Added"
        );

        setFormData({

          customerId: "",

          type: "credit",

          amount: "",

          note: "",

          status: "Pending"

        });

        fetchTransactions();

      }

      catch (error) {

        console.log(error);

        toast.error(
          "Failed to add transaction"
        );

      }

    };

  // EDIT

  const handleEdit =
    (transaction) => {

      setEditingId(
        transaction._id
      );

      setEditData({

        type:
          transaction.type,

        amount:
          transaction.amount,

        note:
          transaction.note,

        status:
          transaction.status

      });

    };

  // UPDATE

  const handleUpdate =
    async (id) => {

      try {

        const token =
          localStorage.getItem("token");

        await API.put(

          `/transactions/${id}`,

          editData,

          {

            headers: {

              Authorization:
                `Bearer ${token}`

            }

          }

        );

        toast.success(
          "Transaction Updated"
        );

        setEditingId(null);

        fetchTransactions();

      }

      catch (error) {

        console.log(error);

        toast.error(
          "Update Failed"
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

          `/transactions/${id}`,

          {

            headers: {

              Authorization:
                `Bearer ${token}`

            }

          }

        );

        toast.success(
          "Transaction Deleted"
        );

        fetchTransactions();

      }

      catch (error) {

        console.log(error);

      }

    };

  // APPROVE

  const approvePayment =
    async (id) => {

      try {

        const token =
          localStorage.getItem("token");

        await API.put(

          `/transactions/approve-payment/${id}`,

          {},

          {

            headers: {

              Authorization:
                `Bearer ${token}`

            }

          }

        );

        toast.success(
          "Payment Approved"
        );

        fetchTransactions();

      }

      catch (error) {

        console.log(error);

      }

    };

  // REJECT

  const rejectPayment =
    async (id) => {

      try {

        const token =
          localStorage.getItem("token");

        await API.put(

          `/transactions/reject-payment/${id}`,

          {},

          {

            headers: {

              Authorization:
                `Bearer ${token}`

            }

          }

        );

        toast.success(
          "Payment Rejected"
        );

        fetchTransactions();

      }

      catch (error) {

        console.log(error);

      }

    };

  // PDF

  const downloadPDF =
    () => {

      const doc =
        new jsPDF();

      doc.text(
        "Transactions",
        14,
        20
      );

      const tableData =
        transactions.map(
          (t) => [

            t.customer?.name,

            t.type,

            t.amount,

            t.status,

            t.note

          ]
        );

      autoTable(doc, {

        head: [[

          "Customer",

          "Type",

          "Amount",

          "Status",

          "Note"

        ]],

        body: tableData,

        startY: 30

      });

      doc.save(
        "transactions.pdf"
      );

    };

  // FILTERED

  const filteredTransactions =

    transactions.filter((t) =>

      t.customer?.name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )

    );

  // TOTALS

  const totalCredit = useMemo(() => {

    return transactions

      .filter(
        (t) =>
          t.type === "credit"
      )

      .reduce(
        (acc, curr) =>
          acc + curr.amount,
        0
      );

  }, [transactions]);

  const totalDebit = useMemo(() => {

    return transactions

      .filter(
        (t) =>
          t.type === "debit"
      )

      .reduce(
        (acc, curr) =>
          acc + curr.amount,
        0
      );

  }, [transactions]);

  return (

    <Layout>

      <div className="space-y-8

      bg-[#eef2ff] dark:bg-[#0b1220]

      min-h-screen p-2 sm:p-4 lg:p-6">

        {/* HERO */}

        <div className="relative overflow-hidden

        rounded-[28px] sm:rounded-[40px]

        bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600

        p-5 sm:p-8 lg:p-10 text-white

        shadow-[0_20px_80px_rgba(79,70,229,0.35)]">

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

                rounded-[28px] bg-white/15

                backdrop-blur-xl border border-white/20

                flex items-center justify-center shadow-xl">

                  <Activity
                    size={38}
                    className="text-white"
                  />

                </div>

                <div>

                  <h1 className="text-3xl sm:text-5xl lg:text-6xl

                  font-black tracking-tight leading-tight">

                    Transactions

                  </h1>

                  <p className="text-white/80

                  text-base sm:text-lg mt-3">

                    Manage customer payments professionally

                  </p>

                </div>

              </div>

            </div>

            {/* RIGHT */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="bg-white/10 backdrop-blur-xl

              border border-white/20 rounded-[28px]

              p-5 min-w-full sm:min-w-[220px]">

                <p className="text-white/70 text-sm">

                  Total Transactions

                </p>

                <h2 className="text-4xl sm:text-5xl font-black mt-3">

                  {transactions.length}

                </h2>

              </div>

              <div className="bg-white/10 backdrop-blur-xl

              border border-white/20 rounded-[28px]

              p-5 min-w-full sm:min-w-[220px]">

                <p className="text-white/70 text-sm">

                  Active Customers

                </p>

                <h2 className="text-4xl sm:text-5xl font-black mt-3">

                  {customers.length}

                </h2>

              </div>

            </div>

          </div>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* CREDIT */}

          <div className="rounded-[30px] p-6 sm:p-8

          bg-gradient-to-br from-green-500 to-emerald-400

          text-white shadow-2xl">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-lg sm:text-2xl font-semibold">

                  Total Credit

                </p>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl

                font-black mt-5">

                  ₹ {totalCredit}

                </h1>

              </div>

              <Wallet size={60} />

            </div>

          </div>

          {/* DEBIT */}

          <div className="rounded-[30px] p-6 sm:p-8

          bg-gradient-to-br from-red-500 to-orange-400

          text-white shadow-2xl">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-lg sm:text-2xl font-semibold">

                  Total Debit

                </p>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl

                font-black mt-5">

                  ₹ {totalDebit}

                </h1>

              </div>

              <Wallet size={60} />

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

            placeholder="Search customer transactions..."

            value={search}

            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }

            className="w-full lg:w-[420px]

            pl-14 pr-5 py-4 rounded-2xl

            border border-gray-200

            bg-white/90 backdrop-blur-xl

            dark:bg-[#111827]

            dark:border-gray-700

            dark:text-white outline-none"

          />

        </div>

        {/* FORM */}

        <form

          onSubmit={handleSubmit}

          className="bg-white/90 backdrop-blur-xl

          dark:bg-[#111827]

          p-5 sm:p-8 rounded-[32px]

          border border-gray-100 dark:border-gray-700

          shadow-sm"

        >

          <div className="flex flex-col lg:flex-row

          justify-between lg:items-center gap-4 mb-8">

            <div>

              <h2 className="text-2xl sm:text-3xl font-black

              dark:text-white">

                Add Transaction

              </h2>

              <p className="text-gray-500 mt-2">

                Create new customer transaction

              </p>

            </div>

            <div className="w-14 h-14 rounded-2xl

            bg-violet-100 flex items-center justify-center">

              <PlusCircle
                size={28}
                className="text-violet-600"
              />

            </div>

          </div>

          <div className="grid grid-cols-1

          md:grid-cols-2 xl:grid-cols-5 gap-5">

            {/* CUSTOMER */}

            <select

              name="customerId"

              value={formData.customerId}

              onChange={handleChange}

              className="border p-4 rounded-2xl

              bg-white dark:bg-[#1f2937]

              dark:border-gray-700 dark:text-white"

              required

            >

              <option value="">

                Select Customer

              </option>

              {

                customers.map(
                  (customer) => (

                    <option

                      key={customer._id}

                      value={customer._id}

                    >

                      {customer.name}

                    </option>

                  )
                )

              }

            </select>

            {/* TYPE */}

            <select

              name="type"

              value={formData.type}

              onChange={handleChange}

              className="border p-4 rounded-2xl

              bg-white dark:bg-[#1f2937]

              dark:border-gray-700 dark:text-white"

            >

              <option value="credit">

                Credit

              </option>

              <option value="debit">

                Debit

              </option>

            </select>

            {/* AMOUNT */}

            <input

              type="number"

              name="amount"

              placeholder="Amount"

              value={formData.amount}

              onChange={handleChange}

              className="border p-4 rounded-2xl

              bg-white dark:bg-[#1f2937]

              dark:border-gray-700 dark:text-white"

              required

            />

            {/* NOTE */}

            <input

              type="text"

              name="note"

              placeholder="Note"

              value={formData.note}

              onChange={handleChange}

              className="border p-4 rounded-2xl

              bg-white dark:bg-[#1f2937]

              dark:border-gray-700 dark:text-white"

            />

            {/* STATUS */}

            <select

              name="status"

              value={formData.status}

              onChange={handleChange}

              className="border p-4 rounded-2xl

              bg-white dark:bg-[#1f2937]

              dark:border-gray-700 dark:text-white"

            >

              <option value="Pending">

                Pending

              </option>

              <option value="Paid">

                Paid

              </option>

            </select>

          </div>

          <button

            className="mt-6 w-full sm:w-auto

            bg-gradient-to-r from-violet-600 to-indigo-600

            text-white px-8 py-4 rounded-2xl font-bold"

          >

            Add Transaction

          </button>

        </form>

        {/* HISTORY */}

        <div className="bg-white/90 backdrop-blur-xl

        dark:bg-[#111827]

        p-5 sm:p-8 rounded-[35px]

        shadow-xl border border-gray-100 dark:border-gray-700">

          <div className="flex flex-col lg:flex-row

          justify-between lg:items-center gap-5 mb-10">

            <div>

              <h2 className="text-3xl sm:text-4xl font-black

              text-gray-900 dark:text-white">

                Transaction History

              </h2>

              <p className="text-gray-500 mt-2">

                Monitor all customer transaction activity

              </p>

            </div>

            <button

              onClick={downloadPDF}

              className="bg-red-500 hover:bg-red-600

              text-white px-6 py-4 rounded-2xl

              flex items-center gap-3 w-full sm:w-auto

              justify-center"

            >

              <Download size={20} />

              Download PDF

            </button>

          </div>

          <div className="space-y-6">

            {

              filteredTransactions.map(
                (transaction) => (

                  <div

                    key={transaction._id}

                    className="bg-white dark:bg-[#1e293b]

                    rounded-[30px] p-5 sm:p-7 border

                    dark:border-gray-700 shadow-lg"

                  >

                    {

                      editingId === transaction._id

                        ? (

                          <div className="space-y-5">

                            <input

                              type="number"

                              value={editData.amount}

                              onChange={(e) =>
                                setEditData({

                                  ...editData,

                                  amount:
                                    e.target.value

                                })
                              }

                              className="border p-4 rounded-2xl

                              w-full dark:bg-[#111827]

                              dark:border-gray-700 dark:text-white"

                            />

                            <input

                              type="text"

                              value={editData.note}

                              onChange={(e) =>
                                setEditData({

                                  ...editData,

                                  note:
                                    e.target.value

                                })
                              }

                              className="border p-4 rounded-2xl

                              w-full dark:bg-[#111827]

                              dark:border-gray-700 dark:text-white"

                            />

                            <div className="flex flex-wrap gap-4">

                              <button

                                onClick={() =>
                                  handleUpdate(
                                    transaction._id
                                  )
                                }

                                className="bg-green-500 text-white

                                px-5 py-3 rounded-2xl"

                              >

                                Save

                              </button>

                              <button

                                onClick={() =>
                                  setEditingId(null)
                                }

                                className="bg-gray-500 text-white

                                px-5 py-3 rounded-2xl"

                              >

                                Cancel

                              </button>

                            </div>

                          </div>

                        )

                        : (

                          <div className="flex flex-col lg:flex-row

                          lg:justify-between gap-8">

                            {/* LEFT */}

                            <div>

                              <div className="flex flex-wrap items-center gap-4">

                                <span

                                  className={`px-4 py-2 rounded-full

                                  text-sm font-bold text-white

                                  ${

                                    transaction.type === "credit"

                                      ? "bg-red-500"

                                      : "bg-green-500"

                                  }`}

                                >

                                  {

                                    transaction.type === "credit"

                                      ? "CREDIT"

                                      : "DEBIT"

                                  }

                                </span>

                                <h2 className="text-2xl sm:text-3xl

                                font-black text-gray-900 dark:text-white">

                                  {

                                    transaction.customer?.name

                                  }

                                </h2>

                              </div>

                              <p className="text-gray-500 mt-4 text-lg">

                                {

                                  transaction.note ||

                                  "No Description"

                                }

                              </p>

                              <p className="text-gray-400 mt-3">

                                {

                                  new Date(

                                    transaction.createdAt

                                  ).toLocaleDateString()

                                }

                              </p>

                            </div>

                            {/* RIGHT */}

                            <div className="lg:text-right">

                              <div className="flex items-center

                              lg:justify-end gap-2">

                                {

                                  transaction.type === "credit"

                                    ? (

                                      <ArrowUpRight

                                        className="text-red-500"

                                        size={28}

                                      />

                                    ) : (

                                      <ArrowDownLeft

                                        className="text-green-500"

                                        size={28}

                                      />

                                    )

                                }

                                <h1

                                  className={`text-4xl sm:text-5xl

                                  font-black

                                  ${

                                    transaction.type === "credit"

                                      ? "text-red-500"

                                      : "text-green-500"

                                  }`}

                                >

                                  {

                                    transaction.type === "credit"

                                      ? "+"

                                      : "-"

                                  }

                                  ₹ {transaction.amount}

                                </h1>

                              </div>

                              {/* STATUS */}

                              <span

                                className={`inline-block mt-4

                                px-5 py-2 rounded-full

                                text-white font-bold

                                ${

                                  transaction.status === "Paid"

                                    ? "bg-green-500"

                                    : transaction.status === "Waiting"

                                    ? "bg-yellow-500"

                                    : transaction.status === "Rejected"

                                    ? "bg-red-500"

                                    : "bg-orange-500"

                                }`}

                              >

                                {

                                  transaction.status

                                }

                              </span>

                              {/* IMAGE */}

                              {

                                transaction.paymentScreenshot && (

                                  <div className="mt-5">

                                    <img

                                      src={`http://localhost:5000${transaction.paymentScreenshot}`}

                                      alt="payment"

                                      className="w-32 h-32 sm:w-40 sm:h-40

                                      rounded-2xl object-cover border lg:ml-auto"

                                    />

                                  </div>

                                )

                              }

                              {/* APPROVAL */}

                              {

                                transaction.status === "Waiting" && (

                                  <div className="flex flex-wrap gap-3

                                  mt-5 lg:justify-end">

                                    <button

                                      onClick={() =>
                                        approvePayment(
                                          transaction._id
                                        )
                                      }

                                      className="bg-green-500 hover:bg-green-600

                                      text-white px-5 py-3 rounded-2xl

                                      flex items-center gap-2"

                                    >

                                      <CheckCircle size={18} />

                                      Approve

                                    </button>

                                    <button

                                      onClick={() =>
                                        rejectPayment(
                                          transaction._id
                                        )
                                      }

                                      className="bg-red-500 hover:bg-red-600

                                      text-white px-5 py-3 rounded-2xl

                                      flex items-center gap-2"

                                    >

                                      <XCircle size={18} />

                                      Reject

                                    </button>

                                  </div>

                                )

                              }

                              {/* ACTIONS */}

                              <div className="flex flex-wrap gap-3

                              mt-5 lg:justify-end">

                                <button

                                  onClick={() =>
                                    handleEdit(
                                      transaction
                                    )
                                  }

                                  className="bg-blue-500 hover:bg-blue-600

                                  text-white px-5 py-3 rounded-2xl

                                  flex items-center gap-2"

                                >

                                  <Pencil size={18} />

                                  Edit

                                </button>

                                <button

                                  onClick={() =>
                                    handleDelete(
                                      transaction._id
                                    )
                                  }

                                  className="bg-red-500 hover:bg-red-600

                                  text-white px-5 py-3 rounded-2xl

                                  flex items-center gap-2"

                                >

                                  <Trash2 size={18} />

                                  Delete

                                </button>

                              </div>

                            </div>

                          </div>

                        )

                    }

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

export default Transactions;