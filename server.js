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

// ሬንደር ፖርት ሲፈትሽ ዝም ብሎ እንዲያልፍ
app.get('/', (req, res) => {
  res.send('ላዝ ቢንጎ ቦት በሰላም እየሰራ ነው! 🚀');
});

// 1. ተጫዋቹ /start ሲል
bot.start((ctx) => {
  const firstName = ctx.from.first_name || "ተጫዋች";
  ctx.reply(
    `እንኳን ወደ ላዝ ቢንጎ በሰላም መጡ፣ ${firstName}! 👋\n\nጨዋታውን ለመጀመር እባክዎ ከታች ያለውን ቁልፍ ተጭነው ስልክ ቁጥርዎን ያጋሩ።`,
    Markup.keyboard([
      [Markup.button.contactRequest('📱 ስልክ ቁጥር ያጋሩ (Share Contact)')]
    ]).oneTime().resize()
  );
});

// 2. ተጫዋቹ ስልክ ሲያጋራ (የ Play ቁልፍ ማምጫ)
bot.on('contact', async (ctx) => {
  await ctx.reply(
    `✅ ምዝገባዎ ተጠናቋል!\n\nየዲሞ አካውንትዎ ላይ 500 ብር ተጭኗል። አሁን '🎮 ጨዋታ ጀምር (Play)' የሚለውን ቁልፍ ተጭነው ወደ ቢንጎ አዳራሽ መግባት ይችላሉ።`,
    Markup.keyboard([
      [Markup.button.webApp('🎮 ጨዋታ ጀምር (Play)', webAppUrl)]
    ]).resize()
  );
});

// ሰርቨሩን እና ቦቱን በፖሊንግ ማስተናገድ
app.listen(PORT, async () => {
  console.log(`ሰርቨሩ በፖርት ${PORT} ላይ ተነስቷል`);
  try {
    // የቀድሞውን የተበላሸ ዌብሁክ ሙሉ በሙሉ ያጠፋል
    await bot.telegram.deleteWebhook();
    
    // ቦቱን በቀጥታ እና ፈጣን በሆነው Polling ያስነሳል
    bot.launch();
    console.log('🚀 ቦቱ በፈጣኑ የ Polling ማስተላለፊያ ስራ ጀምሯል!');
  } catch (err) {
    console.error('ስህተት አጋጥሟል:', err);
  }
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
