import { Context } from 'telegraf';
import { userStateService } from '../store/index.js';
import { sendQuestion, tempMessage } from '../utils/index.js';


export const start = async (ctx: Context) => {
  if (! ctx.chat) { console.error('Chat object is undefined. [bot.start]'); return; }
  if (! ctx.from) { console.error('from object is undefined. [bot.start]'); return; }

  userStateService.initUserState(ctx.chat.id);
  console.log('user.id: ', ctx.chat.id);
  const name = ctx.from.first_name;
  const greating = name ? name + ', добро' : 'Добро';

  await ctx.reply(`${greating} пожаловать в квиз об Информационной панели руководителя!`);

  const res = await ctx.reply(
    'Чтобы получить <u>максимальную пользу от таблицы</u> (которую мы Вам отправим) и применить её, позвольте нам задать несколько вопросов и показать некоторые полезные моменты.',
    { parse_mode: 'HTML' }
  );
  tempMessage.addId(res.chat.id, res.message_id);

  await sendQuestion(ctx, 0);
}
