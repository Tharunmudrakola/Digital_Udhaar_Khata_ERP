const express =
  require("express");

const mongoose =
  require("mongoose");

const cors =
  require("cors");

const path =
  require("path");

require("dotenv").config();

console.log(
  "🚀 SERVER STARTING..."
);

console.log(
  "MONGO_URI:",
  process.env.MONGO_URI
    ? "FOUND"
    : "MISSING"
);

console.log(
  "PORT:",
  process.env.PORT || 5000
);

// ROUTES

const authRoutes =
  require("./routes/authRoutes");

const customerRoutes =
  require("./routes/customerRoutes");

const transactionRoutes =
  require("./routes/transactionRoutes");

const dashboardRoutes =
  require("./routes/dashboardRoutes");

const billRoutes =
  require("./routes/billRoutes");

const app = express();


// ================= MIDDLEWARE =================

app.use(

  cors({

    origin: "*",

    credentials: true

  })

);

app.use(
  express.json()
);


// ================= STATIC FILES =================

app.use(

  "/uploads",

  express.static(

    path.join(

      __dirname,

      "uploads"

    )

  )

);


// ================= ROUTES =================

app.use(

  "/api/auth",

  authRoutes

);

app.use(

  "/api/customers",

  customerRoutes

);

app.use(

  "/api/transactions",

  transactionRoutes

);

app.use(

  "/api/dashboard",

  dashboardRoutes

);

app.use(

  "/api/bills",

  billRoutes

);


// ================= TEST ROUTE =================

app.get(

  "/",

  (req, res) => {

    res.status(200).json({

      success: true,

      message:
        "API Running Successfully"

    });

  }

);


// ================= START SERVER =================

const startServer =
  async () => {

    try {

      await mongoose.connect(

        process.env.MONGO_URI,

        {

          serverSelectionTimeoutMS:
            30000

        }

      );

      console.log(
        "✅ MongoDB Connected"
      );

      const PORT =
        process.env.PORT || 5000;

      app.listen(

        PORT,

        () => {

          console.log(

            `✅ Server running on port ${PORT}`

          );

        }

      );

    }

    catch (error) {

      console.error(
        "❌ MongoDB Connection Failed"
      );

      console.error(
        error
      );

      process.exit(1);

    }

  };

startServer();