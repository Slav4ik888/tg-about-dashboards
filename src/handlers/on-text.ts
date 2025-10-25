import { Context } from 'telegraf';
import { userStateService } from '../store/index.js';
import { quizData } from '../data/index.js';
import { processAnswer } from '../utils/index.js';


export const onText = async (ctx: Context) => {
  if (! ctx.chat) { console.error('Chat object is undefined. [bot.on]'); return; }
  if (! ctx.message) { console.error('Message object is undefined. [bot.on]'); return; }
  if (! ('text' in ctx.message)) { console.error('Message text is undefined. [bot.on]'); await ctx.reply('Неподдерживаемый тип сообщения. Пожалуйста, отправьте текстовое сообщение.'); return; }

  const userId = ctx.chat.id;
  console.log('ctx.chat: ', ctx.chat);
  const userState = userStateService.getUserState(userId);

  if (! userState || userState.showExtra) return;

  const currentQuestionIndex = userState.currentQuestionIdx;
  const question = quizData.questions[currentQuestionIndex];
  const userAnswer = ctx.message.text;
  console.log('userAnswer: ', userAnswer);

  if (question.type === 'multiple') { // DEPRECATED надо удалить вроде тк SELECTION ниже
    if (userAnswer === '✅ Завершить выбор') {
      if (userState.tempAnswers && userState.tempAnswers.length > 0) {
        await processAnswer(ctx, currentQuestionIndex, userState.tempAnswers);
        userState.tempAnswers = null;
      }
      else {
        await ctx.reply('Пожалуйста, выберите хотя бы один вариант ответа.');
      }
    }
    else {
      if (! userState.tempAnswers) userState.tempAnswers = [];

      if (userState.tempAnswers.includes(userAnswer)) {
        userState.tempAnswers = (userState.tempAnswers as string[]).filter(a => a !== userAnswer);
        await ctx.reply(`✅ Ответ "${userAnswer}" удален из выбора`);
      }
      else {
        userState.tempAnswers.push(userAnswer);
        await ctx.reply(`✅ Ответ "${userAnswer}" добавлен. Выберите еще или нажмите "Завершить выбор"`);
      }

      if (userState.tempAnswers.length > 0) {
        await ctx.reply(`Выбрано: ${userState.tempAnswers.join(', ')}`);
      }
    }
  }
  else {
    console.log('userAnswer [bot.on]: ', userAnswer);
    await processAnswer(ctx, currentQuestionIndex, [userAnswer]);
  }
}
