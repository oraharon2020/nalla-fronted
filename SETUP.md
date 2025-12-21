# 🚀 מדריך שכפול הפרויקט לאתר חדש

## סקירה כללית
פרויקט Next.js 15 + WooCommerce Headless עם תשלומים דרך Grow/Meshulam.

---

## 1. קבצים לעדכון

### 📁 `src/config/site.ts` - הקובץ העיקרי!
```typescript
export const siteConfig = {
  // שם האתר
  name: 'שם האתר',
  tagline: 'תיאור קצר',
  fullName: 'שם האתר - תיאור',
  
  // כתובות
  url: 'https://www.NEW-SITE.co.il',
  wordpressUrl: 'https://admin.NEW-SITE.co.il',
  
  // Meshulam - חשוב!
  meshulam: {
    userId: 'USER_ID_FROM_GROW',        // לקבל מ-Grow
    apiKey: 'ae67b1668109',              // בדרך כלל אותו דבר
    pageCodes: {
      creditCard: 'PAGE_CODE_CREDIT',   // לקבל מ-Grow
      bit: 'PAGE_CODE_BIT',
      applePay: 'PAGE_CODE_APPLE',
      googlePay: 'PAGE_CODE_GOOGLE',
    },
  },
  
  // תפריטים, פרטי קשר וכו'...
}
```

### 📁 `.env.local`
```env
NEXT_PUBLIC_WORDPRESS_URL=https://admin.NEW-SITE.co.il
NEXT_PUBLIC_SITE_URL=https://www.NEW-SITE.co.il
WOOCOMMERCE_CONSUMER_KEY=ck_xxxxx
WOOCOMMERCE_CONSUMER_SECRET=cs_xxxxx
```

### 📁 `bellanonext-v2/modules/class-checkout.php`
שורה 12 - עדכן את ה-fallback userId:
```php
private $fallback_userId = 'NEW_USER_ID_HERE';
```

---

## 2. הגדרת Vercel

1. צור פרויקט חדש ב-Vercel
2. חבר ל-GitHub repo
3. הגדר Environment Variables:
   - `NEXT_PUBLIC_WORDPRESS_URL`
   - `NEXT_PUBLIC_SITE_URL`
   - `WOOCOMMERCE_CONSUMER_KEY`
   - `WOOCOMMERCE_CONSUMER_SECRET`
4. הגדר דומיין מותאם אישית

---

## 3. הגדרת WordPress

### התקנת פלאגינים:
1. **WooCommerce** - חנות
2. **Grow Payment Gateway** - תשלומים
3. **bellanonext-v2** - הפלאגין שלנו (העלה ZIP)

### הגדרת Grow:
1. לך ל-**Grow Pay** בתפריט
2. הכנס License Key
3. הכנס Email
4. שמור - זה יביא את ה-userId וה-pageCodes

### הגדרת WooCommerce REST API:
1. WooCommerce → Settings → Advanced → REST API
2. צור מפתח חדש עם הרשאות Read/Write
3. העתק Consumer Key ו-Consumer Secret

---

## 4. הגדרת DNS

### בדומיין הראשי (לדוגמה: new-site.co.il):
```
www     CNAME   cname.vercel-dns.com
@       A       76.76.21.21 (Vercel)
```

### בתת-דומיין admin:
```
admin   A       IP_OF_WORDPRESS_SERVER
```

---

## 5. בדיקות אחרי ההתקנה

- [ ] דף הבית נטען
- [ ] קטגוריות ומוצרים מוצגים
- [ ] תמונות נטענות (לא שגיאות CORS)
- [ ] הוספה לעגלה עובדת
- [ ] תהליך Checkout עובד
- [ ] תשלום Meshulam עובד (נפתח דף תשלום)
- [ ] Webhook מעדכן סטטוס הזמנה

---

## 6. פתרון בעיות נפוצות

### "שגיאה בחיבור למשולם"
- בדוק שה-userId נכון ב-WordPress
- בדוק שה-fallback_userId מעודכן בפלאגין

### תמונות לא נטענות
- בדוק CORS ב-WordPress (.htaccess)
- או השתמש ב-proxy route: `/api/proxy-image`

### Meshulam חוסם בקשות
- הבקשות עוברות דרך WordPress proxy (לא ישירות מ-Vercel)
- אם יש בעיה - בדוק שהפלאגין bellanonext-v2 מותקן ופעיל

---

## 7. קבצים חשובים

| קובץ | תיאור |
|------|--------|
| `src/config/site.ts` | כל הקונפיגורציה של האתר |
| `bellanonext-v2/` | פלאגין WordPress |
| `.env.local` | משתני סביבה (לא ב-Git) |
| `src/app/api/checkout/` | API routes לתשלום |

---

## 8. פרטי Grow/Meshulam לשמירה

```
License Key: ____________________
Email: ____________________
userId: ____________________
Credit Card pageCode: ____________________
Bit pageCode: ____________________
```

---

## צור קשר לתמיכה
- **Grow/Meshulam:** 03-5090100
- **Vercel:** vercel.com/support
