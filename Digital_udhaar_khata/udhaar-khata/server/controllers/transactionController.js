const Transaction =
  require("../models/Transaction");

const Customer =
  require("../models/Customer");

const User =
  require("../models/User");

const bcrypt =
  require("bcryptjs");


// ================= ADD TRANSACTION =================

const addTransaction =
  async (req, res) => {

    try {

      const {

        customerId,
        type,
        amount,
        note,
        status

      } = req.body;

      // FIND CUSTOMER

      const customer =
        await Customer.findById(
          customerId
        );

      if (!customer) {

        return res.status(404).json({

          message:
            "Customer not found"

        });

      }

      // CREATE CUSTOMER LOGIN

      const existingUser =
        await User.findOne({

          email:
            customer.email

        });

      if (!existingUser) {

        const salt =
          await bcrypt.genSalt(10);

        const hashedPassword =
          await bcrypt.hash(

            "customer123",

            salt

          );

        await User.create({

          name:
            customer.name,

          email:
            customer.email,

          password:
            hashedPassword,

          role:
            "customer"

        });

      }

      // CREATE TRANSACTION

      const transaction =
        await Transaction.create({

          user:
            req.user.id,

          customer:
            customer._id,

          customerName:
            customer.name,

          customerEmail:
            customer.email,

          type,

          amount:
            Number(amount),

          note,

          status:
            status || "Pending"

        });

      // UPDATE CUSTOMER BALANCE

      if (
        type === "credit"
      ) {

        customer.balance =

          Number(
            customer.balance || 0
          )

          + Number(amount);

      }

      else {

        customer.balance =

          Number(
            customer.balance || 0
          )

          - Number(amount);

      }

      await customer.save();

      res.status(201).json({

        message:
          "Transaction added successfully",

        transaction,

        customerLogin: {

          email:
            customer.email,

          password:
            "customer123"

        }

      });

    }

    catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message

      });

    }

  };


// ================= GET OWNER TRANSACTIONS =================

const getTransactions =
  async (req, res) => {

    try {

      const transactions =
        await Transaction.find({

          user:
            req.user.id

        })

        .populate(

          "customer",

          "name email"

        )

        .sort({

          createdAt: -1

        });

      res.json(
        transactions
      );

    }

    catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message

      });

    }

  };


// ================= GET CUSTOMER TRANSACTIONS =================

const getCustomerTransactions =
  async (req, res) => {

    try {

      const transactions =
        await Transaction.find({

          customerEmail:
            req.user.email

        })

        .sort({

          createdAt: -1

        });

      res.json(
        transactions
      );

    }

    catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message

      });

    }

  };


// ================= UPDATE TRANSACTION =================

const updateTransaction =
  async (req, res) => {

    try {

      const transaction =
        await Transaction.findOne({

          _id:
            req.params.id,

          user:
            req.user.id

        });

      if (!transaction) {

        return res.status(404).json({

          message:
            "Transaction not found"

        });

      }

      // FIND CUSTOMER

      const customer =
        await Customer.findById(

          transaction.customer

        );

      if (!customer) {

        return res.status(404).json({

          message:
            "Customer not found"

        });

      }

      // REMOVE OLD BALANCE

      if (
        transaction.type ===
        "credit"
      ) {

        customer.balance =

          Number(
            customer.balance
          )

          - Number(
            transaction.amount
          );

      }

      else {

        customer.balance =

          Number(
            customer.balance
          )

          + Number(
            transaction.amount
          );

      }

      // UPDATE VALUES

      transaction.type =

        req.body.type ||

        transaction.type;

      transaction.amount =

        Number(
          req.body.amount
        ) ||

        transaction.amount;

      transaction.note =

        req.body.note ??

        transaction.note;

      transaction.status =

        req.body.status ||

        transaction.status;

      // APPLY NEW BALANCE

      if (
        transaction.type ===
        "credit"
      ) {

        customer.balance =

          Number(
            customer.balance
          )

          + Number(
            transaction.amount
          );

      }

      else {

        customer.balance =

          Number(
            customer.balance
          )

          - Number(
            transaction.amount
          );

      }

      await customer.save();

      await transaction.save();

      res.json({

        message:
          "Transaction updated successfully",

        transaction

      });

    }

    catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message

      });

    }

  };


// ================= DELETE TRANSACTION =================

const deleteTransaction =
  async (req, res) => {

    try {

      const transaction =
        await Transaction.findOne({

          _id:
            req.params.id,

          user:
            req.user.id

        });

      if (!transaction) {

        return res.status(404).json({

          message:
            "Transaction not found"

        });

      }

      // FIND CUSTOMER

      const customer =
        await Customer.findById(

          transaction.customer

        );

      if (customer) {

        // REVERSE BALANCE

        if (
          transaction.type ===
          "credit"
        ) {

          customer.balance =

            Number(
              customer.balance
            )

            - Number(
              transaction.amount
            );

        }

        else {

          customer.balance =

            Number(
              customer.balance
            )

            + Number(
              transaction.amount
            );

        }

        await customer.save();

      }

      await transaction.deleteOne();

      res.json({

        message:
          "Transaction deleted successfully"

      });

    }

    catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message

      });

    }

  };


// ================= UPLOAD PAYMENT SCREENSHOT =================

const uploadPaymentScreenshot =
  async (req, res) => {

    try {

      const transaction =
        await Transaction.findById(

          req.params.id

        );

      if (!transaction) {

        return res.status(404).json({

          message:
            "Transaction not found"

        });

      }

      transaction.paymentScreenshot =

        `/uploads/${req.file.filename}`;

      transaction.paymentRequest = true;

      transaction.status = "Waiting";

      await transaction.save();

      res.json({

        message:
          "Payment screenshot uploaded",

        transaction

      });

    }

    catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message

      });

    }

  };


// ================= APPROVE PAYMENT =================

const approvePayment =
  async (req, res) => {

    try {

      const transaction =
        await Transaction.findById(

          req.params.id

        );

      if (!transaction) {

        return res.status(404).json({

          message:
            "Transaction not found"

        });

      }

      transaction.status =
        "Paid";

      transaction.approvedAt =
        new Date();

      await transaction.save();

      res.json({

        message:
          "Payment approved",

        transaction

      });

    }

    catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message

      });

    }

  };


// ================= REJECT PAYMENT =================

const rejectPayment =
  async (req, res) => {

    try {

      const transaction =
        await Transaction.findById(

          req.params.id

        );

      if (!transaction) {

        return res.status(404).json({

          message:
            "Transaction not found"

        });

      }

      transaction.status =
        "Rejected";

      await transaction.save();

      res.json({

        message:
          "Payment rejected",

        transaction

      });

    }

    catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message

      });

    }

  };


// ================= EXPORTS =================

module.exports = {

  addTransaction,

  getTransactions,

  getCustomerTransactions,

  updateTransaction,

  deleteTransaction,

  uploadPaymentScreenshot,

  approvePayment,

  rejectPayment

};