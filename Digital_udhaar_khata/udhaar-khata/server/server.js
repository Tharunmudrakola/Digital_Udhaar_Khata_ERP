const express =
  require("express");

const mongoose =
  require("mongoose");

const cors =
  require("cors");

const path =
  require("path");

require("dotenv").config();

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

app.use(cors());

app.use(express.json());


// ================= STATIC UPLOADS =================

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

app.get("/", (req, res) => {

  res.send(

    "API Running Successfully"

  );

});


// ================= DATABASE =================

mongoose.connect(

  process.env.MONGO_URI

)

.then(() => {

  console.log(

    "MongoDB Connected"

  );

  app.listen(

    process.env.PORT || 5000,

    () => {

      console.log(

        `Server running on port ${process.env.PORT || 5000}`

      );

    }

  );

})

.catch((err) => {

  console.log(

    "Mongo Error:",

    err

  );

});