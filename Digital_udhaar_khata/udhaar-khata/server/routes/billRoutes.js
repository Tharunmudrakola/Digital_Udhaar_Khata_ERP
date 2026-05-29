const express =
  require("express");

const router =
  express.Router();

const {

  createBill,

  getBills,

  getSingleBill,

  updateBill,

  deleteBill

} = require(

  "../controllers/billController"

);

const protect =
  require("../middleware/authMiddleware");


// CREATE BILL

router.post(
  "/",
  protect,
  createBill
);


// GET ALL BILLS

router.get(
  "/",
  protect,
  getBills
);


// GET SINGLE BILL

router.get(
  "/:id",
  protect,
  getSingleBill
);


// UPDATE BILL

router.put(
  "/:id",
  protect,
  updateBill
);


// DELETE BILL

router.delete(
  "/:id",
  protect,
  deleteBill
);

module.exports =
  router;