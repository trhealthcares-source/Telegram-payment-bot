require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
require("./telegram");
const webhook = require("./webhook");

const app = express();
app.use(bodyParser.json());
app.use("/", webhook);

app.get("/", (req, res) => res.send("Bot running"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server started"));
