import { UserQuestionAnswer } from 'store';

// Или более безопасный вариант с фильтрацией не найденных элементов:
export function getSelectedIndexesSafe(answers: UserQuestionAnswer, userSelected: UserQuestionAnswer): number[] {
  return userSelected
    .map(selected => answers.indexOf(selected))
    .filter(index => index !== -1);
}
