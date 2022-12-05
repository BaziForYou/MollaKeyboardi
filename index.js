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



console.info("Starting Bot");
await bot.launch();
console.info("Bot Launched");

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));