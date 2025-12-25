const express = require("express");
const crypto = require("crypto");
const db = require("./db");
const router = express.Router();

router.post("/razorpay/webhook", async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const body = JSON.stringify(req.body);

  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  if (expected !== req.headers["x-razorpay-signature"]) {
    return res.status(400).send("Invalid");
  }

  const telegramId = req.body.payload.payment.entity.notes?.telegram_id;
  if (!telegramId) return res.send("OK");

  const result = await db.query(
    "SELECT paid_until FROM users WHERE telegram_id=$1",
    [telegramId]
  );

  let newDate = new Date();
  if (result.rowCount && new Date(result.rows[0].paid_until) > newDate) {
    newDate = new Date(result.rows[0].paid_until);
  }
  newDate.setDate(newDate.getDate() + 30);

  await db.query(
    "INSERT INTO users (telegram_id, paid_until) VALUES ($1,$2) ON CONFLICT (telegram_id) DO UPDATE SET paid_until=$2",
    [telegramId, newDate]
  );

  res.send("OK");
});

module.exports = router;
