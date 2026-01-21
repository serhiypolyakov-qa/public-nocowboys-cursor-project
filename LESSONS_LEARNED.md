# Аналіз помилок при написанні CustomerRegistrationTest

## Критичні помилки, які НЕ можна повторювати:

### 1. ❌ Неправильне припущення про закриття сторінки
**Помилка:** Додавав багато перевірок `page.isClosed()` та обробку помилок "Target page has been closed"
**Реальність:** Сторінка НЕ закривається! Email відкривається в новій вкладці, а стара залишається відкритою
**Правильний підхід:** 
- Не додавати перевірки `isClosed()` без реальної потреби
- Розуміти поведінку браузера: `target="_blank"` відкриває нову вкладку, не закриває стару

### 2. ❌ Зайві `waitForTimeout` після `waitForLoadState`
**Помилка:** Використовував `waitForLoadState('domcontentloaded')` + `waitForTimeout(2000)`
**Проблема:** `waitForLoadState` вже чекає на завантаження, додатковий timeout не потрібен
**Правильний підхід:**
- Використовувати `waitForLoadState('domcontentloaded')` - це достатньо
- Додавати timeout тільки якщо потрібно чекати на динамічний контент (наприклад, JavaScript рендеринг)

### 3. ❌ Використання `networkidle` замість `domcontentloaded`
**Помилка:** Використовував `waitForLoadState('networkidle')` для сторінок з постійними мережевими запитами
**Проблема:** `networkidle` може чекати дуже довго або взагалі не дочекатися на сторінках з активними запитами
**Правильний підхід:**
- Використовувати `domcontentloaded` для більшості випадків (швидше і надійніше)
- `networkidle` використовувати тільки коли дійсно потрібно чекати на всі мережеві запити

### 4. ❌ Неправильна логіка очікування навігації
**Помилка:** Використовував `waitForEvent('page')` коли навігація відбувалась в тій же вкладці
**Реальність:** 
- Email відкривається в новій вкладці (`target="_blank"`) → потрібен `waitForEvent('page')`
- Лінк верифікації навігує в тій же вкладці → потрібен `waitForURL()`
**Правильний підхід:**
- Для нової вкладки: `context.waitForEvent('page')` + `emailLink.click()`
- Для навігації в тій же вкладці: `page.waitForURL()` + `link.click()`

### 5. ❌ Складні селектори замість простих
**Помилка:** Спочатку використовував складні селектори з багатьма фільтрами та альтернативами
**Правильний підхід:**
- Використовувати точний DOM Path з мануального тесту
- Якщо є `div#developerStatus` → використовувати його
- Якщо є `table#bodyTable` → використовувати його
- Прості селектори завжди краще: `div#developerStatus a[href*="-validate-your-email"]`

### 6. ❌ Зайві try-catch блоки та fallback логіка
**Помилка:** Додавав багато рівнів fallback логіки з try-catch
**Проблема:** Це робить код складним і важким для дебагу
**Правильний підхід:**
- Спочатку використати правильний селектор з DOM Path
- Якщо не працює - перевірити в браузері, що саме не так
- Не додавати fallback без реальної потреби

### 7. ❌ Неправильне використання `Promise.all` з навігацією
**Помилка:** Використовував `Promise.all([waitForURL(), click()])` з `waitForNavigation()` всередині методу
**Проблема:** Подвійне очікування навігації може конфліктувати
**Правильний підхід:**
- Або `Promise.all([waitForURL(), click()])` в тесті
- Або `waitForNavigation()` всередині методу, але не обидва разом

### 8. ❌ Неправильне розуміння `waitForNavigation`
**Помилка:** Використовував `waitForNavigation()` після `waitForLoadState()`
**Проблема:** `waitForNavigation()` потрібен ДО кліку, не після
**Правильний підхід:**
- `Promise.all([waitForNavigation(), click()])` - правильно
- `click()` → `waitForNavigation()` - неправильно (навігація вже почалась)

## Правильні підходи, які працюють:

### ✅ Правильна робота з новою вкладкою:
```typescript
// Email відкривається в новій вкладці
const context = this.page.context();
const [newPage] = await Promise.all([
  context.waitForEvent('page', { timeout: 15000 }),
  emailLink.click()
]);
await newPage.waitForLoadState('domcontentloaded');
```

### ✅ Правильна навігація в тій же вкладці:
```typescript
// Лінк навігує в тій же вкладці
await Promise.all([
  page.waitForURL(/.*\/customers\/register\/verify-email\/.*/, { timeout: 30000 }),
  link.click()
]);
```

### ✅ Правильні селектори:
```typescript
// Використовувати точний DOM Path
const emailLink = page.locator('div#developerStatus a[href*="-validate-your-email"]').first();
const verificationLink = page.locator('table#bodyTable a[href*="/customers/register/verify-email/uniqueCode/"]').first();
```

### ✅ Мінімальні очікування:
```typescript
// Не додавати зайві timeout
await page.waitForLoadState('domcontentloaded'); // достатньо
await link.waitFor({ state: 'visible' }); // достатньо
```

## Висновки:

1. **Завжди розуміти поведінку браузера** перед написанням коду
2. **Використовувати точні селектори** з DOM Path з мануального тесту
3. **Мінімізувати waitForTimeout** - використовувати очікування на реальні події
4. **Розрізняти нову вкладку vs навігацію** в тій же вкладці
5. **Не додавати зайві перевірки** без реальної потреби
6. **Спочатку простий підхід**, потім ускладнювати тільки якщо потрібно
