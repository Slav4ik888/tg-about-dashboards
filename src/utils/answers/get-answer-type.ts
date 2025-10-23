


// Определение типа ответа (positive/negative)
export function getAnswerType(question, answer) {
  const positiveIndicators = {
    1: [3, 4], // Знаю, видел примеры / Знаю и использую
    2: [0, 1, 2], // Положительные варианты пользы
    3: [3, 4], // Можно / Да, было бы хорошо
    4: [0] // Уже есть панель
  };

  if (question.type === 'single') {
    return positiveIndicators[question.id]?.includes(answer) ? 'positive' : 'negative';
  } else {
    // Для множественного выбора считаем positive, если есть хотя бы один положительный ответ
    const hasPositive = answer.some(a => positiveIndicators[question.id]?.includes(a));
    return hasPositive ? 'positive' : 'negative';
  }
}
