import { getAnswerType } from './get-answer-type.js';
import { Markup, Context } from 'telegraf';
import { UserQuestionAnswer, userStateService } from '../../store/index.js';
import { quizData } from '../../data/index.js';
import { tempMessage } from '../../utils/index.js';


// Обработка ответа и показ результата
export async function processAnswer(
  ctx                : Context,
  questionIndex      : number,
  userQuestionAnswer : UserQuestionAnswer
) {
  // ctx.reply('', Markup.removeKeyboard());

  if (! ctx.chat) { console.error('Chat object is undefined. [processAnswer]'); return; }
  tempMessage.clearTempMessages(ctx, ctx.chat.id);

  const question   = quizData.questions[questionIndex];
  const answerType = getAnswerType(question, userQuestionAnswer);
  console.log('answerType: ', answerType);

  const response   = question.responses[answerType];
  console.log('response: ', response);

  const chatId     = ctx.chat.id;
  const userState  = userStateService.getUserState(chatId);

  if (! userState) { console.error('userState is undefined. [processAnswer]'); return; }

  // Сохраняем ответ
  userState.userAnswers.push({
    questionId : question.id,
    answer     : userQuestionAnswer,
    type       : answerType
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

  const res = await ctx.reply('Выберите действие:', Markup.inlineKeyboard(buttons));
  tempMessage.addId(res.chat.id, res.message_id);
}
