require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const bot = require("./bot");

const app = express();
app.use(bodyParser.json());

// Telegram webhook ONLY
app.post("/telegram", async (req, res) => {
  try {
    await bot.processUpdate(req.body);
    res.status(200).send("OK");
  } catch (e) {
    console.error("processUpdate failed:", e);
    res.status(200).send("OK");
  }
});

// Health check
app.get("/", (req, res) => {
  res.send("Bot running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
