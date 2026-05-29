const mongoose =
  require("mongoose");

const itemSchema =
  new mongoose.Schema({

    itemName: {

      type: String,

      required: true

    },

    quantity: {

      type: Number,

      required: true

    },

    unit: {

      type: String,

      default: "pcs"

    },

    price: {

      type: Number,

      required: true

    },

    total: {

      type: Number,

      required: true

    }

  });

const billSchema =
  new mongoose.Schema(

    {

      user: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true

      },

      customer: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Customer",

        required: true

      },

      items: [

        itemSchema

      ],

      totalAmount: {

        type: Number,

        required: true

      },

      paymentStatus: {

        type: String,

        enum: [

          "paid",
          "pending"

        ],

        default: "pending"

      }

    },

    {

      timestamps: true

    }

  );

module.exports =
  mongoose.model(

    "Bill",

    billSchema

  );