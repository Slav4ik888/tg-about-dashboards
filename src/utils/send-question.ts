import { Context, Markup } from 'telegraf';
import { quizData } from '../data/index.js';
import { multiSelect, singleSelect } from './index.js';

// Отправка вопроса
export async function sendQuestion(ctx: Context, questionIndex: number) {
  const question = quizData.questions[questionIndex];
  const isLastQuestion = questionIndex === quizData.questions.length - 1;

  const res = await ctx.reply(`Вопрос ${questionIndex + 1}/${quizData.questions.length}:`);
  const message_ids = [res.message_id];

  let keyboard;

  if (question.type === 'single') {
    keyboard = singleSelect.createKeyboard(question.answers);
  }
  else {
    if (! ctx || ! ctx.from || ! ctx.from.id) {
      console.error('ctx.from.id is undefined. [sendQuestionsendQuestion]');
      return
    }

    keyboard = multiSelect.createKeyboard(question.answers, ctx.from.id);
    // keyboard.inline_keyboard: [
    //   [{ text: 'Не знаю',                                     callback_data: 'multiselect_0' }],
    //   [{ text: 'Слышал, но не знаю, что это',                 callback_data: 'multiselect_1' }],
    //   [{ text: 'Вроде знаю, но до конца не понимаю, что это', callback_data: 'multiselect_2' }],
    //   [{ text: 'Знаю, видел примеры, но пока не применяю',    callback_data: 'multiselect_3' }],
    //   [{ text: 'Знаю и использую',                            callback_data: 'multiselect_4' }]
    // ];
  }

  // ctx.reply('Клавиатура удалена', Markup.removeKeyboard());
  const res2 = await ctx.reply(question.text, {
    parse_mode   : 'HTML',
    reply_markup : keyboard,
  });

  message_ids.push(res2.message_id);
  await ctx.deleteMessages(message_ids);
}
