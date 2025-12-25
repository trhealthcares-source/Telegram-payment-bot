const express = require("express");
const router = express.Router();

router.post("/razorpay", (req, res) => {
  // You can verify signature here later
  console.log("Razorpay webhook received");
  res.sendStatus(200);
});

module.exports = router;
