import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import Application, CommandHandler, ContextTypes

# 1. እዚህ ቦታ ላይ ከቦት ፋዘር (BotFather) ያገኘኸውን የቦት ቶክን (Token) አስገባ
BOT_TOKEN = "የአንተን_ቦት_ቶክን_እዚህ_ተካ"

# የላዝ ቢንጎ ዌብሳይት ሊንክህ
WEB_APP_URL = "https://github.io"

logging.basicConfig(format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    # ቦቱ ሲነሳ ለተጫዋቾች የሚላክ መልእክት
    welcome_text = (
        "🎰 እንኳን ወደ ላዝ ቢንጎ በደህና መጡ! 🎰\n\n"
        "ይህ ማንም ሰው በቀላሉ የማይገልብጠው የእርስዎ ልዩ የቢንጎ ጨዋታ ነው። "
        "ከታች ያለውን 'ላዝ ቢንጎ ክፈት' የሚለውን ቁልፍ በመንካት ጨዋታውን በቀጥታ መጀመር ይችላሉ!"
    )
    
    # የጨዋታ መክፈቻ ቁልፍ (Web App Button)
    keyboard = [
        [InlineKeyboardButton(text="🎰 ላዝ ቢንጎ ክፈት", web_app=WebAppInfo(url=WEB_APP_URL))]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(text=welcome_text, reply_markup=reply_markup)

def main() -> None:
    application = Application.builder().token(BOT_TOKEN).build()
    application.add_handler(CommandHandler("start", start))
    application.run_polling()

if __name__ == "__main__":
    main()
