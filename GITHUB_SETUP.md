# Інструкція: Налаштування GitHub CLI та відправка проекту

## Крок 1: Встановлення GitHub CLI

### Варіант A: Встановлення через winget (Windows Package Manager)
```powershell
winget install --id GitHub.cli
```

### Варіант B: Встановлення через Chocolatey
```powershell
choco install gh
```

### Варіант C: Завантаження з офіційного сайту
1. Перейдіть на https://cli.github.com/
2. Завантажте установщик для Windows
3. Запустіть установщик і дотримуйтесь інструкцій

### Перевірка встановлення
Після встановлення перезапустіть PowerShell і виконайте:
```powershell
gh --version
```

---

## Крок 2: Автентифікація в GitHub CLI

### 2.1. Запуск процесу автентифікації
```powershell
gh auth login
```

### 2.2. Вибір типу автентифікації
Під час виконання команди вам буде запропоновано вибрати:
- **GitHub.com** (виберіть цей варіант)
- **GitHub Enterprise Server**

### 2.3. Вибір протоколу
Виберіть один з варіантів:
- **HTTPS** (рекомендовано) - простіше для початківців
- **SSH** - більш безпечно, але потребує налаштування ключів

### 2.4. Вибір методу автентифікації
Якщо вибрали HTTPS, вам запропонують:
- **Login with a web browser** (рекомендовано) - найпростіший спосіб
- **Paste an authentication token** - якщо у вас вже є токен

### 2.5. Завершення автентифікації
- Якщо вибрали "Login with a web browser":
  1. Відкриється браузер
  2. Увійдіть у свій GitHub акаунт
  3. Підтвердіть авторизацію GitHub CLI
  4. Поверніться до PowerShell - автентифікація завершиться автоматично

- Якщо вибрали "Paste an authentication token":
  1. Створіть токен на GitHub: https://github.com/settings/tokens
  2. Натисніть "Generate new token" → "Generate new token (classic)"
  3. Виберіть права доступу: `repo` (повний доступ до репозиторіїв)
  4. Скопіюйте токен і вставте його в PowerShell

### 2.6. Перевірка автентифікації
```powershell
gh auth status
```
Ви повинні побачити повідомлення про успішну автентифікацію.

---

## Крок 3: Налаштування відстеження гілки та відправка коду

### 3.1. Перевірка поточного стану
```powershell
cd C:\Users\Serhiy\web-autotests
git status
```

### 3.2. Встановлення відстеження гілки та відправка
```powershell
git push -u origin main
```

**Пояснення команди:**
- `git push` - відправляє зміни на віддалений сервер
- `-u origin main` - встановлює відстеження гілки `main` з віддаленим репозиторієм `origin`
- Після першого разу можна використовувати просто `git push`

### 3.3. Перевірка успішності
Після виконання команди ви побачите щось на кшталт:
```
Enumerating objects: X, done.
Counting objects: 100% (X/X), done.
Writing objects: 100% (X/X), done.
To https://github.com/serhiypolyakov-qa/public-nocowboys-cursor-project.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

## Крок 4: Перевірка на GitHub

1. Відкрийте браузер
2. Перейдіть на: https://github.com/serhiypolyakov-qa/public-nocowboys-cursor-project
3. Переконайтесь, що всі файли відображаються в репозиторії

---

## Майбутні роботи з git

### Додавання нових змін
```powershell
# 1. Перевірка статусу
git status

# 2. Додавання файлів до staging area
git add .

# Або додавання конкретних файлів
git add path/to/file.ts

# 3. Створення коміту
git commit -m "Опис змін"

# 4. Відправка на GitHub
git push
```

### Перевірка історії комітів
```powershell
git log --oneline
```

### Перевірка статусу
```powershell
git status
```

---

## Вирішення проблем

### Проблема: "gh: command not found"
**Рішення:** Перезапустіть PowerShell після встановлення GitHub CLI

### Проблема: "Authentication failed"
**Рішення:** 
```powershell
gh auth logout
gh auth login
```

### Проблема: "Permission denied"
**Рішення:** Перевірте, що ви маєте права на запис у репозиторій

### Проблема: "Updates were rejected"
**Рішення:** Спочатку отримайте зміни з віддаленого репозиторію:
```powershell
git pull origin main
git push
```

---

## Додаткові корисні команди GitHub CLI

### Перегляд інформації про репозиторій
```powershell
gh repo view
```

### Створення нового репозиторію
```powershell
gh repo create
```

### Перегляд issues та pull requests
```powershell
gh issue list
gh pr list
```

---

**Примітка:** Після першого налаштування всі подальші операції `git push` будуть працювати автоматично без додаткової автентифікації.
