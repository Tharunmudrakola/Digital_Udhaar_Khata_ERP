const mongoose =
  require("mongoose");

const transactionSchema =
  new mongoose.Schema(

    {

      // OWNER USER

      user: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true

      },

      // CUSTOMER ID

      customer: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Customer",

        required: true

      },

      // CUSTOMER NAME

      customerName: {

        type: String,

        required: true

      },

      // CUSTOMER EMAIL

      customerEmail: {

        type: String,

        required: true

      },

      // TRANSACTION TYPE

      type: {

        type: String,

        enum: [

          "credit",

          "debit"

        ],

        required: true

      },

      // PAYMENT STATUS

      status: {

        type: String,

        enum: [

          "Paid",

          "Pending",

          "Partial",

          "Waiting",

          "Rejected"

        ],

        default: "Pending"

      },

      // AMOUNT

      amount: {

        type: Number,

        required: true

      },

      // NOTE

      note: {

        type: String,

        default: ""

      },

      // PAYMENT SCREENSHOT

      paymentScreenshot: {

        type: String,

        default: ""

      },

      // PAYMENT REQUEST

      paymentRequest: {

        type: Boolean,

        default: false

      },

      // APPROVED DATE

      approvedAt: {

        type: Date,

        default: null

      }

    },

    {

      timestamps: true

    }

  );

module.exports =
  mongoose.model(

    "Transaction",

    transactionSchema

  );