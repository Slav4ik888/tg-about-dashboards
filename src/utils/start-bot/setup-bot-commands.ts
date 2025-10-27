import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';

// Функция для установки команд
export async function setupBotCommands(bot: Telegraf<Context<Update>>) {
  try {
    await bot.telegram.setMyCommands([
      { command: 'start', description: '🚀 Начать' },
      { command: 'help', description: '📋 Помощь и команды' },
      // { command: 'menu', description: '🍕 Основное меню' },
      // { command: 'profile', description: '👤 Мой профиль' },
      // { command: 'settings', description: '⚙️ Настройки' },
      { command: 'info', description: '🤖 Информация' },
      { command: 'replay', description: '🔄 Началь заново' }
    ]);
    // console.log('Меню команд установлено!');
  }
  catch (error) {
    console.error('Ошибка установки команд:', error);
  }
}
