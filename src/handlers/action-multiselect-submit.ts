import { Context } from 'telegraf';
import { userStateService } from '../store/index.js';
import { multiSelect, processAnswer } from '../utils/index.js';


export const actionMultiselectSubmit = async (ctx: Context) => {
  if (! ctx.chat) { console.error('Chat object is undefined. [bot.action multiselect_submit]'); return; }

  const userId = ctx.chat.id;
  const userState = userStateService.getUserState(userId);

  if (! userState || userState.showExtra) return;

  const currentQuestionIndex = userState.currentQuestionIdx;
  const userAnswer = multiSelect.getSelection(userId);

  ctx.deleteMessage();
  // ctx.reply(`✅ Ваш выбор:\n${userAnswer.map(item => `  • ${item}`).join('\n')}`);

  // Обработка выбранных пунктов
  await processAnswer(ctx, currentQuestionIndex, userAnswer);
  multiSelect.clearSelection(userId);
}
