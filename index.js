require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
require("./telegram");
require("./reminder");
const webhook = require("./webhook");

const app = express();
app.use(bodyParser.json());
app.use("/", webhook);

app.get("/", (_, res) => res.send("Bot running"));

const PORT = process.env.PORT || 3000;
app.listen(PORT);
