class MultiSelect {
  private userSelections: Map<number, string[]>;
  constructor() {
    this.userSelections = new Map();
  }

  // Создаёт список кнопок (вопросов)
  createKeyboard(options: string[], userId: number) {
    const userSelection = this.userSelections.get(userId) || [];

    const keyboard = options.map(option => [{
      text: `${userSelection.includes(option) ? '✅ ' : ''}${option}`,
      callback_data: `multiselect_${options.indexOf(option)}`
    }]);

    if (userSelection.length > 0) {
      keyboard.push([{
        text: `📨 Отправить (${userSelection.length})`,
        callback_data: 'multiselect_submit'
      }]);
    }

    return { inline_keyboard: keyboard };
  }


  toggleSelection(userId: number, optionIndex: number, options: string[]) {
    if (! this.userSelections.has(userId)) {
      this.userSelections.set(userId, []);
    }

    const userSelection = this.userSelections.get(userId) || [];
    const option = options[optionIndex];

    const index = userSelection.indexOf(option);
    if (index > -1) {
      userSelection.splice(index, 1);
    }
    else {
      userSelection.push(option);
    }

    return userSelection;
  }

  getSelection(userId: number) {
    return this.userSelections.get(userId) || [];
  }

  clearSelection(userId: number) {
    this.userSelections.delete(userId);
  }
}


export const multiSelect = new MultiSelect();
