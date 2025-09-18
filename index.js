const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());

// ================== "База даних" у файлі ==================
// Зберігаємо користувачів у users.json, щоб дані не зникали після рестарту
const DB_PATH = path.join(__dirname, "users.json");
let users = [];
let nextId = 1;

// Завантаження даних з файлу під час старту сервера
function load() {
    try {
        users = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
        // Обчислюємо наступний ID (максимальний існуючий + 1)
        nextId = users.reduce((m, u) => Math.max(m, u.id), 0) + 1;
    } catch {
        // Якщо файлу немає або він порожній — стартуємо з нуля
        users = [];
        nextId = 1;
    }
}

// Збереження поточного масиву користувачів у файл
function save() {
    fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
}

load();


// Перевіряємо тіло запиту на валідність згідно ТЗ
// - name: довжина > 3
// - age: число, >= 0
function validateUserPayload(payload) {
    const name = typeof payload.name === "string" ? payload.name.trim() : "";
    const age = Number(payload.age);

    if (name.length <= 3) return { error: "Name must be longer than 3 characters" };
    if (!Number.isFinite(age) || age < 0) return { error: "Age must be a number >= 0" };

    return { name, age };
}

// Повертаємо індекс користувача в масиві за id або -1, якщо не знайдено
function getIndexById(idStr) {
    const id = Number(idStr);
    if (!Number.isInteger(id) || id <= 0) return -1;
    return users.findIndex((u) => u.id === id);
}


// CREATE: створення одного користувача або масиву користувачів
// POST /users
app.post("/users", (req, res) => {
    // Дозволяємо як один об’єкт, так і масив об’єктів
    const items = Array.isArray(req.body) ? req.body : [req.body];
    const created = [];

    for (let i = 0; i < items.length; i++) {
        // Валідація на ім’я та вік
        const v = validateUserPayload(items[i]);
        if (v.error) {
            // Якщо щось не так — повертаємо 400 та індекс проблемного елемента
            return res.status(400).json({ error: v.error, index: i });
        }
        // Створюємо нового користувача з унікальним id
        const user = { id: nextId++, name: v.name, age: v.age };
        users.push(user);
        created.push(user);
    }

    // Після змін обов’язково зберігаємо у файл
    save();

    // 201 Created — повертаємо створеного(их) користувача(ів)
    res.status(201).json(created.length === 1 ? created[0] : created);
});

// READ (all): повертаємо всіх користувачів
// GET /users
app.get("/users", (req, res) => {
    res.json(users);
});

// READ (one): повертаємо конкретного користувача за id
// GET /users/:id
app.get("/users/:id", (req, res) => {
    const idx = getIndexById(req.params.id);
    if (idx === -1) {
        // Якщо користувача немає — 404 Not Found
        return res.status(404).json({ error: "User not found" });
    }
    res.json(users[idx]);
});

// UPDATE (full replace): повне оновлення користувача за id
// PUT /users/:id
app.put("/users/:id", (req, res) => {
    const idx = getIndexById(req.params.id);
    if (idx === -1) {
        // Якщо користувача немає — 404 Not Found
        return res.status(404).json({ error: "User not found" });
    }

    // Валідація тіла запиту (ті ж правила, що і для створення)
    const v = validateUserPayload(req.body);
    if (v.error) {
        // Некоректні дані — 400 Bad Request
        return res.status(400).json({ error: v.error });
    }

    // Зберігаємо оновлені дані (id не змінюємо)
    users[idx] = { id: users[idx].id, name: v.name, age: v.age };
    save();
    res.json(users[idx]);
});

// DELETE: видаляємо користувача за id
// DELETE /users/:id
app.delete("/users/:id", (req, res) => {
    const idx = getIndexById(req.params.id);
    if (idx === -1) {
        // Якщо користувача немає — 404 Not Found
        return res.status(404).json({ error: "User not found" });
    }

    // Видаляємо та повертаємо видаленого користувача (для зручності)
    const removed = users.splice(idx, 1)[0];
    save();
    res.json(removed);
});

// ================== Обробка помилок JSON ==================
// Якщо надіслали некоректний JSON — повертаємо 400 з повідомленням
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && "body" in err) {
        return res.status(400).json({ error: "Invalid JSON" });
    }
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
});

// ================== Старт сервера ==================
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000/");
});
