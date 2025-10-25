import { getSelectedIndexesSafe } from '..';


describe('getSelectedIndexesSafe', () => {
  test('valid', () => {
    const answers = [
      'Не знаю',
      'Слышал, но не знаю, что это',
      'Вроде знаю, но до конца не понимаю, что это',
      'Знаю, видел примеры, но пока не применяю',
      'Знаю и использую'
    ];

    const userSelected = [
      'Слышал, но не знаю, что это',
      'Вроде знаю, но до конца не понимаю, что это',
      'Отсутствующий ответ'
    ];
    expect(getSelectedIndexesSafe(answers, userSelected)).toEqual([1, 2]);
  });
});

// npm run test:unit get-selected-indexes-safe.test.ts
