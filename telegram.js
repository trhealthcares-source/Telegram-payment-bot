const TelegramBot = require("node-telegram-bot-api");
const razorpay = require("./razorpay");

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/pay/, async (msg) => {
  const chatId = msg.chat.id;

  const order = await razorpay.orders.create({
    amount: 19900,
    currency: "INR",
    receipt: `receipt_${chatId}`
  });

  bot.sendMessage(chatId, `Pay ₹199\nOrder ID: ${order.id}`);
});

module.exports = bot;
