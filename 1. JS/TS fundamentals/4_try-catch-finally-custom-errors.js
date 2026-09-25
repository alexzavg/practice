/**
 * try/catch/finally, кастомные классы ошибок — тезисно с примерами.
 *
 * Запуск: node "1. JS fundamentals/4_try-catch-finally-custom-errors.js"
 */

// ---------------------------------------------------------------------------
// 1. try / catch / finally
// ---------------------------------------------------------------------------
// - `try` содержит код, который может выбросить исключение.
// - `catch (err)` перехватывает ошибку; выполнение продолжается после блока.
// - `finally` выполняется всегда: при успехе, при ошибке и даже при `return`
//   внутри try/catch.
// - Подходит для освобождения ресурсов: закрыть соединение, снять лоадер,
//   отпустить лок.
// - Ловится только синхронный код и `await`; промис без `await` мимо catch
//   пролетит.
// - Если `finally` делает `return`, он перезапишет результат try/catch
//   (лучше так не делать).

// --- заглушки, чтобы пример был запускаемым ---
function setLoading(value) {
  console.log(`  setLoading(${value})`);
}

// Мини-подмена fetch: /api/users/1 отдаёт данные, остальное — 404.
async function fetch(url) {
  const ok = url === '/api/users/1';
  return {
    ok,
    status: ok ? 200 : 404,
    json: async () => ({
      id: 1,
      name: 'Анна',
    }),
  };
}
// --- конец заглушек ---

async function loadUser(id) {
  setLoading(true);
  try {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Не удалось загрузить пользователя:', err.message);
    return null;
  } finally {
    setLoading(false); // выполнится в любом случае
  }
}

// ---------------------------------------------------------------------------
// 2. Кастомные классы ошибок
// ---------------------------------------------------------------------------
// - Наследуются от `Error`, чтобы сохранить `message` и `stack`.
// - Задавайте `this.name`, иначе в логах будет просто `Error`.
// - Добавляйте свои поля (`statusCode`, `field`, `code`) для контекста.
// - Различайте ошибки через `instanceof`, а не парсинг строки `message`.
// - Опция `cause` (ES2022) позволяет обернуть исходную ошибку, не теряя её.
// - Удобно строить иерархию: базовый `AppError` и от него конкретные типы.

class AppError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = this.constructor.name;
  }
}

class ValidationError extends AppError {
  constructor(field, message) {
    super(message);
    this.field = field;
  }
}

class ApiError extends AppError {
  constructor(statusCode, message, cause) {
    super(message, {
      cause,
    });
    this.statusCode = statusCode;
  }
}

function handle(error) {
  try {
    throw error;
  } catch (err) {
    if (err instanceof ValidationError) {
      console.log(`Поле ${err.field}: ${err.message}`);
    } else if (err instanceof ApiError) {
      console.log(`API ${err.statusCode}`, err.cause);
    } else {
      throw err; // неизвестное пробрасываем дальше
    }
  }
}

function customErrorsDemo() {
  handle(new ValidationError('email', 'Некорректный email'));

  handle(new ApiError(500, 'Сервис недоступен', new Error('ECONNREFUSED')));

  // Неизвестная ошибка уходит наверх — ловим здесь, чтобы скрипт не упал.
  try {
    handle(new RangeError('что-то другое'));
  } catch (err) {
    console.log('проброшено дальше:', err.name, '—', err.message);
  }

  // name берётся из имени класса, тип проверяется через instanceof.
  const err = new ValidationError('age', 'Возраст должен быть числом');
  console.log('name:', err.name); // ValidationError
  console.log('instanceof AppError:', err instanceof AppError); // true
  console.log('instanceof Error:', err instanceof Error); // true
}

// ---------------------------------------------------------------------------

async function main() {
  console.log('=== 1. try / catch / finally ===');
  console.log('успех:', await loadUser(1));
  console.log('ошибка:', await loadUser(999));

  console.log('\n=== 2. Кастомные классы ошибок ===');
  customErrorsDemo();
}

main();
