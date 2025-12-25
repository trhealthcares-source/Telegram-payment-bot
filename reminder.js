const cron = require("node-cron");
const TelegramBot = require("node-telegram-bot-api");
const db = require("./db");

/**
 * IMPORTANT:
 * polling MUST be false here
 * Only telegram.js should use polling
 */
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });

/**
 * Runs every day at 9 AM IST
 * Sends reminder 2 days before expiry
 */
cron.schedule("0 9 * * *", async () => {
  try {
    const result = await db.query(
      `
      SELECT telegram_id
      FROM users
      WHERE paid_until BETWEEN
        NOW() + INTERVAL '2 days'
        AND NOW() + INTERVAL '2 days 1 hour'
      `
    );

    for (const row of result.rows) {
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
  } catch (err) {
    console.error("Reminder job error:", err.message);
  }
});
