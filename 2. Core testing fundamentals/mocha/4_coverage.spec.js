/**
 * Покрытие кода в Mocha — через c8.
 *
 * - У Mocha нет своего механизма покрытия: он только раннер.
 *   Покрытие навешивают сторонним инструментом — c8 (на движке V8) или nyc.
 * - Схема запуска: c8 mocha — c8 запускает Mocha внутри себя и собирает
 *   данные от V8.
 * - Отчёт тот же по смыслу, что у Jest: строки, ветки, функции, линии.
 * - Пороги задаются флагами: c8 --lines 80 --branches 70 mocha.
 * - Форматы отчётов: --reporter=text в консоль, --reporter=html в папку.
 *
 * Запуск: npm run test:mocha:coverage
 */

const { expect } = require('chai');
const { sum, divide, discount } = require('../src/calculator');

describe('calculator (Mocha)', () => {
  it('складывает числа', () => {
    expect(sum(2, 3)).to.equal(5);
  });

  it('бросает ошибку при делении на ноль', () => {
    expect(() => divide(1, 0)).to.throw('Деление на ноль');
  });

  it('считает скидку для gold', () => {
    expect(discount(100, 'gold')).to.equal(80);
  });
});
