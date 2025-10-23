import { getAnswerType } from './get-answer-type.js';
import { Markup } from 'telegraf';
import { userStateService } from '../../store/index.js';
import { quizData } from '../../data/index.js';


// Обработка ответа и показ результата
export async function processAnswer(ctx, questionIndex, answer) {
  const question = quizData.questions[questionIndex];
  const answerType = getAnswerType(question, answer);
  const response = question.responses[answerType];
  const chatId = ctx.chat.id;
  const userState = userStateService.getUserState(chatId);

  // Сохраняем ответ
  userState.answers.push({
    questionId: question.id,
    answer: answer,
    type: answerType
  });

  // Сбрасываем флаг дополнительной информации
  userState.showExtra = false;

  // Отправляем основной ответ
  if (response.image) {
    await ctx.replyWithPhoto(response.image, {
      caption: response.text
    });
  }
  else {
    await ctx.reply(response.text);
  }

  // Показываем кнопки для навигации
  const isLastQuestion = questionIndex === quizData.questions.length - 1;
  const buttons = [];

  if (response.extra) {
    buttons.push([Markup.button.callback('📚 Показать дополнительную информацию', 'show_extra')]);
  }

  if (isLastQuestion) {
    buttons.push([Markup.button.callback('🏁 Завершить', 'finish')]);
  }
  else {
    buttons.push([Markup.button.callback('➡️ Далее', 'next')]);
  }

  await ctx.reply('Выберите действие:', Markup.inlineKeyboard(buttons));
}
