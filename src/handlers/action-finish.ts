import { Context } from 'telegraf';
import { userStateService } from '../store/index.js';


export const actionFinish = async (ctx: Context) => {
  console.log('finish: ', ctx.message);

  if (! ctx.chat) { console.error('Chat object is undefined. [bot.action finish]'); return; }

  const userId = ctx.chat.id;
  const userState = userStateService.getUserState(userId);

  if (!userState) {
    await ctx.reply('Произошла ошибка. Пожалуйста, начните сначала.');
    return;
  }

  await ctx.editMessageReplyMarkup({ inline_keyboard: [] }); // Убираем кнопки

  // Анализ результатов
  const positiveAnswers = userState.userAnswers.filter((a: any) => a.type === 'positive').length;
  const totalAnswers = userState.userAnswers.length;

  let conclusion = '';
  if (positiveAnswers === totalAnswers) {
    conclusion = 'Вы отлично понимаете ценность информационной панели! Готовы обсудить индивидуальную настройку?';
  }
  else if (positiveAnswers >= totalAnswers / 2) {
    conclusion = 'Вы видите потенциал инструмента! Предлагаем демо-версию для более глубокого понимания.';
  }
  else {
    conclusion = 'Рекомендуем начать с базового ознакомления. Предлагаем бесплатную консультацию по возможностям панели.';
  }

  await ctx.reply(`🎉 Спасибо за прохождение квиза!\n\n${conclusion}`);
  await ctx.reply('Для связи: example@company.com\nТелефон: +7 (XXX) XXX-XX-XX');

  // Очищаем состояние
  userStateService.deleteUserState(userId);
}
