const Customer =
  require("../models/Customer");

const Transaction =
  require("../models/Transaction");

const mongoose =
  require("mongoose");


// GET DASHBOARD DATA

const getDashboardData =
  async (req, res) => {

    try {

      // TOTAL CUSTOMERS

      const totalCustomers =
        await Customer.countDocuments({

          user: req.user.id

        });

      // ALL USER TRANSACTIONS

      const transactions =
        await Transaction.find({

          user: req.user.id

        });

      let totalCredit = 0;

      let totalDebit = 0;

      // CALCULATE CREDIT & DEBIT

      transactions.forEach(
        (transaction) => {

          if (
            transaction.type ===
            "credit"
          ) {

            totalCredit +=
              Number(
                transaction.amount
              );

          }

          else {

            totalDebit +=
              Number(
                transaction.amount
              );

          }

        }
      );

      // TOTAL BALANCE

      const totalBalance =
        totalCredit - totalDebit;

      // MONTHLY ANALYTICS

      const monthlyData =
        await Transaction.aggregate([

          {

            $match: {

              user:
                new mongoose.Types.ObjectId(
                  req.user.id
                )

            }

          },

          {

            $group: {

              _id: {

                month: {

                  $month:
                    "$createdAt"

                }

              },

              credit: {

                $sum: {

                  $cond: [

                    {

                      $eq: [

                        "$type",

                        "credit"

                      ]

                    },

                    "$amount",

                    0

                  ]

                }

              },

              debit: {

                $sum: {

                  $cond: [

                    {

                      $eq: [

                        "$type",

                        "debit"

                      ]

                    },

                    "$amount",

                    0

                  ]

                }

              }

            }

          },

          {

            $sort: {

              "_id.month": 1

            }

          }

        ]);

      // RECENT TRANSACTIONS

      const recentTransactions =
        await Transaction.find({

          user: req.user.id

        })

          .populate("customer")

          .sort({

            createdAt: -1

          })

          .limit(5);

      // TOP CUSTOMERS

      const topCustomers =
        await Customer.find({

          user: req.user.id

        })

          .sort({

            balance: -1

          })

          .limit(5);

      // HIGH DUE CUSTOMERS

      const highDueCustomers =
        await Customer.find({

          user: req.user.id,

          balance: {

            $gt: 5000

          }

        })

          .sort({

            balance: -1

          })

          .limit(5);

      // RESPONSE

      res.json({

        totalCustomers,

        totalBalance,

        totalCredit,

        totalDebit,

        monthlyData,

        recentTransactions,

        topCustomers,

        highDueCustomers

      });

    }

    catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Server Error"

      });

    }

  };

module.exports = {

  getDashboardData

};