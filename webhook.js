const express = require("express");
const crypto = require("crypto");
const router = express.Router();

router.post("/razorpay/webhook", (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const body = JSON.stringify(req.body);

  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  const received = req.headers["x-razorpay-signature"];

  if (expected !== received) {
    return res.status(400).send("Invalid signature");
  }

  res.send("OK");
});

module.exports = router;
