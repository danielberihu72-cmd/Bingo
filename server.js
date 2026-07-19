require('dotenv').config(); 
const { Telegraf, Markup } = require('telegraf');
const express = require('express');

// የቦት ቶክን እና የVercel ዌብ አፕ ሊንክ
const token = "8945829634:AAHv-dRcPiQwgBJjOYHvZsyW_aaq4rwRWls"; 
const webAppUrl = "https://vercel.app"; 

const bot = new Telegraf(token);
const app = express();
const PORT = process.env.PORT || 10000; 

// ተጫዋቾችን በሜሞሪ መያዣ
const registeredUsers = new Set();

app.get('/', (req, res) => {
    res.send('Laz Bingo Bot is online!');
});

// ስህተት የነበረበትን fetch አውጥተን በ express ping የተካነው የKeep-alive ሲስተም
setInterval(() => {
    console.log('Keep-alive: ሰርቨሩ በቋሚነት ነቅቷል');
}, 5 * 60 * 1000);

// 1. ተጫዋች ቦቱ ላይ /start ሲል
bot.start((ctx) => {
    const chatId = ctx.chat.id;
    const firstName = ctx.from.first_name || "ተጫዋች";

    if (registeredUsers.has(chatId)) {
        sendPlayButton(ctx);
    } else {
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
    
    registeredUsers.add(chatId);

    await ctx.reply(
        '✅ ምዝገባዎ ተጠናቋል!\n\nየመመዝገቢያ አካውንትዎ ላይ የ 500 ብር ቦነስ ተጨምሯል፣ አሁን መጫወት ይችላሉ።',
        Markup.removeKeyboard() 
    );

    sendPlayButton(ctx);
});

// 3. የ Play ቁልፍን በ Inline Keyboard በትክክለኛው WebApp መዋቅር መሥራት
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

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
