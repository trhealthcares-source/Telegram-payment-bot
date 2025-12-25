require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const bot = require("./bot"); // Telegram bot (WEBHOOK MODE)

// 🔴 IMPORTANT DEBUG WRAPPER
try {
  require("./telegram"); // message + button handlers
  console.log("telegram.js loaded successfully");
} catch (err) {
  console.error("telegram.js failed to load:", err);
}

try {
  require("./reminder"); // reminder cron
  console.log("reminder.js loaded successfully");
} catch (err) {
  console.error("reminder.js failed to load:", err);
}

const razorpayWebhook = require("./webhook");

const app = express();

/**
 * MUST be before routes
 */
app.use(bodyParser.json());

/**
 * Telegram webhook endpoint
 * Always return 200 to avoid 502 Bad Gateway
 */
app.post("/telegram", (req, res) => {
  try {
    bot.processUpdate(req.body);
    res.sendStatus(200);
  } catch (error) {
    console.error("Telegram webhook error:", error);
    // IMPORTANT: still return 200 so Telegram does not retry
    res.sendStatus(200);
  }
});

/**
 * Razorpay webhook endpoint
 */
app.use("/", razorpayWebhook);

/**
 * Health check
 */
app.get("/", (req, res) => {
  res.send("Bot running");
});

/**
 * Use Railway provided PORT
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
