import { Telegraf, Markup, Context } from 'telegraf';
import { message } from 'telegraf/filters';
import { code } from 'telegraf/format';
import { sendQuestion, processAnswer, multiSelect } from './utils/index.js';
import { quizData } from './data/index.js';
import { userStateService } from './store/index.js';

console.log('env: ', process.env.NODE_ENV);
const ADMIN_ID = Number(process.env.ADMIN_ID);


const bot = new Telegraf(process.env.TELEGRAMM_BOT_TOKEN || '');

// Команда старта
bot.start(async (ctx: Context) => {
  if (! ctx.chat) {
    console.error('Chat object is undefined. [bot.start]');
    return;
  }

  userStateService.initUserState(ctx.chat.id);
  console.log('user.id: ', ctx.chat.id);
  await ctx.reply('Добро пожаловать в квиз об Информационной панели руководителя!');
  await ctx.reply('Ответьте на несколько вопросов, чтобы получить персонализированную информацию.');
  await sendQuestion(ctx, 0);
});


// Логируем все текстовые сообщения
bot.use((ctx: Context, next) => {
  if (ctx.message && 'text' in ctx.message) {
    console.log(`Пользователь ${ctx.from?.username} написал: ${ctx.message?.text}`);
  }
  return next();
});


// Обработка текстовых сообщений (ответы на вопросы)
bot.on('text', async (ctx: Context) => {
  if (! ctx.chat) {
    console.error('Chat object is undefined. [bot.hears]');
    return;
  }
  if (! ctx.message) {
    console.error('Message object is undefined. [bot.hears]');
    return;
  }

  // Check if message has text property
  if (! ('text' in ctx.message)) {
    console.error('Message text is undefined. [bot.hears]');
    await ctx.reply('Неподдерживаемый тип сообщения. Пожалуйста, отправьте текстовое сообщение.');
    return;
  }

  const userId = ctx.chat.id;
  console.log('ctx.chat: ', ctx.chat);
  const userState = userStateService.getUserState(userId);

  if (! userState || userState.showExtra) return;

  const currentQuestionIndex = userState.currentQuestionIdx;
  const question = quizData.questions[currentQuestionIndex];
  const userAnswer = ctx.message.text;
  console.log('userAnswer: ', userAnswer);

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


// ОБРАБОТКА МУЛЬТISELECT
// const FRUITS = ['🍎 Яблоко', '🍌 Банан', '🍊 Апельсин', '🍇 Виноград', '🍓 Клубника'];

// bot.command('multiselect', (ctx) => {
//   const keyboard = multiSelect.createKeyboard(FRUITS, ctx.from.id);
//   ctx.reply('Выберите фрукты (можно несколько):', { reply_markup: keyboard });
// });

bot.action(/multiselect_(\d+)/, (ctx) => {
  const userId = ctx.from.id;
  const optionIndex = parseInt(ctx.match[1]);

  // Текущий вопрос
  const userState = userStateService.getUserState(userId);
  if (! userState) return

  const question = quizData.questions[userState.currentQuestionIdx];
  multiSelect.toggleSelection(userId, optionIndex, question.answers);

  const updatedKeyboard = multiSelect.createKeyboard(question.answers, userId);
  ctx.editMessageReplyMarkup(updatedKeyboard);
  ctx.answerCbQuery();
});

bot.action('multiselect_submit', (ctx) => {
    const userId = ctx.from.id;
    const selection = multiSelect.getSelection(userId);
    console.log('selection: ', selection);

    ctx.deleteMessage();
    ctx.reply(`✅ Ваш выбор:\n${selection.map(item => `• ${item}`).join('\n')}`);

    // Дальнейшая обработка массива selection
    processUserSelection(userId, selection);

    multiSelect.clearSelection(userId);
});

function processUserSelection(userId: number, selection: string[]) {
  console.log(`Пользователь ${userId} выбрал:`, selection);
  // Здесь ваша логика обработки выбранных options
}


// Обработка callback-кнопок
bot.action('show_extra', async (ctx: Context) => {
  console.log('show_extra: ', ctx.message);

  if (!ctx.chat) {
    console.error('Chat object is undefined. [bot.action show_extra]');
    return;
  }

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
});


// Следующий
bot.action('next', async (ctx: Context) => {
  console.log('next: ', ctx.message);

  if (!ctx.chat) {
    console.error('Chat object is undefined. [bot.action next]');
    return;
  }

  const userId = ctx.chat.id;
  const userState = userStateService.getUserState(userId);

  if (!userState) {
    await ctx.reply('Произошла ошибка. Пожалуйста, начните сначала.');
    return;
  }

  userState.currentQuestionIdx++;
  userState.showExtra = false;

  await ctx.editMessageReplyMarkup({ inline_keyboard: [] }); // Убираем кнопки
  await sendQuestion(ctx, userState.currentQuestionIdx);
});


// Окончание
bot.action('finish', async (ctx: Context) => {
  console.log('finish: ', ctx.message);

  if (! ctx.chat) {
    console.error('Chat object is undefined. [bot.action finish]');
    return;
  }

  const userId = ctx.chat.id;
  const userState = userStateService.getUserState(userId);

  if (!userState) {
    await ctx.reply('Произошла ошибка. Пожалуйста, начните сначала.');
    return;
  }

  await ctx.editMessageReplyMarkup({ inline_keyboard: [] }); // Убираем кнопки

  // Анализ результатов
  const positiveAnswers = userState.userAnswers.filter((a: any) => a.type === 'positive').length;
  const totalAnswers = userState.userAnswers.length;

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
  userStateService.deleteUserState(userId);
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
// git add . && git commit -m "Added selection" && git push -u origin main
// npm run build
// npm run dev
