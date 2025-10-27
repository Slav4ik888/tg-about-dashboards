import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { setupBotCommands } from './setup-bot-commands.js';


/** Запуск бота */
export async function startBot(bot: Telegraf<Context<Update>>) {
  try {
    // Устанавливаем команды при запуске
    await setupBotCommands(bot);

    // Запускаем бота
    bot.launch()
    console.log('🤖 Бот успешно запущен!');

    // Включаем graceful stop
    process.once('SIGINT', () => {
      console.log('[SIGINT] stop bot!');
      bot.stop('SIGINT');
    }); // If nodejs stopped => we will stop bot

    process.once('SIGTERM', () => {
      console.log('[SIGTERM] stop bot!');
      bot.stop('SIGTERM');
    });
  }
  catch (error) {
    console.error('❌ Ошибка запуска бота:', error);
  }
}
