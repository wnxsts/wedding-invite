require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;

// Проверяем, есть ли DATABASE_URL
if (!process.env.DATABASE_URL) {
    console.error("❌ Ошибка: DATABASE_URL не задан!");
    process.exit(1);
}

// Подключение к PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false, // SSL только на Render
});

app.use(cors());
app.use(express.json());

// Раздаём статику (открывает сайт)
app.use(express.static(path.join(__dirname, "public")));

// Создаём таблицу, если её нет
pool.query(`
    CREATE TABLE IF NOT EXISTS guests (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        attending TEXT NOT NULL
    );
`).then(() => {
    console.log("✅ Таблица guests проверена/создана");
}).catch(err => {
    console.error("❌ Ошибка при создании таблицы:", err);
});

// 📌 Получить список гостей
app.get("/guests", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM guests");
        res.json(result.rows);
    } catch (err) {
        console.error("Ошибка получения гостей:", err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// 📌 Добавить гостя
app.post("/submit", async (req, res) => {
    const { name, attending } = req.body;
    if (!name || !attending) {
        return res.status(400).json({ message: "Заполните все поля" });
    }
    try {
        await pool.query("INSERT INTO guests (name, attending) VALUES ($1, $2)", [name, attending]);
        res.json({ message: "Гость добавлен!" });
    } catch (err) {
        console.error("Ошибка при добавлении гостя:", err);
        res.status(500).json({ error: "Ошибка при добавлении" });
    }
});

// 📌 Обработчик ошибок (чтобы сервер не падал)
app.use((err, req, res, next) => {
    console.error("Ошибка:", err);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
