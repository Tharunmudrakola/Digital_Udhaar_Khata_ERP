const express =
  require("express");

const router =
  express.Router();

const protect =
  require("../middleware/authMiddleware");

const {

  addCustomer,

  getCustomers,

  deleteCustomer,

  updateCustomer,

  getCustomerLedger

} = require(

  "../controllers/customerController"

);


// GET ALL CUSTOMERS

router.get(

  "/",

  protect,

  getCustomers

);


// ADD CUSTOMER

router.post(

  "/",

  protect,

  addCustomer

);


// CUSTOMER LEDGER

router.get(

  "/:id/ledger",

  protect,

  getCustomerLedger

);


// UPDATE CUSTOMER

router.put(

  "/:id",

  protect,

  updateCustomer

);


// DELETE CUSTOMER

router.delete(

  "/:id",

  protect,

  deleteCustomer

);


module.exports =
  router;