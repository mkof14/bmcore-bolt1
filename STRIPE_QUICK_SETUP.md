# Stripe Quick Setup Guide - 10 Minutes

## 📍 Где вставлять данные Stripe?

**Файл:** `.env` (в корне проекта)

---

## 🚀 Быстрая настройка за 5 шагов

### Шаг 1: Создать Stripe аккаунт (2 минуты)

1. Зайти на: **https://stripe.com**
2. Нажать **"Sign Up"**
3. Ввести email и пароль
4. Подтвердить email

---

### Шаг 2: Получить Publishable Key (30 секунд)

1. Зайти в Stripe Dashboard: **https://dashboard.stripe.com**
2. Слева в меню нажать: **"Developers"**
3. Нажать: **"API Keys"**
4. Найти **"Publishable key"** (начинается с `pk_test_`)
5. Нажать **"Reveal test key"**
6. Скопировать ключ

**Вставить в `.env` файл:**
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

### Шаг 3: Создать продукты и цены (5 минут)

#### 3.1 Daily Plan

1. Dashboard → **Products** → **Add Product**
2. Заполнить:
   ```
   Name: Daily Plan
   Description: Daily health insights and guidance
   ```
3. Нажать **"Add pricing"**

**Создать 2 цены:**

**Цена 1 - Monthly:**
```
Pricing model: Standard pricing
Price: $39.00
Billing period: Monthly
```
Нажать "Add price"
**📋 Скопировать Price ID** (начинается с `price_1`)

**Цена 2 - Yearly:**
```
Pricing model: Standard pricing
Price: $390.00
Billing period: Yearly
```
Нажать "Add price"
**📋 Скопировать Price ID**

**Вставить в `.env`:**
```env
VITE_STRIPE_PRICE_DAILY_MONTHLY=price_1xxxxxxxxxxxxxxxxxxxxx
VITE_STRIPE_PRICE_DAILY_YEARLY=price_1yyyyyyyyyyyyyyyyyyyyyyy
```

---

#### 3.2 Core Plan (Повторить процесс)

```
Name: Core Plan
Description: Complete health analytics and AI assistance

Monthly: $79.00
Yearly: $790.00
```

**Вставить в `.env`:**
```env
VITE_STRIPE_PRICE_CORE_MONTHLY=price_1xxxxxxxxxxxxxxxxxxxxx
VITE_STRIPE_PRICE_CORE_YEARLY=price_1yyyyyyyyyyyyyyyyyyyyyyy
```

---

#### 3.3 Max Plan (Повторить процесс)

```
Name: Max Plan
Description: Premium health intelligence with unlimited access

Monthly: $149.00
Yearly: $1,490.00
```

**Вставить в `.env`:**
```env
VITE_STRIPE_PRICE_MAX_MONTHLY=price_1xxxxxxxxxxxxxxxxxxxxx
VITE_STRIPE_PRICE_MAX_YEARLY=price_1yyyyyyyyyyyyyyyyyyyyyyy
```

---

### Шаг 4: Проверить `.env` файл

Ваш `.env` файл должен выглядеть так:

```env
# ===========================================
# STRIPE PAYMENT CONFIGURATION
# ===========================================

# Publishable Key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51MmVH2K9fQr2mBnIxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Monthly Price IDs
VITE_STRIPE_PRICE_DAILY_MONTHLY=price_1OXqFxK9fQr2mBnIxxxxxxxxxxxxxx
VITE_STRIPE_PRICE_CORE_MONTHLY=price_1OXqGYK9fQr2mBnIxxxxxxxxxxxxxx
VITE_STRIPE_PRICE_MAX_MONTHLY=price_1OXqHZK9fQr2mBnIxxxxxxxxxxxxxx

# Yearly Price IDs
VITE_STRIPE_PRICE_DAILY_YEARLY=price_1OXqIaK9fQr2mBnIxxxxxxxxxxxxxx
VITE_STRIPE_PRICE_CORE_YEARLY=price_1OXqJbK9fQr2mBnIxxxxxxxxxxxxxx
VITE_STRIPE_PRICE_MAX_YEARLY=price_1OXqKcK9fQr2mBnIxxxxxxxxxxxxxx

# Stripe Configuration (уже настроено)
VITE_STRIPE_CURRENCY=usd
VITE_STRIPE_SUCCESS_URL=https://txnwvaqzmtlhefcxilfu.supabase.co/member-zone?payment=success
VITE_STRIPE_CANCEL_URL=https://txnwvaqzmtlhefcxilfu.supabase.co/pricing?payment=cancelled
```

---

### Шаг 5: Перезапустить dev сервер

После изменения `.env` файла:

```bash
# Остановить сервер (Ctrl+C)
# Запустить снова
npm run dev
```

---

## ✅ Проверка работы

### Тест 1: Проверить загрузку Stripe

Откройте консоль браузера (F12) и введите:

```javascript
console.log(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
```

Должен показать ваш `pk_test_` ключ

---

### Тест 2: Попробовать checkout

1. Зайти на страницу Pricing: `http://localhost:5173/pricing`
2. Нажать "Subscribe Now" на любом плане
3. Должно открыться Stripe Checkout окно
4. Использовать тестовую карту:
   ```
   Card: 4242 4242 4242 4242
   Expiry: 12/34
   CVC: 123
   ZIP: 12345
   ```
5. Завершить оплату
6. Должен редиректнуть на Member Zone

---

## 🔧 Для Supabase Edge Functions (опционально)

Если хотите, чтобы webhook и checkout работали через Supabase:

### Получить Secret Key

1. Dashboard → Developers → API Keys
2. Найти **"Secret key"**
3. Нажать **"Reveal test key"**
4. Скопировать (начинается с `sk_test_`)

### Добавить в Supabase

```bash
# Установить Supabase CLI (если еще нет)
npm install -g supabase

# Login
supabase login

# Установить секреты
supabase secrets set STRIPE_SECRET_KEY=sk_test_51xxxxxxxxxxxxxxxxxx
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxx

# Deploy Edge Functions
supabase functions deploy create-checkout-session
supabase functions deploy create-portal-session
supabase functions deploy stripe-webhook
```

---

## 📊 Визуальная шпаргалка

```
┌─────────────────────────────────────────────────────────────┐
│ Stripe Dashboard                                            │
│ https://dashboard.stripe.com                                │
└─────────────────────────────────────────────────────────────┘
                           │
           ┌───────────────┴───────────────┐
           │                               │
    ┌──────▼──────┐                ┌──────▼──────┐
    │ Developers  │                │  Products   │
    │  → API Keys │                │             │
    └──────┬──────┘                └──────┬──────┘
           │                               │
    ┌──────▼──────────────┐         ┌──────▼────────────────┐
    │ Publishable Key     │         │ Create 3 Products:    │
    │ pk_test_51xxxxx    │         │                       │
    │                     │         │ 1. Daily Plan         │
    │ Вставить в:        │         │    Monthly: $39       │
    │ VITE_STRIPE_       │         │    Yearly: $390       │
    │ PUBLISHABLE_KEY    │         │                       │
    └─────────────────────┘         │ 2. Core Plan          │
                                    │    Monthly: $79       │
                                    │    Yearly: $790       │
                                    │                       │
                                    │ 3. Max Plan           │
                                    │    Monthly: $149      │
                                    │    Yearly: $1,490     │
                                    │                       │
                                    │ Скопировать 6 Price   │
                                    │ IDs и вставить в .env │
                                    └───────────────────────┘
```

---

## 🎯 Где находится `.env` файл?

```
вашproject/
├── .env  ← ВОТ ЭТОТ ФАЙЛ!
├── package.json
├── src/
├── public/
└── ...
```

**Полный путь:**
```
/tmp/cc-agent/58874416/project/.env
```

---

## 📝 Пример заполненного `.env`

```env

VITE_SUPABASE_URL=https://txnwvaqzmtlhefcxilfu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ===========================================
# STRIPE PAYMENT CONFIGURATION
# ===========================================
# Publishable Key (с Stripe Dashboard → Developers → API Keys)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51MmVH2K9fQr2mBnIabcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJ

# Monthly Price IDs (с Stripe Dashboard → Products)
VITE_STRIPE_PRICE_DAILY_MONTHLY=price_1OXqFxK9fQr2mBnI12345678
VITE_STRIPE_PRICE_CORE_MONTHLY=price_1OXqGYK9fQr2mBnI23456789
VITE_STRIPE_PRICE_MAX_MONTHLY=price_1OXqHZK9fQr2mBnI34567890

# Yearly Price IDs (с Stripe Dashboard → Products)
VITE_STRIPE_PRICE_DAILY_YEARLY=price_1OXqIaK9fQr2mBnI45678901
VITE_STRIPE_PRICE_CORE_YEARLY=price_1OXqJbK9fQr2mBnI56789012
VITE_STRIPE_PRICE_MAX_YEARLY=price_1OXqKcK9fQr2mBnI67890123

# Stripe Configuration
VITE_STRIPE_CURRENCY=usd
VITE_STRIPE_SUCCESS_URL=https://txnwvaqzmtlhefcxilfu.supabase.co/member-zone?payment=success
VITE_STRIPE_CANCEL_URL=https://txnwvaqzmtlhefcxilfu.supabase.co/pricing?payment=cancelled

# ===========================================
# EMAIL CONFIGURATION
# ===========================================
VITE_EMAIL_PROVIDER=mock
VITE_EMAIL_FROM="BioMath Core <no-reply@biomathcore.com>"
VITE_EMAIL_REPLY_TO="support@biomathcore.com"
```

---

## ❓ Частые вопросы

### Q: Где получить ключи Stripe?
**A:** https://dashboard.stripe.com → Developers → API Keys

### Q: Сколько Price IDs нужно создать?
**A:** 6 штук (по 2 на каждый план: monthly и yearly)

### Q: Что делать, если забыл скопировать Price ID?
**A:** Зайти в Products → выбрать продукт → Pricing → там увидите все Price IDs

### Q: Когда использовать test keys vs live keys?
**A:**
- `pk_test_` - для разработки и тестирования
- `pk_live_` - только для production

### Q: Нужно ли перезапускать сервер после изменения .env?
**A:** Да, обязательно!

### Q: Можно ли изменить цены позже?
**A:** Нет, цены immutable. Создайте новые Price IDs и обновите .env

---

## 🎉 Готово!

После выполнения этих шагов:

✅ Stripe полностью настроен
✅ 3 плана с месячной и годовой оплатой
✅ Тестовый режим активен
✅ Можно принимать тестовые платежи

---

## 📞 Поддержка

**Документация:**
- Полный гайд: `STRIPE_INTEGRATION_GUIDE.md`
- Структура цен: `STRIPE_PRICING_STRUCTURE.md`

**Stripe Dashboard:**
- https://dashboard.stripe.com

**Тестовые карты:**
- https://stripe.com/docs/testing

---

**Время настройки:** 10 минут
**Сложность:** Легко
**Статус:** Готово к использованию
