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

// የሬንደርን ሰርቨር ሊንክ እዚህ ጋር በራስ-ሰር ዌብሁክ እናስረው
const RENDER_URL = "https://onrender.com";

app.use(express.json());

// ሬንደር ፖርት ሲፈትሽ ይህንን ጽሑፍ ያገኛል
app.get('/', (req, res) => {
  res.send('ላዝ ቢንጎ ቦት በሰላም እየሰራ ነው! 🚀');
});

// የቴሌግራም መልዕክቶችን በዌብሁክ መቀበያ መስመር
app.post(`/bot${token}`, (req, res) => {
  bot.handleUpdate(req.body);
  res.sendStatus(200);
});

bot.start((ctx) => {
  const firstName = ctx.from.first_name || "ተጫዋች";
  ctx.reply(
    `እንኳን ወደ ላዝ ቢንጎ በሰላም መጡ፣ ${firstName}! 👋\n\nጨዋታውን ለመጀመር እባክዎ ከታች ያለውን ቁልፍ ተጭነው ስልክ ቁጥርዎን ያጋሩ።`,
    Markup.keyboard([
      [Markup.button.contactRequest('📱 ስልክ ቁጥር ያጋሩ (Share Contact)')]
    ]).oneTime().resize()
  );
});

bot.on('contact', async (ctx) => {
  // ስልኩን ሲያጋራ ቀጥታ የ Play ቁልፍን ያመጣል
  await ctx.reply(
    `✅ ምዝገባዎ ተጠናቋል!\n\nየዲሞ አካውንትዎ ላይ 500 ብር ተጭኗል። አሁን '🎮 ጨዋታ ጀምር (Play)' የሚለውን ቁልፍ ተጭነው ወደ ቢንጎ አዳራሽ መግባት ይችላሉ።`,
    Markup.keyboard([
      [Markup.button.webApp('🎮 ጨዋታ ጀምር (Play)', webAppUrl)]
    ]).resize()
  );
});

// ሰርቨሩ ሲነሳ ዌብሁኩን በራስ-ሰር ቴሌግራም ላይ ያስረዋል
app.listen(PORT, async () => {
  console.log(`ሰርቨሩ በፖርት ${PORT} ላይ ተነስቷል`);
  try {
    await bot.telegram.setWebhook(`${RENDER_URL}/bot${token}`);
    console.log('🔗 ቴሌግራም ዌብሁክ በራስ-ሰር በተሳካ ሁኔታ ተገናኝቷል!');
  } catch (err) {
    console.error('ዌብሁክ ማገናኘት አልተቻለም:', err);
  }
});
