const { Telegraf, Markup } = require('telegraf');
const express = require('express'); 
require('dotenv').config();

const token = process.env.BOT_TOKEN;
const webAppUrl = process.env.WEBAPP_URL || "https://vercel.app";

if (!token) {
  console.error("Error: BOT_TOKEN missing!");
  process.exit(1);
}

const bot = new Telegraf(token);
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Laz Bingo Bot is online!');
});

// 1. ተጫዋቹ /start ሲል ስልክ ቁጥር ማጋሪያ ብቻ ያመጣል
bot.start((ctx) => {
  const firstName = ctx.from.first_name || "ተጫዋች";
  ctx.reply(
    `እንኳን ወደ ላዝ ቢንጎ በሰላም መጡ፣ ${firstName}! 👋\n\nጨዋታውን ለመጀመር እባክዎ ከታች ያለውን ቁልፍ ተጭነው ስልክ ቁጥርዎን ያጋሩ።`,
    Markup.keyboard([
      [Markup.button.contactRequest('📱 ስልክ ቁጥር ያጋሩ (Share Contact)')]
    ]).oneTime().resize()
  );
});

// 2. ስልኩን ሲያጋራ ብቻ የ Play ቁልፍ ያመጣል
bot.on('contact', async (ctx) => {
  await ctx.reply(
    `✅ ምዝገባዎ ተጠናቋል!\n\nየዲሞ አካውንትዎ ላይ 500 ብር ተጭኗል። አሁን ከታች ያለውን የጨዋታ ጀምር ቁልፍ ተጭነው መግባት ይችላሉ።`,
    Markup.keyboard([
      [Markup.button.webApp('🎮 ጨዋታ ጀምር (Play)', webAppUrl)]
    ]).resize()
  );
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // የቀድሞውን ዌብሁክ አጥፍቶ በፖሊንግ ያስነሳል
  bot.telegram.deleteWebhook().then(() => {
    bot.launch();
    console.log('🚀 Laz Bingo Bot started successfully!');
  }).catch((err) => {
    console.error('Webhook delete error:', err);
    bot.launch();
  });
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
