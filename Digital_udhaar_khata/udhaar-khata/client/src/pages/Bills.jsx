import { useEffect, useState } from "react";

import Layout from "../components/Layout";

import API from "../services/api";

import toast from "react-hot-toast";

import jsPDF from "jspdf";

import * as XLSX from "xlsx";

import { saveAs } from "file-saver";

import {

  Receipt,
  Search,
  Download,
  Trash2,
  Send,
  FileSpreadsheet,
  PlusCircle,
  Wallet,
  Activity,
  Users,
  CalendarDays

} from "lucide-react";

function Bills() {

  const [customers,
    setCustomers] = useState([]);

  const [bills,
    setBills] = useState([]);

  const [loading,
    setLoading] = useState(false);

  const [search,
    setSearch] = useState("");

  const [startDate,
    setStartDate] = useState("");

  const [endDate,
    setEndDate] = useState("");

  const [formData,
    setFormData] = useState({

      customer: "",

      paymentStatus: "pending",

      items: [

        {

          itemName: "",

          quantity: 1,

          unit: "pcs",

          price: 0

        }

      ]

    });

  useEffect(() => {

    fetchCustomers();

    fetchBills();

  }, []);

  // FETCH CUSTOMERS

  const fetchCustomers =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

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

        console.log(error);

      }

    };

  // FETCH BILLS

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

  // MARK AS PAID

  const markAsPaid =
    async (id) => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        await API.put(

          `/bills/${id}`,

          {

            paymentStatus:
              "paid"

          },

          {

            headers: {

              Authorization:
                `Bearer ${token}`

            }

          }

        );

        toast.success(
          "Invoice marked as paid"
        );

        fetchBills();

      }

      catch (error) {

        console.log(error);

        toast.error(
          "Failed to update invoice"
        );

      }

    };

  // HANDLE ITEM CHANGE

  const handleItemChange =
    (index, field, value) => {

      const updatedItems =
        [...formData.items];

      updatedItems[index][field] =
        value;

      setFormData({

        ...formData,

        items:
          updatedItems

      });

    };

  // ADD ITEM

  const addItem = () => {

    setFormData({

      ...formData,

      items: [

        ...formData.items,

        {

          itemName: "",

          quantity: 1,

          unit: "pcs",

          price: 0

        }

      ]

    });

  };

  // REMOVE ITEM

  const removeItem =
    (index) => {

      const updatedItems =
        formData.items.filter(

          (_, i) => i !== index

        );

      setFormData({

        ...formData,

        items:
          updatedItems

      });

    };

  // TOTAL

  const calculateTotal =
    () => {

      return formData.items.reduce(

        (acc, item) =>

          acc +

          Number(item.quantity || 0) *

          Number(item.price || 0),

        0

      );

    };

  // FILTER

  const filteredBills =

    bills.filter((bill) => {

      const matchesSearch =

        bill.customer?.name

          ?.toLowerCase()

          .includes(
            search.toLowerCase()
          );

      return matchesSearch;

    });

  // EXCEL

  const exportToExcel =
    () => {

      const exportData =

        filteredBills.map(
          (bill) => ({

            Customer:
              bill.customer?.name,

            Status:
              bill.paymentStatus,

            Amount:
              bill.totalAmount

          })
        );

      const worksheet =
        XLSX.utils.json_to_sheet(
          exportData
        );

      const workbook =
        XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(

        workbook,

        worksheet,

        "Invoices"

      );

      const excelBuffer =
        XLSX.write(

          workbook,

          {

            bookType: "xlsx",

            type: "array"

          }

        );

      const fileData =
        new Blob(

          [excelBuffer],

          {

            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

          }

        );

      saveAs(

        fileData,

        "Invoices_Report.xlsx"

      );

    };

  // CREATE BILL

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const token =
          localStorage.getItem(
            "token"
          );

        const validItems =
          formData.items.filter(

            (item) =>

              item.itemName.trim() !== ""

          );

        await API.post(

          "/bills",

          {

            customer:
              formData.customer,

            paymentStatus:
              formData.paymentStatus,

            items:
              validItems

          },

          {

            headers: {

              Authorization:
                `Bearer ${token}`

            }

          }

        );

        toast.success(
          "Invoice Created"
        );

        setFormData({

          customer: "",

          paymentStatus:
            "pending",

          items: [

            {

              itemName: "",

              quantity: 1,

              unit: "pcs",

              price: 0

            }

          ]

        });

        fetchBills();

      }

      catch (error) {

        console.log(error);

      }

      finally {

        setLoading(false);

      }

    };

  // DELETE

  const deleteBill =
    async (id) => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        await API.delete(

          `/bills/${id}`,

          {

            headers: {

              Authorization:
                `Bearer ${token}`

            }

          }

        );

        toast.success(
          "Invoice Deleted"
        );

        fetchBills();

      }

      catch (error) {

        console.log(error);

      }

    };

  // PDF

  const downloadPDF =
    (bill) => {

      const doc =
        new jsPDF();

      doc.text(
        "Invoice",
        20,
        20
      );

      doc.text(

        `Customer: ${bill.customer?.name}`,

        20,
        40

      );

      doc.text(

        `Amount: ₹${bill.totalAmount}`,

        20,
        55

      );

      doc.save(
        "invoice.pdf"
      );

    };

  // REMINDER

  const sendReminder =
    (bill) => {

      const message =

        `Pending Amount: ₹${bill.totalAmount}`;

      const encoded =
        encodeURIComponent(
          message
        );

      window.open(

        `https://wa.me/?text=${encoded}`,

        "_blank"

      );

    };

  // SHARE

  const shareWhatsApp =
    (bill) => {

      const message =

        `Invoice Amount: ₹${bill.totalAmount}`;

      const encoded =
        encodeURIComponent(
          message
        );

      window.open(

        `https://wa.me/?text=${encoded}`,

        "_blank"

      );

    };

  return (

    <Layout>

      <div className="min-h-screen bg-[#eef2ff] dark:bg-[#0b1220] p-6 space-y-8">

        {/* HEADER */}

        <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 rounded-[32px] p-8 text-white">

          <h1 className="text-5xl font-black">

            Invoice Management

          </h1>

          <p className="text-white/80 mt-3">

            Create and manage invoices professionally

          </p>

        </div>

        {/* HISTORY */}

        <div className="bg-white dark:bg-[#111827] rounded-[32px] p-8">

          <div className="flex justify-between items-center mb-8">

            <h2 className="text-4xl font-black dark:text-white">

              Invoice History

            </h2>

            <button

              onClick={exportToExcel}

              className="bg-green-600 text-white px-6 py-4 rounded-2xl"

            >

              Export Excel

            </button>

          </div>

          {/* SEARCH */}

          <div className="mb-8">

            <input

              type="text"

              placeholder="Search customer..."

              value={search}

              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }

              className="w-full border p-4 rounded-2xl"

            />

          </div>

          {/* BILLS */}

          <div className="space-y-6">

            {

              filteredBills.map((bill) => (

                <div

                  key={bill._id}

                  className={`rounded-[30px] p-7 border-2

                  ${

                    bill.paymentStatus === "pending"

                      ?

                      "border-red-200 bg-red-50"

                      :

                      "border-green-200 bg-green-50"

                  }`}

                >

                  <div className="flex justify-between gap-8">

                    {/* LEFT */}

                    <div>

                      <h3 className="text-3xl font-black">

                        {

                          bill.customer?.name

                        }

                      </h3>

                      <p className="text-gray-500 mt-2">

                        {

                          new Date(
                            bill.createdAt
                          ).toLocaleDateString()

                        }

                      </p>

                      <div className="mt-5">

                        <span

                          className={`px-5 py-2 rounded-full text-sm font-bold

                          ${

                            bill.paymentStatus === "paid"

                              ?

                              "bg-green-100 text-green-700"

                              :

                              "bg-red-100 text-red-700"

                          }`}

                        >

                          {

                            bill.paymentStatus === "paid"

                              ?

                              "✅ Paid"

                              :

                              "⏳ Pending"

                          }

                        </span>

                      </div>

                    </div>

                    {/* RIGHT */}

                    <div className="text-right">

                      <h2 className="text-5xl font-black text-violet-600">

                        ₹ {

                          bill.totalAmount

                        }

                      </h2>

                      <div className="flex gap-3 mt-8">

                        <button

                          onClick={() =>
                            downloadPDF(bill)
                          }

                          className="bg-blue-600 text-white px-5 py-3 rounded-2xl"

                        >

                          PDF

                        </button>

                        <button

                          onClick={() =>
                            shareWhatsApp(bill)
                          }

                          className="bg-green-600 text-white px-5 py-3 rounded-2xl"

                        >

                          WhatsApp

                        </button>

                        {

                          bill.paymentStatus === "pending" && (

                            <>

                              <button

                                onClick={() =>
                                  sendReminder(bill)
                                }

                                className="bg-orange-500 text-white px-5 py-3 rounded-2xl"

                              >

                                Reminder

                              </button>

                              <button

                                onClick={() =>
                                  markAsPaid(bill._id)
                                }

                                className="bg-emerald-600 text-white px-5 py-3 rounded-2xl"

                              >

                                Mark Paid

                              </button>

                            </>

                          )

                        }

                        <button

                          onClick={() =>
                            deleteBill(
                              bill._id
                            )
                          }

                          className="bg-red-600 text-white px-5 py-3 rounded-2xl"

                        >

                          Delete

                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              ))

            }

          </div>

        </div>

      </div>

    </Layout>

  );

}

export default Bills;