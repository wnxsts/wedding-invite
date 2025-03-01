const express = require("express");
const path = require("path");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
const PORT = process.env.PORT || 4000;

// Подключаем базу SQLite (файл data.db)
const db = new Database("data.db", { verbose: console.log });

// Создаём таблицу гостей, если её нет
db.prepare(`
    CREATE TABLE IF NOT EXISTS guests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        attending TEXT NOT NULL
    )
`).run();

app.use(cors());
app.use(express.json());

// Раздаём статику
app.use(express.static(path.join(__dirname, "public")));

// Главная страница
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "inv.html"));
});

// 📌 Получить список гостей
app.get("/guests", (req, res) => {
    const guests = db.prepare("SELECT * FROM guests").all();
    res.json(guests);
});

// 📌 Сохранить анкету
app.post("/submit", (req, res) => {
    const { name, attending } = req.body;
    if (!name || !attending) {
        return res.status(400).json({ message: "Барлық өрістерді толтырыңыз." });
    }

    // Сохраняем в базу данных
    db.prepare("INSERT INTO guests (name, attending) VALUES (?, ?)").run(name, attending);

    res.json({ message: "Қатысу сәтті расталды!" });
});

// Запускаем сервер
app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на порту ${PORT}`);
});
