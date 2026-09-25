/**
 * Подключение библиотеки и первый тест (Jasmine).
 *
 * - Jasmine — всё в одном: раннер, синтаксис describe/it и свои матчеры.
 *   Отдельная библиотека утверждений не нужна, chai подключать не надо.
 * - Глобально доступны describe, it, expect, хуки. Импорт не требуется.
 * - Какие файлы считать спеками, задаётся в конфиге jasmine.json
 *   (spec_dir + spec_files), а не маской в командной строке.
 * - Матчеры: toBe (===), toEqual (по значению), toContain, toThrow.
 * - Исторически отсюда вырос синтаксис Jest: describe/it/expect почти те же.
 *
 * Запуск: npx jasmine --config="2. Core testing fundamentals/jasmine/jasmine.json" --filter="sum"
 */

function sum(a, b) {
  return a + b;
}

describe('sum', () => {
  it('складывает два числа', () => {
    expect(sum(2, 3)).toBe(5);
  });
});
