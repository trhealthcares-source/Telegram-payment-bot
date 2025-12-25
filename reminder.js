const cron = require("node-cron");
const db = require("./db");
const bot = require("./bot"); // 👈 SAME bot, no new instance

cron.schedule("0 9 * * *", async () => {
  const res = await db.query(
    `
    SELECT telegram_id
    FROM users
    WHERE paid_until BETWEEN
      NOW() + INTERVAL '2 days'
      AND NOW() + INTERVAL '2 days 1 hour'
    `
  );

  for (const row of res.rows) {
    await bot.sendMessage(
      row.telegram_id,
`⚠️ Access Reminder

Your channel access will pause soon.

Renew to continue 👇`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Renew Tamil + Bingeme – ₹299", callback_data: "PAY" }]
          ]
        }
      }
    );
  }
});
