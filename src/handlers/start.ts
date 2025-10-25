import { Context } from 'telegraf';
import { userStateService } from '../store/index.js';
import { sendQuestion } from '../utils/index.js';


export const start = async (ctx: Context) => {
  if (! ctx.chat) { console.error('Chat object is undefined. [bot.start]'); return; }

  userStateService.initUserState(ctx.chat.id);
  console.log('user.id: ', ctx.chat.id);
  await ctx.reply('Добро пожаловать в квиз об Информационной панели руководителя!');
  await ctx.reply('Ответьте на несколько вопросов, чтобы получить персонализированную информацию.');
  await sendQuestion(ctx, 0);
}
