const mongoose =
  require("mongoose");

const customerSchema =
  new mongoose.Schema(

    {

      // OWNER USER ID

      user: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref:
          "User",

        required: true

      },

      // CUSTOMER NAME

      name: {

        type: String,

        required: true,

        trim: true

      },

      // CUSTOMER EMAIL

      email: {

        type: String,

        required: true,

        unique: true,

        trim: true

      },

      // PHONE NUMBER

      phone: {

        type: String,

        default: ""

      },

      // ADDRESS

      address: {

        type: String,

        default: ""

      },

      // TOTAL BALANCE

      balance: {

        type: Number,

        default: 0

      }

    },

    {

      timestamps: true

    }

  );

module.exports =
  mongoose.model(

    "Customer",

    customerSchema

  );