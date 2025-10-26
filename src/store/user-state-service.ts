import { TempAnswers, UserAnswer, UserStateServiceType } from './type.js';


class UserStateService {
  private userStates: Map<number, UserStateServiceType>;

  constructor() {
    this.userStates = new Map();
  }

  initUserState(userId: number) {
    this.userStates.set(userId, {
      currentQuestionIdx : 0,
      userAnswers        : [],
      showExtra          : false,
      tempAnswers        : null,
      createdAt          : Date.now()
    });
    return this.getUserState(userId);
  }

  getUserState(userId: number) {
    console.log('userStates: ', this.userStates.get(userId));
    return this.userStates.get(userId);
  }

  updateUserState(userId: number, updates: Partial<UserStateServiceType>) {
    const userState = this.userStates.get(userId);
    if (userState) {
      Object.assign(userState, updates);
      return true;
    }
    return false;
  }

  addAnswer(userId: number, answer: UserAnswer) {
    const userState = this.userStates.get(userId);
    if (userState) {
      userState.userAnswers.push(answer);
      return true;
    }
    return false;
  }

  moveToNextQuestion(userId: number) {
    const userState = this.userStates.get(userId);
    if (userState) {
      userState.currentQuestionIdx++;
      userState.showExtra = false;
      userState.tempAnswers = null;
      return true;
    }
    return false;
  }

  setTempAnswers(userId: number, tempAnswers: TempAnswers) {
    return this.updateUserState(userId, { tempAnswers });
  }

  setShowExtra(userId: number, showExtra: boolean) {
    return this.updateUserState(userId, { showExtra });
  }

  deleteUserState(userId: number) {
    return this.userStates.delete(userId);
  }

  // Для отладки
  getAllStates() {
    return Object.fromEntries(this.userStates);
  }

  // Очистка устаревших состояний (например, старше 24 часов)
  cleanupOldStates() {
    const now = Date.now();
    Array.from(this.userStates.entries()).forEach(([userId, state]) => {
      if (state.createdAt && now - state.createdAt > 24 * 60 * 60 * 1000) {
        this.userStates.delete(userId);
      }
    });
  }
}


export const userStateService = new UserStateService();
