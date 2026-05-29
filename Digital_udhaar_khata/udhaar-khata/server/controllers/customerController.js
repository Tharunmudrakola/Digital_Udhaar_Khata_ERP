const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const Customer =
  require("../models/Customer");

const Transaction =
  require("../models/Transaction");

const User =
  require("../models/User");


// ================= ADD CUSTOMER =================

const addCustomer =
  async (req, res) => {

    try {

      const {
        name,
        email,
        phone,
        address
      } = req.body;

      // VALIDATION

      if (
        !name ||
        !email
      ) {

        return res.status(400).json({

          message:
            "Name and Email are required"

        });

      }

      // CHECK CUSTOMER EXISTS FOR CURRENT USER

      const customerExists =
        await Customer.findOne({

          email,

          user:
            req.user.id

        });

      if (customerExists) {

        return res.status(400).json({

          message:
            "Customer already exists"

        });

      }

      // CREATE CUSTOMER

      const customer =
        await Customer.create({

          user:
            req.user.id,

          name,

          email,

          phone:
            phone || "",

          address:
            address || "",

          balance: 0

        });

      // CHECK USER EXISTS

      const userExists =
        await User.findOne({

          email

        });

      // AUTO CREATE CUSTOMER LOGIN

      if (!userExists) {

        const defaultPassword =
          "customer123";

        const salt =
          await bcrypt.genSalt(10);

        const hashedPassword =
          await bcrypt.hash(

            defaultPassword,

            salt

          );

        await User.create({

          name,

          email,

          password:
            hashedPassword,

          role:
            "customer"

        });

      }

      res.status(201).json({

        success: true,

        message:
          "Customer added successfully",

        customer

      });

    }

    catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          "Server Error"

      });

    }

  };


// ================= GET ALL CUSTOMERS =================

const getCustomers =
  async (req, res) => {

    try {

      const customers =
        await Customer.aggregate([

          {

            $match: {

              user:
                new mongoose.Types.ObjectId(
                  req.user.id
                )

            }

          },

          {

            $lookup: {

              from:
                "transactions",

              localField:
                "_id",

              foreignField:
                "customer",

              as:
                "transactions"

            }

          },

          {

            $addFields: {

              totalTransactions: {

                $size:
                  "$transactions"

              }

            }

          },

          {

            $project: {

              name: 1,

              email: 1,

              phone: 1,

              address: 1,

              balance: 1,

              totalTransactions: 1,

              createdAt: 1

            }

          },

          {

            $sort: {

              createdAt: -1

            }

          }

        ]);

      res.json(customers);

    }

    catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Server Error"

      });

    }

  };


// ================= DELETE CUSTOMER =================

const deleteCustomer =
  async (req, res) => {

    try {

      const customer =
        await Customer.findOne({

          _id:
            req.params.id,

          user:
            req.user.id

        });

      if (!customer) {

        return res.status(404).json({

          message:
            "Customer not found"

        });

      }

      // DELETE TRANSACTIONS

      await Transaction.deleteMany({

        customer:
          req.params.id

      });

      // DELETE CUSTOMER

      await customer.deleteOne();

      res.json({

        success: true,

        message:
          "Customer deleted successfully"

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


// ================= UPDATE CUSTOMER =================

const updateCustomer =
  async (req, res) => {

    try {

      const {
        name,
        email,
        phone,
        address
      } = req.body;

      const customer =
        await Customer.findOne({

          _id:
            req.params.id,

          user:
            req.user.id

        });

      if (!customer) {

        return res.status(404).json({

          message:
            "Customer not found"

        });

      }

      customer.name =
        name || customer.name;

      customer.email =
        email || customer.email;

      customer.phone =
        phone || customer.phone;

      customer.address =
        address || customer.address;

      await customer.save();

      res.json({

        success: true,

        message:
          "Customer updated successfully",

        customer

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


// ================= CUSTOMER LEDGER =================

const getCustomerLedger =
  async (req, res) => {

    try {

      const customer =
        await Customer.findOne({

          _id:
            req.params.id,

          user:
            req.user.id

        });

      if (!customer) {

        return res.status(404).json({

          message:
            "Customer not found"

        });

      }

      const transactions =
        await Transaction.find({

          customer:
            req.params.id

        })

        .sort({

          createdAt: -1

        });

      let totalCredit = 0;

      let totalDebit = 0;

      transactions.forEach(
        (transaction) => {

          if (
            transaction.type ===
            "credit"
          ) {

            totalCredit +=
              transaction.amount;

          }

          else {

            totalDebit +=
              transaction.amount;

          }

        }
      );

      const balance =
        totalCredit - totalDebit;

      res.json({

        customer,

        transactions,

        totalCredit,

        totalDebit,

        balance

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


// ================= EXPORTS =================

module.exports = {

  addCustomer,

  getCustomers,

  deleteCustomer,

  updateCustomer,

  getCustomerLedger

};