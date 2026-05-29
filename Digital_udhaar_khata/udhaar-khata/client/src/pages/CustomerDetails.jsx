import React, {

  useEffect,

  useState

} from "react";

import API from "../services/api";

import toast from "react-hot-toast";

function CustomerDashboard() {

  const userInfo = JSON.parse(

    localStorage.getItem("userInfo")

  );

  const [transactions,

    setTransactions] = useState([]);

  const [totalDue,

    setTotalDue] = useState(0);

  const [totalPaid,

    setTotalPaid] = useState(0);

  useEffect(() => {

    fetchTransactions();

  }, []);

  // FETCH CUSTOMER TRANSACTIONS

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

      calculateAmounts(res.data);

    }

    catch (error) {

      console.log(error);

      toast.error(

        "Failed to fetch transactions"

      );

    }

  };

  // CALCULATE TOTALS

  const calculateAmounts = (data) => {

    let credit = 0;

    let debit = 0;

    data.forEach((transaction) => {

      if (

        transaction.type === "credit"

      ) {

        credit += transaction.amount;

      }

      else {

        debit += transaction.amount;

      }

    });

    setTotalDue(credit - debit);

    setTotalPaid(debit);

  };

  return (

    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}

      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">

        <h1 className="text-4xl font-bold text-gray-800">

          Welcome {userInfo?.name} 👋

        </h1>

        <p className="text-gray-500 mt-2">

          Customer Dashboard

        </p>

      </div>

      {/* CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        {/* TOTAL DUE */}

        <div className="bg-red-500 text-white rounded-3xl p-6 shadow-lg">

          <h2 className="text-xl font-semibold">

            Total Due

          </h2>

          <p className="text-3xl font-bold mt-4">

            ₹ {totalDue}

          </p>

        </div>

        {/* TOTAL PAID */}

        <div className="bg-green-500 text-white rounded-3xl p-6 shadow-lg">

          <h2 className="text-xl font-semibold">

            Total Paid

          </h2>

          <p className="text-3xl font-bold mt-4">

            ₹ {totalPaid}

          </p>

        </div>

      </div>

      {/* TRANSACTIONS */}

      <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">

        <h2 className="text-2xl font-bold mb-6">

          My Transactions

        </h2>

        {

          transactions.length === 0 ? (

            <p className="text-gray-500">

              No Transactions Found

            </p>

          ) : (

            <div className="space-y-4">

              {

                transactions.map((transaction) => (

                  <div
                    key={transaction._id}
                    className="flex justify-between items-center border-b pb-4"
                  >

                    {/* LEFT */}

                    <div>

                      <p className="font-bold">

                        {transaction.note}

                      </p>

                      <p className="text-gray-500 text-sm">

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

                            ? "text-red-600 font-bold"

                            : "text-green-600 font-bold"

                        }
                      >

                        {

                          transaction.type === "credit"

                            ? "+"

                            : "-"

                        }

                        ₹ {transaction.amount}

                      </p>

                      <span
                        className={`text-sm px-3 py-1 rounded-full text-white

                        ${

                          transaction.status === "Paid"

                            ? "bg-green-500"

                            : transaction.status === "Pending"

                            ? "bg-red-500"

                            : "bg-yellow-500"

                        }`}
                      >

                        {transaction.status}

                      </span>

                    </div>

                  </div>

                ))

              }

            </div>

          )

        }

      </div>

      {/* PROFILE */}

      <div className="bg-white rounded-3xl shadow-lg p-6">

        <h2 className="text-2xl font-bold mb-4">

          Profile Details

        </h2>

        <div className="space-y-3">

          <p>

            <span className="font-semibold">

              Name:

            </span>

            {" "}

            {userInfo?.name}

          </p>

          <p>

            <span className="font-semibold">

              Email:

            </span>

            {" "}

            {userInfo?.email}

          </p>

          <p>

            <span className="font-semibold">

              Role:

            </span>

            {" "}

            {userInfo?.role}

          </p>

        </div>

      </div>

    </div>

  );

}

export default CustomerDashboard;