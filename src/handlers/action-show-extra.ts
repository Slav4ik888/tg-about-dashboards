import { quizData } from '../data/data.js';
import { Context, Markup } from 'telegraf';
import { userStateService } from '../store/index.js';


export const actionShowExtra = async (ctx: Context) => {
  console.log('show_extra: ', ctx.message);

  if (! ctx.chat) { console.error('Chat object is undefined. [bot.action show_extra]'); return; }

  const userId = ctx.chat.id;
  const userState = userStateService.getUserState(userId);

  if (!userState) {
    await ctx.reply('Произошла ошибка. Пожалуйста, начните сначала.');
    return;
  }

  const currentQuestionIndex = userState.currentQuestionIdx;
  const question             = quizData.questions[currentQuestionIndex];
  const lastAnswer           = userState.userAnswers[userState.userAnswers.length - 1];
  const response             = question.responses[lastAnswer.type];

  userState.showExtra = true;

  await ctx.editMessageReplyMarkup({ inline_keyboard: [] }); // Убираем кнопки
  await ctx.reply(response.extra);

  // Показываем кнопки снова
  const isLastQuestion = currentQuestionIndex === quizData.questions.length - 1;
  const buttons = [];

  if (isLastQuestion) {
    buttons.push([Markup.button.callback('🏁 Завершить', 'finish')]);
  }
  else {
    buttons.push([Markup.button.callback('➡️ Далее', 'next')]);
  }

  await ctx.reply('Продолжим?', Markup.inlineKeyboard(buttons));
}
