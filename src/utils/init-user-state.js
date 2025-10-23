// Инициализация состояния пользователя
export function initUserState(chatId) {
  userStates.set(chatId, {
    currentQuestion: 0,
    answers: [],
    showExtra: false
  });
}
