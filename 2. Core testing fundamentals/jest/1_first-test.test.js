/**
 * Подключение библиотеки и первый тест (Jest).
 *
 * - Jest сам добавляет в файл глобальные функции: test, it, describe, expect,
 *   хуки. Импортировать их не нужно.
 * - Явный импорт тоже возможен: const { test, expect } = require('@jest/globals').
 * - Файл считается тестовым по имени: *.test.js или *.spec.js.
 * - Структура теста: expect(фактическое).matcher(ожидаемое).
 * - toBe сравнивает через Object.is, toEqual — рекурсивно по значению.
 *
 * Запуск: npx jest "2. Core testing fundamentals/jest/1_first-test.test.js"
 */

function sum(a, b) {
  return a + b;
}

test('sum складывает два числа', () => {
  expect(sum(2, 3)).toBe(5);
});
