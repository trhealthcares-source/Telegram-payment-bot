require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const bot = require("./bot");          // Telegram bot
require("./telegram");                 // handlers
require("./reminder");                 // cron
const razorpayWebhook = require("./webhook");

const app = express();

// MUST be before routes
app.use(bodyParser.json());

// Telegram webhook (MUST be BEFORE other routes)
app.post("/telegram", (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Razorpay webhook
app.use("/", razorpayWebhook);

// Health check
app.get("/", (req, res) => {
  res.send("Bot running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
