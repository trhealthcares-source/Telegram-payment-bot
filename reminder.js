const cron = require("node-cron");
const db = require("./db");
const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(process.env.BOT_TOKEN);

cron.schedule("0 9 * * *", async () => {
  const res = await db.query(
    "SELECT telegram_id FROM users WHERE paid_until BETWEEN NOW()+INTERVAL '2 days' AND NOW()+INTERVAL '2 days 1 hour'"
  );

  for (const u of res.rows) {
    await bot.sendMessage(u.telegram_id,
`⚠️ Access Reminder

Your channel access will pause soon.`,
{
  reply_markup: {
    inline_keyboard: [
      [{ text: "Renew Tamil + Bingeme – ₹299", callback_data: "PAY" }]
    ]
  }
});
  }
});
