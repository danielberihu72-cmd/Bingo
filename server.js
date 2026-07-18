const { Telegraf, Markup } = require('telegraf');
const express = require('express'); 
require('dotenv').config();

const token = process.env.BOT_TOKEN;
const webAppUrl = process.env.WEBAPP_URL || "https://vercel.app";

if (!token) {
  console.error("ስህተት: BOT_TOKEN አልተገኘም!");
  process.exit(1);
}

const bot = new Telegraf(token);
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('ላዝ ቢንጎ ቦት በሰላም እየሰራ ነው! 🚀');
});

// 1. ተጫዋቹ /start ሲል "Share Contact" ብቻ ያመጣል (Play እዚህ ላይ አይመጣም)
bot.start((ctx) => {
  const firstName = ctx.from.first_name || "ተጫዋች";
  ctx.reply(
    `እንኳን ወደ ላዝ ቢንጎ በሰላም መጡ፣ ${firstName}! 👋\n\nጨዋታውን ለመጀመር እባክዎ ከታች ያለውን ቁልፍ ተጭነው ስልክ ቁጥርዎን ያጋሩ።`,
    Markup.keyboard([
      [Markup.button.contactRequest('📱 ስልክ ቁጥር ያጋሩ (Share Contact)')]
    ]).oneTime().resize()
  );
});

// 2. ተጫዋቹ ስልኩን በትክክል ሲያጋራ ብቻ የ "Play" ቁልፍ ይመጣል
bot.on('contact', async (ctx) => {
  const contact = ctx.message.contact;
  console.log(`ተመዘገበ: ID: ${contact.user_id}, ስም: ${contact.first_name}, ስልክ: ${contact.phone_number}`);

  await ctx.reply(
    `✅ ምзовая ቁጥርዎ ተመዝግቧል!\n\nየዲሞ አካውንትዎ ላይ 500 ብር ተጭኗል። አሁን '🎮 ጨዋታ ጀምር (Play)' የሚለውን ቁልፍ ተጭነው ወደ ቢንጎ አዳራሽ መግባት ይችላሉ።`,
    Markup.keyboard([
      [Markup.button.webApp('🎮 ጨዋታ ጀምር (Play)', webAppUrl)]
    ]).resize()
  );
});

app.listen(PORT, () => {
  console.log(`ሰርቨሩ በፖርት ${PORT} ላይ ተነስቷል`);
  bot.launch();
  console.log('🚀 ቦቱ በፈጣኑ Polling ስራ ጀምሯል!');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
