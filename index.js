const TelegramBot = require('node-telegram-bot-api');
global.fetch  = require("node-fetch");
const token = '1782203850:AAHTWVDtASTH09qBOqhwVr-QmnA2JD41unU';

const bot = new TelegramBot(token, {polling: true});

const MSG_TEXT = {
	// start: '/start',
	gay: '/gay',
	cat: '/cat',
}

const chats = {};

bot.setMyCommands([
	// {command: '/start', description: 'Запустить бота'},
	{command: '/cat', description: 'Показать котика'},
	// {command: '/gay', description: 'Проверка на пидора'},
]);

const getCat = async(chatId) => {
	await bot.sendMessage(chatId, 'Ищем котика 🐈');
	const response = await fetch('https://api.thecatapi.com/v1/images/search');
	const [ cat ] = await response.json();
	await bot.sendPhoto(chatId, cat.url);
	await bot.sendMessage(chatId, 'Еще котика?', gameOptions);
}

const gameOptions = {
	reply_markup: JSON.stringify({
		inline_keyboard: [
			[{text: 'Да', callback_data: 'show_cat'}, {text: 'Нет', callback_data: 'hide_cat'}, ],
		]
	})
}

bot.on('message', async (msg) => {
	const chatId = msg.chat.id;
	if (chats[chatId] === undefined) {
		chats[chatId] = {};
	}
	switch (msg.text) {
		case MSG_TEXT.cat: 
			getCat(chatId);
			break;
		// case MSG_TEXT.start:
		// 	await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/5a7/cb3/5a7cb3d0-bca6-3459-a3f0-5745d95d54b7/1.webp');
		// 	await bot.sendMessage(chatId, 'Сегодня тут много народа, но для тебя всегда место найдётся!');
		// 	break;
		// case MSG_TEXT.gay:
		// 	const botDate = new Date(Date.now()).toDateString();
		// 	if (chats[chatId].isGayGame === undefined) {
		// 		const isGay = Math.random() < 0.5;
		// 		if (isGay) {
		// 			await bot.sendMessage(chatId, `Сегодня ${msg.chat.first_name} ты пидр`);
		// 			await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/5a7/cb3/5a7cb3d0-bca6-3459-a3f0-5745d95d54b7/256/20.webp');
		// 		} else {
		// 			await bot.sendMessage(chatId, `Сегодня ${msg.chat.first_name} ты не пидр`);
		// 			await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/5a7/cb3/5a7cb3d0-bca6-3459-a3f0-5745d95d54b7/256/16.webp');
		// 		}

		// 		chats[chatId] = {
		// 			...chats[chatId],
		// 			isGayGame: true,
		// 			gayGameDate: botDate,
		// 			isGay: isGay,
		// 		}
		// 	} else if (chats[chatId].isGayGame && botDate === chats[chatId].gayGameDate) {
		// 		if (chats[chatId].isGay) {
		// 			await bot.sendMessage(chatId, `Сегодня ты прошел проверку, и ${msg.chat.first_name} ты пидр, попробуй завтра`);
		// 			await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/5a7/cb3/5a7cb3d0-bca6-3459-a3f0-5745d95d54b7/256/20.webp');
		// 		} else {
		// 			await bot.sendMessage(chatId, `Сегодня ты прошел проверку, и ${msg.chat.first_name} ты не пидр, попробуй завтра`);
		// 			await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/5a7/cb3/5a7cb3d0-bca6-3459-a3f0-5745d95d54b7/256/16.webp');
		// 		}
		// 		[chatId] = {
		// 			...chats[chatId],
		// 		}
		// 	} else {
		// 		const isGay = Math.random() < 0.5;
		// 		if (isGay) {
		// 			await bot.sendMessage(chatId, `Сегодня ${msg.chat.first_name} ты пидр`);
		// 			await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/5a7/cb3/5a7cb3d0-bca6-3459-a3f0-5745d95d54b7/256/20.webp');
		// 		} else {
		// 			await bot.sendMessage(chatId, `Сегодня ${msg.chat.first_name} ты не пидр`);
		// 			await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/5a7/cb3/5a7cb3d0-bca6-3459-a3f0-5745d95d54b7/256/16.webp');
		// 		}

		// 		chats[chatId] = {
		// 			...chats[chatId],
		// 			isGayGame: true,
		// 			gayGameDate: botDate,
		// 			isGay: isGay,
		// 		}
		// 	}
			break;
	}
});

bot.on('callback_query', async (msg) => {
	const data = msg.data;
	const chatId = msg.message.chat.id;
	switch(data) {
		case 'show_cat': 
			getCat(chatId);
			break;
		case 'hide_cat':
			await bot.sendSticker(chatId, 'https://cdn.tlgrm.ru/stickers/ff6/4b6/ff64b611-aa7c-3603-b73c-7cd86d4b71dc/256/4.webp');
			break;	
	}
});


