require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const bot = require("./bot");        // Telegram bot (NO polling)
require("./telegram");               // message + button logic
require("./reminder");               // reminder job
const webhook = require("./webhook"); // razorpay webhook

const app = express();

// required for Telegram + Razorpay
app.use(bodyParser.json());

// Razorpay webhook
app.use("/", webhook);

// Telegram webhook endpoint
app.post("/telegram", (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// health check
app.get("/", (req, res) => {
  res.send("Bot running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
