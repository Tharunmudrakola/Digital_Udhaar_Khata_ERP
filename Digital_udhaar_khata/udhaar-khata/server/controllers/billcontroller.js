const Bill =
  require("../models/Bill");

const Customer =
  require("../models/Customer");


// ================= CREATE BILL =================

const createBill =
  async (req, res) => {

    try {

      const {

        customer,

        items,

        paymentStatus

      } = req.body;

      // CHECK CUSTOMER

      const customerExists =
        await Customer.findById(
          customer
        );

      if (!customerExists) {

        return res.status(400).json({

          message:
            "Customer not found"

        });

      }

      // VALIDATE ITEMS

      if (

        !items ||

        items.length === 0

      ) {

        return res.status(400).json({

          message:
            "Please add items"

        });

      }

      // FORMAT ITEMS

      const formattedItems =
        items.map((item) => {

          const quantity =
            Number(item.quantity);

          const price =
            Number(item.price);

          return {

            itemName:
              item.itemName,

            quantity,

            unit:
              item.unit || "pcs",

            price,

            total:
              quantity * price

          };

        });

      // TOTAL

      const totalAmount =
        formattedItems.reduce(

          (acc, item) =>

            acc + item.total,

          0

        );

      // CREATE BILL

      const bill =
        await Bill.create({

          user:
            req.user.id,

          customer,

          items:
            formattedItems,

          totalAmount,

          paymentStatus

        });

      // UPDATE CUSTOMER BALANCE

      if (
        paymentStatus ===
        "pending"
      ) {

        customerExists.balance +=
          totalAmount;

      }

      await customerExists.save();

      res.status(201).json({

        success: true,

        message:
          "Invoice created successfully",

        bill

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


// ================= GET ALL BILLS =================

const getBills =
  async (req, res) => {

    try {

      const bills =
        await Bill.find({

          user:
            req.user.id

        })

          .populate(

            "customer",

            "name phone balance"

          )

          .sort({

            createdAt: -1

          });

      res.json(bills);

    }

    catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message

      });

    }

  };


// ================= GET SINGLE BILL =================

const getSingleBill =
  async (req, res) => {

    try {

      const bill =
        await Bill.findById(
          req.params.id
        ).populate(

          "customer",

          "name phone address balance"

        );

      if (!bill) {

        return res.status(404).json({

          message:
            "Bill not found"

        });

      }

      res.json(bill);

    }

    catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message

      });

    }

  };


// ================= UPDATE BILL =================

const updateBill =
  async (req, res) => {

    try {

      const bill =
        await Bill.findById(
          req.params.id
        );

      if (!bill) {

        return res.status(404).json({

          message:
            "Invoice not found"

        });

      }

      // CUSTOMER

      const customer =
        await Customer.findById(
          bill.customer
        );

      // PENDING -> PAID

      if (

        bill.paymentStatus ===
          "pending"

        &&

        req.body.paymentStatus ===
          "paid"

      ) {

        customer.balance -=
          bill.totalAmount;

      }

      bill.paymentStatus =
        req.body.paymentStatus;

      await bill.save();

      await customer.save();

      res.json({

        success: true,

        message:
          "Invoice updated successfully",

        bill

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


// ================= DELETE BILL =================

const deleteBill =
  async (req, res) => {

    try {

      const bill =
        await Bill.findById(
          req.params.id
        );

      if (!bill) {

        return res.status(404).json({

          message:
            "Bill not found"

        });

      }

      // CUSTOMER

      const customer =
        await Customer.findById(
          bill.customer
        );

      // REMOVE BALANCE IF PENDING

      if (
        bill.paymentStatus ===
        "pending"
      ) {

        customer.balance -=
          bill.totalAmount;

        await customer.save();

      }

      await Bill.findByIdAndDelete(
        req.params.id
      );

      res.json({

        success: true,

        message:
          "Bill deleted successfully"

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

  createBill,

  getBills,

  getSingleBill,

  updateBill,

  deleteBill

};