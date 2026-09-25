/**
 * Хуки beforeEach / afterEach (Jest).
 *
 * - beforeEach выполняется перед каждым тестом, afterEach — после каждого.
 * - Нужны, чтобы у теста было чистое состояние: новый объект, пустая база,
 *   сброшенные моки.
 * - afterEach выполняется даже если тест упал.
 * - Хук внутри describe действует только на тесты этого блока.
 * - Порядок при вложенности: внешний beforeEach, внутренний beforeEach, тест,
 *   внутренний afterEach, внешний afterEach.
 *
 * Запуск: npx jest "2. Core testing fundamentals/jest/3_before-each-after-each.test.js"
 */

class Cart {
  constructor() {
    this.items = [];
  }
  add(item) {
    this.items.push(item);
  }
}

describe('Корзина', () => {
  let cart;

  beforeEach(() => {
    cart = new Cart(); // у каждого теста своя пустая корзина
  });

  afterEach(() => {
    cart = null;
  });

  it('пустая сразу после создания', () => {
    expect(cart.items).toHaveLength(0);
  });

  it('хранит добавленный товар', () => {
    cart.add('кофе');
    expect(cart.items).toEqual(['кофе']);
  });

  it('не видит товар из предыдущего теста', () => {
    expect(cart.items).toHaveLength(0); // beforeEach сбросил состояние
  });
});
