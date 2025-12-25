const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const db = require("./db");

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

async function showMenu(chatId, name) {
  await bot.sendMessage(chatId,
`🤖 Channel Payment Bot

👋 Hi ${name}

📦 Premium Plans

✅ Tamil + Bingeme – ₹299`,
{
  reply_markup: {
    inline_keyboard: [
      [{ text: "Tamil + Bingeme – ₹299", callback_data: "PAY" }],
      [{ text: "Already Paid / Join Channel", callback_data: "JOIN" }]
    ]
  }
});
}

bot.on("message", (msg) => {
  showMenu(msg.chat.id, msg.from.first_name);
});

bot.on("callback_query", async (q) => {
  const chatId = q.message.chat.id;

  if (q.data === "PAY") {
    const qr = await axios.post(
      "https://api.razorpay.com/v1/payments/qr_codes",
      {
        type: "upi_qr",
        name: "Access",
        usage: "single_use",
        fixed_amount: true,
        payment_amount: 29900,
        description: "Service Fee"
      },
      {
        auth: {
          username: process.env.RAZORPAY_KEY_ID,
          password: process.env.RAZORPAY_KEY_SECRET
        }
      }
    );

    await bot.sendPhoto(chatId, qr.data.image_url, {
      caption: "Scan & Pay ₹299",
      reply_markup: {
        inline_keyboard: [
          [{ text: "I have paid – Verify", callback_data: "VERIFY" }]
        ]
      }
    });
  }

  if (q.data === "JOIN") {
    const res = await db.query(
      "SELECT paid_until FROM users WHERE telegram_id=$1",
      [chatId]
    );

    if (res.rowCount && new Date(res.rows[0].paid_until) > new Date()) {
      await bot.sendMessage(chatId, "Join channel 👇", {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Join Channel", url: process.env.CHANNEL_INVITE_LINK }]
          ]
        }
      });
    } else {
      showMenu(chatId, q.from.first_name);
    }
  }
});
