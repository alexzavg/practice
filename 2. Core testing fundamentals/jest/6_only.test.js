/**
 * only() — запуск одного теста (Jest).
 *
 * - test.only / it.only / describe.only запускают только помеченные тесты,
 *   остальные в этом файле получают статус skipped.
 * - fit и fdescribe — короткие синонимы only ("focused").
 * - Инструмент для отладки: сузить прогон до одного падающего теста.
 * - only действует в пределах файла, а не всего прогона: другие файлы
 *   всё равно выполнятся. Чтобы сузить прогон целиком, передайте путь к файлу
 *   или ключ -t с именем теста.
 * - Главный риск: забытый only тихо выключает соседние тесты. Ловится
 *   правилом ESLint no-focused-tests или запретом в CI.
 *
 * Запуск: npx jest "2. Core testing fundamentals/jest/6_only.test.js"
 */

const validator = {
  isEmail: (value) => /.+@.+\..+/.test(value),
};

describe('Валидатор', () => {
  it.only('проверяет корректный email', () => {
    expect(validator.isEmail('user@mail.com')).toBe(true);
  });

  it('этот тест пропущен из-за only выше', () => {
    expect(validator.isEmail('битый')).toBe(false);
  });

  it('и этот тоже пропущен', () => {
    expect(validator.isEmail('a@b.c')).toBe(true);
  });
});
