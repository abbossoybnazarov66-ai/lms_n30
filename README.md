# erp_project
# erp_project


## Test foydalanuvchilar

Login: `POST /api/v1/auth/login`

| Rol | Telefon | Parol |
|---|---|---|
| Admin | +998901234567 | admin123 |
| Ustoz (id 3) | +998900000000 | teacher123 |
| Ustoz (id 5) | +998951112233 | 1234 |



### Rollar

| Rol | Nima qila oladi |
|---|---|
| admin | staff, teacher, students, mentors, category boshqaruvi; kurs va bo'limlarni ko'rish |
| teacher | o'z kurslari va bo'limlarini yaratish, ko'rish, o'zgartirish |

Tokenni `Authorization: Bearer <token>` sarlavhasida yuboring.