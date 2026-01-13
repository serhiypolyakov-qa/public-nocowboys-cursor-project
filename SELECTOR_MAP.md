# Selector Map - Customer Signup Test

## Validation: All selectors are based strictly on provided HTML fragments

---

## 1. Home Page Selectors

### Login Button
- **HTML Source**: `<a href="/login"><span class="navbar-login-item">Log In</span></a>`
- **Selector Used**: `page.getByRole('link', { name: 'Log In' })`
- **Why Stable**: 
  - Uses role-based selector (semantic)
  - Matches visible text "Log In" from HTML
  - No positional or fragile CSS selectors
  - Follows selector priority: Role-based (priority 2)

---

## 1.1. Login Page Selectors

### Signup Link
- **HTML Source**: `<a href="/customers/register">Sign up.</a>`
- **Selector Used**: `page.getByRole('link', { name: 'Sign up.' })`
- **Page Location**: Login Page (not Home Page)
- **Why Stable**:
  - Uses role-based selector (semantic)
  - Matches exact visible text "Sign up." from HTML
  - No positional or fragile CSS selectors
  - Follows selector priority: Role-based (priority 2)

---

## 2. Customer Signup Form Selectors

### Registration Form
- **HTML Source**: `<form id="register-customer-form" method="post" novalidate>`
- **Selector Used**: `page.locator('#register-customer-form')`
- **Why Stable**:
  - Uses unique ID attribute
  - IDs are stable and unlikely to change
  - Follows selector priority: CSS selector (priority 4, but ID is most stable option)

### First Name Input
- **HTML Source**: `<input type="text" id="FirstName" name="FirstName" required class="form-control" />`
- **Selector Used**: `page.locator('#FirstName')`
- **Why Stable**: Unique ID attribute

### Last Name Input
- **HTML Source**: `<input type="text" id="LastName" name="LastName" required class="form-control" />`
- **Selector Used**: `page.locator('#LastName')`
- **Why Stable**: Unique ID attribute

### Email Address Input
- **HTML Source**: `<input type="email" id="EmailAddress" name="EmailAddress" required class="form-control" />`
- **Selector Used**: `page.locator('#EmailAddress')`
- **Why Stable**: Unique ID attribute

### Phone Area Code Input
- **HTML Source**: `<input type="text" id="mainPhoneCode" name="mainPhoneCode" required minlength="1" maxlength="5" class="form-control" />`
- **Selector Used**: `page.locator('#mainPhoneCode')`
- **Why Stable**: Unique ID attribute

### Phone Number Input
- **HTML Source**: `<input type="tel" id="phone_number" name="phone_number" required minlength="4" maxlength="15" class="form-control" />`
- **Selector Used**: `page.locator('#phone_number')`
- **Why Stable**: Unique ID attribute

### Password Input
- **HTML Source**: `<input type="password" id="password" name="password" required minlength="8" class="form-control" />`
- **Selector Used**: `page.locator('#password')`
- **Why Stable**: Unique ID attribute

### Confirm Password Input
- **HTML Source**: `<input type="password" id="confirmPassword" name="confirmPassword" required minlength="8" class="form-control" />`
- **Selector Used**: `page.locator('#confirmPassword')`
- **Why Stable**: Unique ID attribute

### Submit Button
- **HTML Source**: `<button type="submit" id="submitButton" class="btn btn-primary btn-block" disabled>Submit</button>`
- **Selector Used**: `page.locator('#submitButton')`
- **Why Stable**: Unique ID attribute

---

## 3. Verification Required Page Selectors

### Success Message
- **HTML Source**: `<h1>Account Successfully Created</h1>`
- **Selector Used**: `page.getByRole('heading', { name: 'Account Successfully Created' })`
- **Why Stable**:
  - Uses role-based selector (semantic)
  - Matches exact heading text from HTML
  - No positional or fragile CSS selectors
  - Follows selector priority: Role-based (priority 2)

---

## Selector Priority Summary

| Priority | Selector Type | Count | Examples |
|----------|--------------|-------|----------|
| 1 | data-testid | 0 | None available in HTML |
| 2 | Role-based | 3 | Login button, Signup link, Success message |
| 3 | Text content | 0 | Used within role-based selectors |
| 4 | CSS (ID) | 9 | All form inputs and submit button |

---

## Validation Checklist

✅ **All selectors exist in provided HTML**
- Login button: ✅ Found in HTML fragment
- Signup link: ✅ Found in HTML fragment
- All form fields: ✅ Found in HTML fragment
- Submit button: ✅ Found in HTML fragment
- Success message: ✅ Found in HTML fragment

✅ **No invented selectors**
- All selectors are based on provided HTML fragments
- No guessing or assumptions made

✅ **No forbidden selector types**
- ❌ No XPath selectors used
- ❌ No nth-child selectors used
- ❌ No complex CSS chains used
- ❌ No fragile selectors used

✅ **Selector stability**
- All form inputs use unique ID attributes (most stable)
- Navigation elements use role-based selectors (semantic and stable)
- Success message uses role-based selector (semantic and stable)

---

## Notes

1. **Form inputs**: All use ID selectors which are the most stable option available since `data-testid` attributes are not present in the HTML.

2. **Navigation elements**: Use role-based selectors which are semantic and match the visible text from HTML.

3. **Success message**: Uses role-based selector for heading element, which is semantic and stable.

4. **No hard-coded waits**: All waits are implicit through Playwright's auto-waiting mechanism.

5. **All selectors validated**: Every selector in the code has been verified against the provided HTML fragments.
