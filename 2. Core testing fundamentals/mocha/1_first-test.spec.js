/**
 * Подключение библиотеки и первый тест (Mocha).
 *
 * - Mocha — только раннер: он даёт describe, it и хуки, но не даёт проверок.
 *   Библиотеку утверждений подключают отдельно: chai, expect, node:assert.
 * - Здесь chai: const { expect } = require('chai').
 * - describe и it приходят глобально от самого Mocha, их не импортируют.
 * - Файлы ищутся по маске из .mocharc.json (здесь mocha/**\/*.spec.js).
 * - Стили chai: expect(x).to.equal(y), assert.equal(x, y), x.should.equal(y).
 *
 * Запуск: npx mocha "2. Core testing fundamentals/mocha/1_first-test.spec.js"
 */

const { expect } = require('chai');

function sum(a, b) {
  return a + b;
}

describe('sum', () => {
  it('складывает два числа', () => {
    expect(sum(2, 3)).to.equal(5);
  });
});
