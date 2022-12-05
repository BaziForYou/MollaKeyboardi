import {createRequire} from "module";
const require = createRequire(import.meta.url);
import {Telegraf} from 'telegraf';

require('dotenv').config()
function getENV(envName){ 
    if(process.env[envName] && process.env[envName].length === 0){
      console.error(`Error loading env variable ${envName}`)
      process.exit(1)
    }
    return process.env[envName]
}

console.info("Generating Bot System...");
const bot = new Telegraf(getENV('BOT_TOKEN'));
const ListeningCommands = getENV('Listening_Words').toLowerCase().split(',')

const engPattern = "qwertyuiop[]\\asdfghjkl;'zxcvbnm,./";
const FaPattern = "ضصثقفغعهخحجچپشسیبلاتنمکگظطزرذدئو./";
const FaPattern2 = "ضصثقفغعهخحجچپشسيبلاتنمكگظطزرذدئو./";

function convertPattern(text){
    let result = "";
    let usedPattern = "";
    let finalPattern = "";
    if (/[a-zA-Z]/.test(text)) {
        usedPattern = engPattern;
        finalPattern = FaPattern;
    } else if (/[آ-ی]/.test(text)) {
        usedPattern = FaPattern;
        finalPattern = engPattern;
    } else if (/[آ-ي]/.test(text)) {
        usedPattern = FaPattern2;
        finalPattern = engPattern;
    } else {
        return "text pattern is not valid just support english and persian";
    }
    for(let i = 0; i < text.length; i++){
        let index = usedPattern.indexOf(text[i]);
        if(index !== -1){
            result += finalPattern[index];
        }else{
            result += text[i];
        }
    }
    return result;
}

bot.on('text', async (ctx) => {
    if (ctx.chat.type === "private") {
        if (ctx.message.text.length > 0) {
            const newText = convertPattern(ctx.message.text.toLowerCase());
            await ctx.reply(newText,
                  {reply_to_message_id: ctx.message.message_id});
        } else {
            await ctx.reply("text is empty",
                  {reply_to_message_id: ctx.message.message_id});
        }
    } else if ((ctx.message.text && ctx.message.text.length > 0) && (ctx.chat.type === "group" || ctx.chat.type === "supergroup")) {
      if ((ListeningCommands.includes(ctx.message.text.toLowerCase()) && ctx.message.reply_to_message)) {
        const TargetMessage = ctx.message.reply_to_message.text;
        const newText = convertPattern(TargetMessage.toLowerCase());
        await ctx.reply(newText,
            {reply_to_message_id: ctx.message.message_id});
      }
    }
});

console.info("Starting Bot");
await bot.launch();
console.info("Bot Launched");

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));