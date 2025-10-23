import { Telegraf, Markup } from 'telegraf';
import { message } from 'telegraf/filters';
import { code } from 'telegraf/format';
import { sendQuestion, processAnswer } from './utils/index.js';
import { quizData } from './data/index.js';
import { userStateService } from './store/index.js';

console.log('env: ', process.env.NODE_ENV);
const ADMIN_ID = Number(process.env.ADMIN_ID);


const bot = new Telegraf(process.env.TELEGRAMM_BOT_TOKEN || '');

// Команда старта
bot.start(async (ctx) => {
  userStateService.initUserState(ctx.chat.id);
  console.log('user.id: ', ctx.chat.id);
  await ctx.reply('Добро пожаловать в квиз об Информационной панели руководителя!');
  await ctx.reply('Ответьте на несколько вопросов, чтобы получить персонализированную информацию.');
  await sendQuestion(ctx, 0);
});


// Обработка текстовых сообщений (ответы на вопросы)
bot.on('text', async (ctx) => {
  const chatId = ctx.chat.id;
  const userState = userStateService.getUserState(chatId);

  if (!userState || userState.showExtra) return;

  const currentQuestionIndex = userState.currentQuestion;
  const question = quizData.questions[currentQuestionIndex];
  const userAnswer = ctx.message.text;

  if (question.type === 'multiple') {
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
      if (!userState.tempAnswers) userState.tempAnswers = [];

      if (userState.tempAnswers.includes(userAnswer)) {
        userState.tempAnswers = userState.tempAnswers.filter(a => a !== userAnswer);
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
    await processAnswer(ctx, currentQuestionIndex, userAnswer);
  }
});


// Обработка callback-кнопок
bot.action('show_extra', async (ctx) => {
  const chatId = ctx.chat.id;
  const userState = userStateService.getUserState(chatId);
  const currentQuestionIndex = userState.currentQuestion;
  const question = quizData.questions[currentQuestionIndex];
  const lastAnswer = userState.answers[userState.answers.length - 1];
  const response = question.responses[lastAnswer.type];

  userState.showExtra = true;

  await ctx.editMessageReplyMarkup(); // Убираем кнопки
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
});


// Следующий
bot.action('next', async (ctx) => {
  const chatId = ctx.chat.id;
  const userState = userStateService.getUserState(chatId);

  userState.currentQuestion++;
  userState.showExtra = false;

  await ctx.editMessageReplyMarkup(); // Убираем кнопки
  await sendQuestion(ctx, userState.currentQuestion);
});


// Окончание
bot.action('finish', async (ctx) => {
  const chatId = ctx.chat.id;
  const userState = userStateService.getUserState(chatId);

  await ctx.editMessageReplyMarkup(); // Убираем кнопки

  // Анализ результатов
  const positiveAnswers = userState.answers.filter(a => a.type === 'positive').length;
  const totalAnswers = userState.answers.length;

  let conclusion = '';
  if (positiveAnswers === totalAnswers) {
    conclusion = 'Вы отлично понимаете ценность информационной панели! Готовы обсудить индивидуальную настройку?';
  }
  else if (positiveAnswers >= totalAnswers / 2) {
    conclusion = 'Вы видите потенциал инструмента! Предлагаем демо-версию для более глубокого понимания.';
  }
  else {
    conclusion = 'Рекомендуем начать с базового ознакомления. Предлагаем бесплатную консультацию по возможностям панели.';
  }

  await ctx.reply(`🎉 Спасибо за прохождение квиза!\n\n${conclusion}`);
  await ctx.reply('Для связи: example@company.com\nТелефон: +7 (XXX) XXX-XX-XX');

  // Очищаем состояние
  userStateService.deleteUserState(chatId);
});



// Обработка ошибок
bot.catch(async (err, ctx) => {
  console.error(`Error for ${ctx.updateType}:`, err);
});

// Запуск бота
bot.launch().then(() => {
  console.log('Quiz bot started!');
});

// =================================================

console.log(`Starting tg-quiz-bot...`);

process.once('SIGINT', () => {
  console.log('[SIGINT] stop bot!');
  bot.stop('SIGINT');
}); // If nodejs stopped => we will stop bot

process.once('SIGTERM', () => {
  console.log('[SIGTERM] stop bot!');
  bot.stop('SIGTERM');
});


// //t.me/About_dashboards_bot
// git add . && git commit -m "Added typescrypt" && git push -u origin main
