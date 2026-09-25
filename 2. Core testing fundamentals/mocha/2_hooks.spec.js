/**
 * Хуки в Mocha: before / after / beforeEach / afterEach.
 *
 * - Имена отличаются от Jest: before вместо beforeAll, after вместо afterAll.
 *   beforeEach и afterEach называются одинаково.
 * - before выполняется один раз до всех тестов блока, beforeEach — перед каждым.
 * - Хуки наследуются вложенными describe: внешний beforeEach отработает
 *   и для тестов внутреннего блока.
 * - У хука можно задать имя: before('поднимаем сервер', fn) — попадёт в отчёт
 *   об ошибке.
 * - Асинхронность: верните промис, используйте async или примите аргумент done.
 *
 * Запуск: npx mocha "2. Core testing fundamentals/mocha/2_hooks.spec.js"
 */

const { expect } = require('chai');

class Cart {
  constructor() {
    this.items = [];
  }
  add(item) {
    this.items.push(item);
  }
}

describe('Корзина', () => {
  const order = [];
  let cart;

  before('готовим окружение', () => {
    order.push('before');
  });

  beforeEach(() => {
    order.push('beforeEach');
    cart = new Cart(); // чистое состояние для каждого теста
  });

  afterEach(() => {
    order.push('afterEach');
  });

  after(() => {
    order.push('after');
  });

  it('пустая после создания', () => {
    expect(cart.items).to.have.lengthOf(0);
  });

  it('хранит добавленный товар', () => {
    cart.add('кофе');
    expect(cart.items).to.deep.equal(['кофе']);
  });

  it('порядок хуков на этот момент', () => {
    expect(order).to.deep.equal([
      'before',
      'beforeEach',
      'afterEach',
      'beforeEach',
      'afterEach',
      'beforeEach',
    ]);
  });
});
