

// Отправка вопроса
export async function sendQuestion(ctx, questionIndex) {
  const question = quizData.questions[questionIndex];
  const isLastQuestion = questionIndex === quizData.questions.length - 1;

  let keyboard;

  if (question.type === 'single') {
    keyboard = Markup.keyboard(
      question.answers.map(answer => [answer])
    ).resize();
  } else {
    keyboard = Markup.keyboard([
      ...question.answers.map(answer => [answer]),
      ['✅ Завершить выбор']
    ]).resize();
  }

  await ctx.reply(`Вопрос ${questionIndex + 1}/${quizData.questions.length}:`);
  await ctx.reply(question.text, keyboard);
}
