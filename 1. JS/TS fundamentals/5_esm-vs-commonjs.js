/**
 * ES Modules vs CommonJS — тезисно с примерами.
 *
 * Тема про несколько файлов, поэтому скрипт создаёт мини-модули во временной
 * папке, подключает их по-настоящему и удаляет в конце. Сам файл — CommonJS.
 *
 * Запуск: node "1. JS fundamentals/6_esm-vs-commonjs.js"
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { pathToFileURL } = require('url');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'esm-vs-cjs-'));
const write = (name, code) => {
  const file = path.join(tmp, name);
  fs.writeFileSync(file, code);
  return file;
};

// ---------------------------------------------------------------------------
// 1. CommonJS (CJS)
// ---------------------------------------------------------------------------
// - Синтаксис: `require()` для импорта, `module.exports` / `exports` для экспорта.
// - Загрузка синхронная, модуль выполняется в момент вызова `require`.
// - `require` можно вызывать где угодно: в условиях, функциях, с динамическим
//   путём.
// - Экспортируется копия значения (для примитивов): изменения в исходном модуле
//   после экспорта не видны.
// - Исторически стандарт Node.js, в браузере без бандлера не работает.
// - Tree-shaking почти невозможен: структура импорта определяется только
//   во время выполнения.
// - Доступны `__dirname`, `__filename`.

function commonjsDemo() {
  // math.js
  write(
    'math.js',
    ['function sum(a, b) { return a + b; }', 'module.exports = { sum };'].join(
      '\n',
    ),
  );

  // app.js
  const { sum } = require(path.join(tmp, 'math.js'));
  console.log('sum(2, 3):', sum(2, 3)); // 5

  console.log('__dirname доступен:', typeof __dirname === 'string'); // true

  // require можно вызвать прямо в условии, с вычисляемым путём
  const name = 'math.js';
  if (true) {
    console.log(
      'require внутри блока:',
      require(path.join(tmp, name)).sum(1, 1),
    ); // 2
  }
}

// ---------------------------------------------------------------------------
// 2. ES Modules (ESM)
// ---------------------------------------------------------------------------
// - Синтаксис: `import` / `export`, официальный стандарт ECMAScript.
// - Статическая структура: импорты анализируются до выполнения кода, поэтому
//   работает tree-shaking.
// - Загрузка асинхронная, поддерживается top-level await.
// - Экспортируются живые привязки (live bindings): изменение значения в модуле
//   видно у импортирующих.
// - Работает нативно и в браузере (`<script type="module">`), и в Node.js
//   (`.mjs` или `"type": "module"` в package.json).
// - Всегда strict mode.
// - Динамический импорт через `import()`, который возвращает Promise.
// - Нет `__dirname`, вместо него `import.meta.url`
//   (или `import.meta.dirname` в новых версиях Node).

async function esmDemo() {
  // math.mjs
  const mathMjs = write(
    'math.mjs',
    [
      'export function sum(a, b) { return a + b; }',
      'export const meta = import.meta.url;',
    ].join('\n'),
  );

  // app.mjs: import { sum } from './math.mjs';
  const mod = await import(pathToFileURL(mathMjs).href);
  console.log('sum(2, 3):', mod.sum(2, 3)); // 5
  console.log('import.meta.url есть:', mod.meta.startsWith('file://')); // true
}

// ---------------------------------------------------------------------------
// 3. Копия значения (CJS) против живой привязки (ESM)
// ---------------------------------------------------------------------------
// Ключевое отличие: CJS отдаёт снимок примитива на момент экспорта,
// ESM — живую привязку к переменной модуля.

async function bindingsDemo() {
  const counterCjs = write(
    'counter.js',
    [
      'let count = 0;',
      'function increment() { count += 1; }',
      'module.exports = { count, increment };',
    ].join('\n'),
  );

  const cjs = require(counterCjs);
  cjs.increment();
  console.log('CJS count после increment():', cjs.count); // 0 — копия примитива

  const counterMjs = write(
    'counter.mjs',
    [
      'export let count = 0;',
      'export function increment() { count += 1; }',
    ].join('\n'),
  );

  const esm = await import(pathToFileURL(counterMjs).href);
  esm.increment();
  console.log('ESM count после increment():', esm.count); // 1 — живая привязка
}

// ---------------------------------------------------------------------------
// 4. Совместимость
// ---------------------------------------------------------------------------
// - ESM может импортировать CJS (через default-импорт).
// - CJS подключает ESM через `await import()`; в свежих версиях Node (22+)
//   также поддерживается синхронный `require()` для ESM без top-level await.
// - Для новых проектов рекомендуется ESM.

async function interopDemo() {
  // ESM импортирует CJS: весь module.exports приходит как default
  const bridge = write(
    'bridge.mjs',
    [
      "import cjs from './math.js';",
      'export const viaDefault = cjs.sum(4, 5);',
    ].join('\n'),
  );

  const mod = await import(pathToFileURL(bridge).href);
  console.log('ESM импортирует CJS:', mod.viaDefault); // 9

  // CJS подключает ESM: этот файл только что сделал это через await import().
  console.log('CJS подключает ESM: через await import() — см. выше');
}

// ---------------------------------------------------------------------------

async function main() {
  try {
    console.log('=== 1. CommonJS ===');
    commonjsDemo();

    console.log('\n=== 2. ES Modules ===');
    await esmDemo();

    console.log('\n=== 3. Копия значения против живой привязки ===');
    await bindingsDemo();

    console.log('\n=== 4. Совместимость ===');
    await interopDemo();
  } finally {
    fs.rmSync(tmp, {
      recursive: true,
      force: true,
    });
  }
}

main();
