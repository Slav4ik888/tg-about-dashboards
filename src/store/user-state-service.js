class UserStateService {
  constructor() {
    this.userStates = new Map();
  }

  initUserState(chatId) {
    this.userStates.set(chatId, {
      currentQuestion: 0,
      answers: [],
      showExtra: false,
      tempAnswers: null
    });
    return this.getUserState(chatId);
  }

  getUserState(chatId) {
    return this.userStates.get(chatId);
  }

  updateUserState(chatId, updates) {
    const userState = this.userStates.get(chatId);
    if (userState) {
      Object.assign(userState, updates);
      return true;
    }
    return false;
  }

  addAnswer(chatId, answer) {
    const userState = this.userStates.get(chatId);
    if (userState) {
      userState.answers.push(answer);
      return true;
    }
    return false;
  }

  moveToNextQuestion(chatId) {
    const userState = this.userStates.get(chatId);
    if (userState) {
      userState.currentQuestion++;
      userState.showExtra = false;
      userState.tempAnswers = null;
      return true;
    }
    return false;
  }

  setTempAnswers(chatId, tempAnswers) {
    return this.updateUserState(chatId, { tempAnswers });
  }

  setShowExtra(chatId, showExtra) {
    return this.updateUserState(chatId, { showExtra });
  }

  deleteUserState(chatId) {
    return this.userStates.delete(chatId);
  }

  // Для отладки
  getAllStates() {
    return Object.fromEntries(this.userStates);
  }

  // Очистка устаревших состояний (например, старше 24 часов)
  cleanupOldStates() {
    const now = Date.now();
    for (const [chatId, state] of this.userStates.entries()) {
      if (state.createdAt && now - state.createdAt > 24 * 60 * 60 * 1000) {
        this.userStates.delete(chatId);
      }
    }
  }
}


export const userStateService = new UserStateService();
