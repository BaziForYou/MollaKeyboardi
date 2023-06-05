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
const listeningCommands = getENV('Listening_Words').toLowerCase().split(',')


const engPattern = `qwertyuiop[]\\asdfghjkl;'zxcvbnm,./QWETYUIOP{}|ASDFGHJKL:"ZXCVBNM<>?</>`;
const faPattern = `ضصثقفغعهخحجچپشسیبلاتنمکگظطزرذدئو./ًٌٍ،؛,][\\}{|َُِّۀآـ«»:"ةيژؤإأء<>؟</>`;
const expectationSwitch = {
    "R" : "ريال",
    "ريال" : "R"
}

function switchWord(word) {
    return word.split("").map(char => {
        let engIndex = engPattern.indexOf(char);
        let faIndex = faPattern.indexOf(char);
        if (engIndex !== -1) {
            return faPattern[engIndex];
        } else if (faIndex !== -1) {
            return engPattern[faIndex];
        } else {
            return char;
        }
    }).join("");
}

function convertPattern(text) {
    if (/[a-zA-Z]/g.test(text) || /[آ-ی]/g.test(text) || /[آ-ي]/g.test(text) || /[.,\/#!$%\^&\*;:{}=\-_`~()]/g.test(text)) {
        const result = text.split(" ").map(word => {
            const isExpectationSwitch = Object.keys(expectationSwitch).some(key => {
                const regex = new RegExp(key, "g");
                return regex.test(word);
            });
            if (isExpectationSwitch) {
                const expectationSwitchKey = Object.keys(expectationSwitch).find(key => {
                    const regex = new RegExp(key, "g");
                    return regex.test(word);
                });
                const regex = new RegExp(expectationSwitchKey, "g");
                const wordWithoutExpectationSwitchKey = word.replace(regex, "");
                const switchedWord = switchWord(wordWithoutExpectationSwitchKey);
                const expectationSwitchValue = expectationSwitch[expectationSwitchKey];
                const expectationSwitchKeyIndex = word.indexOf(expectationSwitchKey);
                const result = switchedWord.slice(0, expectationSwitchKeyIndex) + expectationSwitchValue + switchedWord.slice(expectationSwitchKeyIndex);
                return result;
            } else {
                return switchWord(word);
            }
        }).join(" ");
        return result;
    } else {
        return "text pattern is not valid just support english and persian";
    }
}

async function workOnMessage(ctx) {
    const currentMessage = ctx.message.caption || ctx.message.text;
    if (ctx.chat.type === "private") {
        if (currentMessage && currentMessage.length > 0) {
            const newText = convertPattern(currentMessage);
            await ctx.reply(newText,
                  {reply_to_message_id: ctx.message.message_id});
        } else {
            await ctx.reply("text is empty",
                  {reply_to_message_id: ctx.message.message_id});
        }
    } else if ((currentMessage && currentMessage.length > 0) && (ctx.chat.type === "group" || ctx.chat.type === "supergroup")) {
      if ((listeningCommands.includes(currentMessage.toLowerCase()) && ctx.message.reply_to_message)) {
        const targetMessage = ctx.message.reply_to_message.caption || ctx.message.reply_to_message.text;
        if (targetMessage) {
            const newText = convertPattern(targetMessage);
            await ctx.reply(newText,
                {reply_to_message_id: ctx.message.message_id});
        }
      }
    }
}

bot.on('text', workOnMessage);
bot.on('photo', workOnMessage);
bot.on('sticker', workOnMessage);
bot.on('video', workOnMessage);
bot.on('video_note', workOnMessage);
bot.on('voice', workOnMessage);
bot.on('audio', workOnMessage);
bot.on('animation', workOnMessage);
bot.on('document', workOnMessage);
bot.on('poll', workOnMessage);
bot.on('contact', workOnMessage);
bot.on('location', workOnMessage);

console.info("Starting Bot");
await bot.launch();
console.info("Bot Launched");

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));