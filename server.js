// መስመር 1፡ የTelegraf እና Express ጥቅሎችን በትክክለኛው የ CommonJS (require) መንገድ መጥራት
require('dotenv').config(); // የ .env ፋይልን ለማንበብ
const { Telegraf, Markup } = require('telegraf');
const express = require('express');

// መስመር 5፡ የቦት ቶክን እና የVercel ዌብ አፕ ሊንክ አቀማመጥ (https:// መያዝ አለበት!)
const token = "8945829634:AAHv-dRcPiQwgBJjOYHvZsyW_aaq4rv..."; 
const webAppUrl = "https://vercel.app"; 

const bot = new Telegraf(token);
const app = express();
const PORT = process.env.PORT || 10000; 

// ስልካቸውን ያጋሩ ተጫዋቾችን ደጋግሞ እንዳይጠይቅ በሜሞሪ መያዣ
const registeredUsers = new Set();

app.get('/', (req, res) => {
    res.send('Laz Bingo Bot is online!');
});

// Render ሰርቨሩ በነፃ አካውንት እንዳይተኛ በየ 5 ደቂቃው ራሱን ፒንግ ያደርጋል
setInterval(() => {
    // node-fetch ጥቅል ከሌለህ በቀላሉ በ express ወይም አውቶማቲክ በሆነ መንገድ ራሱን ይጠራል
    console.log('Keep-alive: ሰርቨሩ በቋሚነት ነቅቷል');
}, 5 * 60 * 1000);

// 1. ተጫዋች ቦቱ ላይ /start ሲል
bot.start((ctx) => {
    const chatId = ctx.chat.id;
    const firstName = ctx.from.first_name || "ተጫዋች";

    // ተጠቃሚው ቀድሞ ስልኩን ካጋራ ቀጥታ የጨዋታ ቁልፍ ያሳየዋል
    if (registeredUsers.has(chatId)) {
        sendPlayButton(ctx);
    } else {
        // አዲስ ከሆነ ስልክ ቁጥር ይጠይቃል
        ctx.reply(
            `እንኳን ወደ ላኪ ቢንጎ በሰላም መጡ፣ ${firstName}! 👋\n\nለመቀጠል እባክዎ መጀመሪያ ስልክ ቁጥርዎን ያጋሩ።`,
            Markup.keyboard([
                [Markup.button.contactRequest('📱 ስልክ ቁጥር ያጋሩ (Share)')]
            ]).oneTime().resize()
        );
    }
});

// 2. ተጫዋቹ ስልክ ቁጥር ሲያጋራ
bot.on('contact', async (ctx) => {
    const chatId = ctx.chat.id;
    
    // ተጠቃሚውን በSet ውስጥ መመዝገብ (ድጋሚ ስልክ እንዳይጠይቅ)
    registeredUsers.add(chatId);

    await ctx.reply(
        '✅ ምዝገባዎ ተጠናቋል!\n\nየመመዝገቢያ አካውንትዎ ላይ የ 500 ብር ቦነስ ተጨምሯል፣ አሁን መጫወት ይችላሉ።',
        Markup.removeKeyboard() // የስልክ ቁጥር ማጋሪያ ቁልፉን ከታች ያጠፋል
    );

    // ቀጥታ የጨዋታ መክፈቻ ቁልፉን ይልካል
    sendPlayButton(ctx);
});

// 3. የ Play ቁልፍን በ Inline Keyboard (መልእክቱ ስር) በትክክለኛው WebApp መዋቅር መሥራት
function sendPlayButton(ctx) {
    ctx.reply(
        '🎮 ጨዋታውን ለመጀመር ከታች ያለውን "Play" ቁልፍ ይጫኑ፡',
        Markup.inlineKeyboard([
            [Markup.button.webApp('🕹️ ጨዋታ ጀምር (Play)', webAppUrl)]
        ])
    );
}

// ሰርቨሩን ማስነሳት
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// ቦቱን በአስተማማኝ ሁኔታ ማስነሳት
bot.telegram.deleteWebhook().then(() => {
    bot.launch();
    console.log('🎰 Laz Bingo Bot started successfully!');
});

// ሰርቨሩ ሲዘጋ ቦቱ በአግባቡ እንዲቆም
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
