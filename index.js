const TelegramBot = require('node-telegram-bot-api');
const {gameOption, againOption} = require('./options.js');
require('dotenv').config()


const token = process.env.TOKEN;

const bot = new TelegramBot(token, {polling: true});

const chats = {}

bot.setMyCommands([
    {command: '/start', description: 'Начальное привествие'},
    {command: '/info', description: 'Получить информацию о пользователе'},
    {command: '/game', description: 'Игра'}
]);

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, отгодай ее');
    chats[chatId] = Math.floor(Math.random() * 10);
    await bot.sendMessage(chatId, 'Отгадывай', gameOption);
}

const start = () => {
    bot.on('message', async (msg) => {

        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/12.webp')
            return bot.sendMessage(chatId, 'Привет, это DRAFT бот');
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут, ${msg.from.first_name} ${msg.from.last_name} твой ник ${msg.from.username}`);
        }
        if (text === '/game') {
            return startGame(chatId);
        }

        return bot.sendMessage(chatId, 'Я тебя не понимаю')
    })

    bot.on('callback_query', async (msg) => {
        const {data} = msg;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId)
        }
        if (chats[chatId] === data) {
            await bot.sendMessage(chatId, `Ты угадал цифру ${chats[chatId]}`, againOption);
        } else {
            await bot.sendMessage(chatId, `К сожалениюе, ты не угадал, бот загадал цифру ${chats[chatId]}`, againOption);
        }
    })
}

start()