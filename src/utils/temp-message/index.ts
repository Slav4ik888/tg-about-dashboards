import { Context } from 'telegraf';


/** Сохраняет messagesIds тех сообщений, которые позже надо удалять, чтобы визуально не мешали */
class TempMessage {
  private messagesIds: Map<number, number[]>;

  constructor() {
    this.messagesIds = new Map();
  }

  // Добавляем id сообщения, которое позже нужно удалить
  addId(userId: number, messageId: number) {
    if (! this.messagesIds.has(userId)) {
      this.messagesIds.set(userId, []);
    }
    const userIds = this.messagesIds.get(userId) || [];
    userIds.push(messageId);

    console.log('this.messagesIds: ', this.messagesIds);
  }

  getIds(userId: number) {
    return this.messagesIds.get(userId) || [];
  }

  // Очищаем сообщения
  async clearTempMessages(ctx: Context, userId: number) {
    const userIds = this.messagesIds.get(userId) || [];

    if (! userIds.length || ! ctx.chat) return;

    this.messagesIds.delete(userId);

    for (const messageId of userIds) {
      try {
        await ctx.telegram.deleteMessage(ctx.chat.id, messageId);
      }
      catch (error) {
        if (error instanceof Error && 'code' in error && (error as any).code === 400) {
          console.log('Ошибка при очистке сообщений: ', error);
        }
      }
    }
  }
}


/** Сохраняет messagesIds тех сообщений, которые позже надо удалять, чтобы визуально не мешали */
export const tempMessage = new TempMessage();
