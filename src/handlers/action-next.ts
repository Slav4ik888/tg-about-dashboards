import { Context } from 'telegraf';
import { sendQuestion } from '../utils/index.js';
import { userStateService } from '../store/index.js';


export const actionNext = async (ctx: Context) => {
  console.log('next: ', ctx.message);

  if (!ctx.chat) { console.error('Chat object is undefined. [bot.action next]'); return; }

  const userId = ctx.chat.id;
  const userState = userStateService.getUserState(userId);

  if (!userState) {
    await ctx.reply('Произошла ошибка. Пожалуйста, начните сначала.');
    return;
  }

  userState.currentQuestionIdx++;
  userState.showExtra = false;

  await ctx.editMessageReplyMarkup({ inline_keyboard: [] }); // Убираем кнопки
  await sendQuestion(ctx, userState.currentQuestionIdx);
}
