const express =
  require("express");

const router =
  express.Router();

const protect =
  require("../middleware/authMiddleware");

const upload =
  require("../middleware/uploadMiddleware");

const {

  addTransaction,

  getTransactions,

  updateTransaction,

  deleteTransaction,

  getCustomerTransactions,

  uploadPaymentScreenshot,

  approvePayment,

  rejectPayment

} = require(

  "../controllers/transactionController"

);


// ================= OWNER ROUTES =================

// GET ALL TRANSACTIONS

router.get(

  "/",

  protect,

  getTransactions

);


// ADD TRANSACTION

router.post(

  "/",

  protect,

  addTransaction

);


// UPDATE TRANSACTION

router.put(

  "/:id",

  protect,

  updateTransaction

);


// DELETE TRANSACTION

router.delete(

  "/:id",

  protect,

  deleteTransaction

);


// ================= CUSTOMER ROUTES =================

// GET CUSTOMER TRANSACTIONS

router.get(

  "/my-transactions",

  protect,

  getCustomerTransactions

);


// ================= PAYMENT SCREENSHOT =================

// UPLOAD PAYMENT SCREENSHOT

router.put(

  "/upload-payment/:id",

  protect,

  upload.single(

    "paymentScreenshot"

  ),

  uploadPaymentScreenshot

);


// APPROVE PAYMENT

router.put(

  "/approve-payment/:id",

  protect,

  approvePayment

);


// REJECT PAYMENT

router.put(

  "/reject-payment/:id",

  protect,

  rejectPayment

);

module.exports =
  router;