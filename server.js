require('dotenv').config(); 
const { Telegraf, Markup } = require('telegraf');
const express = require('express');

// እውነተኛውን ሙሉ የቦት ቶክን እዚህ አስገባ
const token = "8945829634:AAHv-dRcPiQwgBJjOYHvZsyW_aaq4rv..."; 
const webAppUrl = "https://vercel.app"; 

const bot = new Telegraf(token);
const app = express();
const PORT = process.env.PORT || 10000; 

// ተጫዋቾችን በሜሞሪ መያዣ
const registeredUsers = new Set();

app.get('/', (req, res) => {
    res.send('🎰 ላኪ ቢንጎ ቦት ዝግጁ ነው!');
});

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
    
    // ተጠቃሚውን መመዝገብ (ድጋሚ ስልክ እንዳይጠይቅ)
    registeredUsers.add(chatId);

    await ctx.reply(
        '✅ ምዝገባዎ ተጠናቋል!\n\nየመመዝገቢያ አካውንትዎ ላይ የ 500 ብር ቦነስ ተጨምሯል፣ አሁን መጫወት ይችላሉ።',
        Markup.removeKeyboard() // የስልክ ቁጥር ማጋሪያ ቁልፉን ያጠፋል
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

// 🔴 ዋናው ማስተካከያ፡ የድሮ ዌብሁክ አጥፍቶ ቦቱን 100% በአስተማማኝ ሁኔታ ማስነሻ
bot.telegram.deleteWebhook().then(() => {
    bot.launch().then(() => {
        console.log('🎰 Laz Bingo Bot started successfully!');
    }).catch(err => {
        console.error('Bot launch error:', err);
    });
}).catch(err => {
    console.error('Webhook delete error:', err);
});

// ሰርቨሩ ሲዘጋ ቦቱ በአግባቡ እንዲቆም
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
