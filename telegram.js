const bot = require("./bot");
const Razorpay = require("./razorpay");

// /start command
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const name = msg.from.first_name || "User";

  await bot.sendMessage(
    chatId,
    `🤖 Channel Payment Bot\n\n👋 Hi ${name}\n\n📦 Premium Plans\n\n✅ Tamil + Bingeme – ₹299`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Tamil + Bingeme – ₹299",
              callback_data: "pay_299",
            },
          ],
          [
            {
              text: "Already Paid / Join Channel",
              callback_data: "already_paid",
            },
          ],
        ],
      },
    }
  );
});

// Button clicks
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;

  if (query.data === "pay_299") {
    const order = await Razorpay.orders.create({
      amount: 29900,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    const qr = await Razorpay.qrCode.create({
      type: "upi_qr",
      name: "Subscription",
      usage: "single_use",
      fixed_amount: true,
      payment_amount: 29900,
      description: "Premium Access",
    });

    await bot.sendPhoto(chatId, qr.image_url, {
      caption: "Scan QR to complete payment",
    });
  }

  if (query.data === "already_paid") {
    await bot.sendMessage(
      chatId,
      "✅ Access granted.\n\n🔗 Join channel:\nhttps://t.me/your_channel_link"
    );
  }

  bot.answerCallbackQuery(query.id);
});
