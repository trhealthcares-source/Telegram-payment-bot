require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const bot = require("./bot");          // Telegram bot (WEBHOOK MODE)
require("./telegram");                 // message + button handlers
require("./reminder");                 // reminder cron
const razorpayWebhook = require("./webhook");

const app = express();

/**
 * IMPORTANT:
 * This must come BEFORE routes
 */
app.use(bodyParser.json());

/**
 * Telegram webhook endpoint
 * This MUST match the webhook URL you set
 */
app.post("/telegram", (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
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
 * IMPORTANT:
 * Use Railway provided PORT
 * Do NOT hardcode 8080
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
