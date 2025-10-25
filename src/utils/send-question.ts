import { Context, Markup } from 'telegraf';
import { quizData } from '../data/index.js';
import { multiSelect } from './index.js';

// Отправка вопроса
export async function sendQuestion(ctx: Context, questionIndex: number) {
  const question = quizData.questions[questionIndex];
  const isLastQuestion = questionIndex === quizData.questions.length - 1;


  await ctx.reply(`Вопрос ${questionIndex + 1}/${quizData.questions.length}:`);

  let keyboard;

  if (question.type === 'single') {
    keyboard = Markup.keyboard(
      question.answers.map(answer => [answer])
    ).resize();

    console.log('keyboard: ', keyboard);
  }
  else {
    if (! ctx || ! ctx.from || ! ctx.from.id) {
      console.error('ctx.from.id is undefined. [sendQuestionsendQuestion]');
      return
    }

    const keyboard = multiSelect.createKeyboard(question.answers, ctx.from.id);
    // keyboard.inline_keyboard: [
    //   [{ text: 'Не знаю',                                     callback_data: 'multiselect_0' }],
    //   [{ text: 'Слышал, но не знаю, что это',                 callback_data: 'multiselect_1' }],
    //   [{ text: 'Вроде знаю, но до конца не понимаю, что это', callback_data: 'multiselect_2' }],
    //   [{ text: 'Знаю, видел примеры, но пока не применяю',    callback_data: 'multiselect_3' }],
    //   [{ text: 'Знаю и использую',                            callback_data: 'multiselect_4' }]
    // ];
    ctx.reply(question.text, { reply_markup: keyboard });

    // keyboard = Markup.keyboard([
    //   ...question.answers.map(answer => [answer]),
    //   ['✅ Завершить выбор']
    // ]).resize();
  }

  await ctx.reply(question.text, keyboard);
}
