class SingleSelect {
  // Создаёт список кнопок (вопросов)
  createKeyboard(options: string[]) {
    const keyboard = options.map((option, idx) => [{
      text: option,
      callback_data: `singleselect_${idx}`
    }]);

    return { inline_keyboard: keyboard };
  }
}


export const singleSelect = new SingleSelect();
