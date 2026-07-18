const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();

const token = process.env.BOT_TOKEN;
const webAppUrl = process.env.WEBAPP_URL || "https://google.com";

if (!token) {
  console.error("ስህተት: BOT_TOKEN አልተገኘም!");
  process.exit(1);
}

const bot = new Telegraf(token);

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
  const contact = ctx.message.contact;
  console.log(`ተመዘገበ: ID: ${contact.user_id}, ስም: ${contact.first_name}, ስልክ: ${contact.phone_number}`);

  await ctx.reply(
    `✅ ምዝገባዎ ተጠናቋል!\n\nየዲሞ አካውንትዎ ላይ 500 ብር ተጭኗል። አሁን '🎮 ጨዋታ ጀምር (Play)' የሚለውን ቁልፍ ተጭነው ወደ ቢንጎ አዳራሽ መግባት ይችላሉ።`,
    Markup.keyboard([
      [Markup.button.webApp('🎮 ጨዋታ ጀምር (Play)', webAppUrl)]
    ]).resize()
  );
});

bot.launch().then(() => {
  console.log('🚀 የላዝ ቢንጎ ቴሌግራም ቦት በተሳካ ሁኔታ ስራ ጀምሯል!');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
