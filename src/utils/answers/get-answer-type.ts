import { Question } from 'data/index.js';
import { UserAnswerType, UserQuestionAnswer } from 'store/index.js';
import { getSelectedIndexesSafe } from './get-selected-indexes-safe/index.js';


const getResult = (status: boolean): UserAnswerType => status ? 'positive' : 'negative';

// Определение типа ответа (positive/negative)
export function getAnswerType(
  question           : Question,
  userQuestionAnswer : UserQuestionAnswer
): UserAnswerType {
  const positiveIndicators: { [key: number]: number[] } = {
    1: [3, 4],    // Знаю, видел примеры / Знаю и использую
    2: [0, 1, 2], // Положительные варианты пользы
    3: [3, 4],    // Можно / Да, было бы хорошо
    4: [0]        // Уже есть панель
  };

  const userQuestionAnswerIdx = getSelectedIndexesSafe(question.answers, userQuestionAnswer);

  let result;
  if (question.type === 'single') {
    result = positiveIndicators[question.id]?.includes(userQuestionAnswerIdx[0])
  }
  else {
    // Для множественного выбора считаем positive, если есть хотя бы один положительный ответ
    result = userQuestionAnswerIdx.some(a => positiveIndicators[question.id]?.includes(a));
  }
  return getResult(result);
}
