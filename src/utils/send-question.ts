import { Context, Markup } from 'telegraf';
import { quizData } from '../data/index.js';
import { multiSelect } from './index.js';

// Отправка вопроса
export async function sendQuestion(ctx: Context, questionIndex: number) {
  const question = quizData.questions[questionIndex];
  const isLastQuestion = questionIndex === quizData.questions.length - 1;

  let keyboard;

  if (question.type === 'single') {
    keyboard = Markup.keyboard(
      question.answers.map(answer => [answer])
    ).resize();
  }
  else {
    if (! ctx || ! ctx.from || ! ctx.from.id) {
      console.error('ctx.from.id is undefined. [sendQuestionsendQuestion]');
      return
    }

    const keyboard = multiSelect.createKeyboard(question.answers, ctx.from.id);
    console.log('keyboard: ', keyboard);
    ctx.reply(question.text, { reply_markup: keyboard });

    // keyboard = Markup.keyboard([
    //   ...question.answers.map(answer => [answer]),
    //   ['✅ Завершить выбор']
    // ]).resize();
  }

  await ctx.reply(`Вопрос ${questionIndex + 1}/${quizData.questions.length}:`);
  await ctx.reply(question.text, keyboard);
}
