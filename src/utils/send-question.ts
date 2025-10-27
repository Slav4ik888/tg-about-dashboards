import { Context, Markup } from 'telegraf';
import { quizData } from '../data/index.js';
import { multiSelect, singleSelect, tempMessage } from './index.js';

// Отправка вопроса
export async function sendQuestion(ctx: Context, questionIndex: number) {
  const question = quizData.questions[questionIndex];
  const isLastQuestion = questionIndex === quizData.questions.length - 1;

  const res = await ctx.reply(`Вопрос ${questionIndex + 1} из ${quizData.questions.length}:`);
  console.log('res: ', res.message_id);
  tempMessage.clearTempMessages(ctx, res.chat.id); // Очищаем предыдущие сообщения
  tempMessage.addId(res.chat.id, res.message_id); // Сохраняем новое
  // res:  {
  //   message_id: 268,
  //   from: {
  //     id: 82996136,
  //     is_bot: true,
  //     first_name: 'About dashboards',
  //     username: 'About_dashboards_bot'
  //   },
  //   chat: {
  //     id: 544083780,
  //     first_name: 'Вячеслав',
  //     last_name: 'Кор',
  //     username: 'slava555',
  //     type: 'private'
  //   },
  //   date: 1761575365,
  //   text: 'Вопрос 1/4:'
  // }

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

  const res2 = await ctx.reply(question.text, {
    parse_mode   : 'HTML',
    reply_markup : keyboard,
  });

  tempMessage.addId(res2.chat.id, res2.message_id);
}
