import { Context } from 'telegraf';
import { userStateService } from '../store/index.js';
import { sendQuestion } from '../utils/index.js';


export const replay = async (ctx: Context) => {
  if (! ctx.chat) { console.error('Chat object is undefined. [bot.start]'); return; }
  if (! ctx.from) { console.error('from object is undefined. [bot.start]'); return; }

  userStateService.initUserState(ctx.chat.id);

  await ctx.reply('Давайте пройдём ещё раз 👍!');
  await sendQuestion(ctx, 0);
}
