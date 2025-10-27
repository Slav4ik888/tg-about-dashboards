import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { code } from 'telegraf/format';
import { startBot } from './utils/index.js';
import {
  actionFinish, actionMultiselect, actionMultiselectSubmit, actionNext, actionShowExtra, actionSingleselect, onText, replay, start, useLogger
} from './handlers/index.js';


console.log('env: ', process.env.NODE_ENV);

const bot = new Telegraf(process.env.TELEGRAMM_BOT_TOKEN || '');


bot.start(start);
bot.command('replay', replay);

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

// Обработка текстовых сообщений от кнопок
// bot.hears('📋 Помощь', (ctx) => ctx.reply('Выберите команду /help для подробной информации'));
// bot.hears('🍕 Меню', (ctx) => ctx.reply('Используйте /menu для просмотра меню'));
// bot.hears('👤 Профиль', (ctx) => ctx.reply('Используйте /profile для просмотра профиля'));
// bot.hears('⚙️ Настройки', (ctx) => ctx.reply('Раздел настроек - /settings'));
// bot.hears('🤖 Информация', (ctx) => ctx.reply('Информация о боте - /info'));

// Запуск бота
startBot(bot);

// =================================================

// //t.me/About_dashboards_bot
// git add . && git commit -m "Added menu" && git push -u origin main
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
