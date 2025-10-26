import { quizData } from '../data/data.js';
import { Context } from 'telegraf';
import { userStateService } from '../store/index.js';
import { processAnswer, singleSelect } from '../utils/index.js';


export const actionSingleselect = async (ctx: Context) => {
  if (! ctx.chat) { console.error('Chat object is undefined. [bot.action multiselect_0]'); return; }
  if (! ctx.from) { console.error('from object is undefined. [bot.action multiselect_0]'); return; }

  const userId = ctx.from.id;
  // @ts-ignore
  const optionIndex = parseInt(ctx.match?.[1]);
  // ctx.match:  [
  //   'multiselect_0',
  //   '0',
  //   index: 0,
  //   input: 'multiselect_0',
  //   groups: undefined
  // ]

  // Текущий вопрос
  const userState = userStateService.getUserState(userId);

  if (! userState) return
  const currentQuestionIndex = userState.currentQuestionIdx;
  const userAnswer = quizData.questions[userState.currentQuestionIdx].answers[optionIndex];

  ctx.deleteMessage();
  await processAnswer(ctx, currentQuestionIndex, [userAnswer]);
}
