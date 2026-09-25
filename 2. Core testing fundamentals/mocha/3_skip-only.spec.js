/**
 * skip() и only() в Mocha.
 *
 * - it.skip / describe.skip (синонимы xit / xdescribe) помечают тест как
 *   pending: он виден в отчёте, но не выполняется.
 * - it.only / describe.only сужают прогон до помеченных тестов.
 *   Работает в пределах всего прогона, а не одного файла, как в Jest.
 * - this.skip() пропускает тест уже во время выполнения — по условию.
 *   Для этого нужна обычная function, а не стрелочная: у стрелки нет своего this.
 * - Забытый only ловится ключом --forbid-only: в CI прогон упадёт.
 * - it('название') без функции — тоже pending, удобно как заготовка теста.
 *
 * Запуск: npx mocha "2. Core testing fundamentals/mocha/3_skip-only.spec.js"
 */

const { expect } = require('chai');

const parser = {
  parse: (text) => text.trim(),
};

describe('Парсер', () => {
  it('убирает пробелы по краям', () => {
    expect(parser.parse('  привет  ')).to.equal('привет');
  });

  // Пропущен: ждём multiline-режим, задача PRACTICE-42.
  it.skip('разбирает многострочный текст', () => {
    expect(parser.parse('a\nb')).to.equal('a b');
  });

  it('заготовка на будущее'); // без колбэка — тоже pending

  it('пропуск по условию во время выполнения', function () {
    if (process.platform !== 'win32') {
      this.skip(); // тест только для Windows
    }
    expect(true).to.equal(true);
  });
});

// describe.only('Только этот блок', () => { ... });
// Раскомментируйте, чтобы прогнать один блок. В CI используйте --forbid-only,
// чтобы забытый only не выключил остальные тесты молча.
