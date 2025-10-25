import { Context } from 'telegraf';


export const useLogger = async (ctx: Context, next: () => Promise<void>) => {
  if (ctx.message && 'text' in ctx.message) {
    console.log(`Пользователь ${ctx.from?.username} написал: ${ctx.message?.text}`);
  }
  return next();
}
