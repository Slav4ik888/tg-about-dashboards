import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { code } from 'telegraf/format';
import { actionFinish, actionMultiselect, actionMultiselectSubmit, actionNext, actionShowExtra, actionSingleselect, onText, start, useLogger } from './handlers/index.js';

console.log('env: ', process.env.NODE_ENV);

const bot = new Telegraf(process.env.TELEGRAMM_BOT_TOKEN || '');


bot.start(start);
bot.use(useLogger);

bot.on('text', onText); // Обработка текстовых сообщений (ответы на вопросы)

// Обработка singleselect_
bot.action(/singleselect_(\d+)/, actionSingleselect);

// Обработка multiselect_
bot.action(/multiselect_(\d+)/, actionMultiselect);
bot.action('multiselect_submit', actionMultiselectSubmit);

// Обработка callback-кнопок
bot.action('show_extra', actionShowExtra);

bot.action('next', actionNext);
bot.action('finish', actionFinish);

// Обработка ошибок
bot.catch(async (err, ctx) => {
  console.error(`Error for ${ctx.updateType}:`, err);
});

// Запуск бота
bot.launch().then(() => {
  console.log('Quiz bot started!');
});

// =================================================

console.log(`Starting tg-quiz-bot...`);

process.once('SIGINT', () => {
  console.log('[SIGINT] stop bot!');
  bot.stop('SIGINT');
}); // If nodejs stopped => we will stop bot

process.once('SIGTERM', () => {
  console.log('[SIGTERM] stop bot!');
  bot.stop('SIGTERM');
});


// //t.me/About_dashboards_bot
// git add . && git commit -m "Fixed single answers" && git push -u origin main
// npm run build
// npm run dev

// ctx.chat:  {
//   id: 544083780,
//   first_name: 'Вячеслав',
//   last_name: 'Кор',
//   username: 'slava550',
//   type: 'private'
// }

// ctx.from:  {
//   id: 544083780,
//   is_bot: false,
//   first_name: 'Вячеслав',
//   last_name: 'Кор',
//   username: 'slava550',
//   language_code: 'ru',
//   is_premium: true
// }
