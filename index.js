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
const FaPattern = "ضصثقفغعهخحجچپشسيبلاتنمكگظطزرذدئو./";

function convertPattern(text){
    let result = "";
    let usedPattern = "";
    let finalPattern = "";
    if(/[a-zA-Z]/.test(text)){
        usedPattern = engPattern;
        finalPattern = FaPattern;
    }else if (/[آ-ی]/.test(text)){
        usedPattern = FaPattern;
        finalPattern = engPattern;
    }
    if (usedPattern.length === 0) return "text pattern is not valid just support english and persian";
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


console.info("Starting Bot");
await bot.launch();
console.info("Bot Launched");

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));