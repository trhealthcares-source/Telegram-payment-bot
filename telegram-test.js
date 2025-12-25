const bot = require("./bot");

bot.on("message", (msg) => {
  bot.sendMessage(msg.chat.id, "BOT IS ALIVE ✅");
});
