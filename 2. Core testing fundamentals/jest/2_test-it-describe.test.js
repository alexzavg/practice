/**
 * test() / it() / describe() (Jest).
 *
 * - test(name, fn) объявляет отдельный тест.
 * - it(name, fn) — полный синоним test. Отличие только в читабельности:
 *   it('возвращает ноль') читается как предложение.
 * - describe(name, fn) группирует тесты в блок; блоки можно вкладывать.
 * - Имя в отчёте склеивается из имён всех блоков: 'Калькулятор > sum > ...'.
 * - Внутри describe выполняется только объявление тестов, а не их запуск:
 *   сначала Jest собирает всё дерево, потом запускает.
 *
 * Запуск: npx jest "2. Core testing fundamentals/jest/2_test-it-describe.test.js"
 */

const calculator = {
  sum: (a, b) => a + b,
  divide: (a, b) => a / b,
};

describe('Калькулятор', () => {
  describe('sum', () => {
    test('складывает положительные числа', () => {
      expect(calculator.sum(2, 3)).toBe(5);
    });

    it('работает с нулём', () => {
      expect(calculator.sum(5, 0)).toBe(5);
    });
  });

  describe('divide', () => {
    it('делит числа', () => {
      expect(calculator.divide(10, 2)).toBe(5);
    });
  });
});
