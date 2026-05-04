const express = require('express');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Логування запитів
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Дані
let substations = [
    {
        id: 1,
        name: "ТП-110/35/10 Центральна",
        voltageHigh: 110,
        voltageMedium: 35,
        voltageLow: 10,
        transformerPower: 40,
        load: 25,
        temperature: 60,
        status: "active"
    }
];

// GET всі підстанції (+ фільтр)
app.get('/api/substations', (req, res) => {
    const { status } = req.query;

    if (status) {
        return res.json(substations.filter(s => s.status === status));
    }

    res.json(substations);
});

// GET за ID
app.get('/api/substations/:id', (req, res) => {
    const sub = substations.find(s => s.id == req.params.id);

    if (!sub) {
        return res.status(404).json({ error: "Не знайдено" });
    }

    res.json(sub);
});

// GET параметри
app.get('/api/substations/:id/parameters', (req, res) => {
    const sub = substations.find(s => s.id == req.params.id);

    if (!sub) {
        return res.status(404).json({ error: "Не знайдено" });
    }

    res.json({
        voltages: {
            high: sub.voltageHigh,
            medium: sub.voltageMedium,
            low: sub.voltageLow
        },
        load: sub.load,
        temperature: sub.temperature,
        status: sub.status
    });
});

// POST
app.post('/api/substations', (req, res) => {
    const { name, voltageHigh, voltageLow, transformerPower } = req.body;

    if (!name || !voltageHigh || !voltageLow || !transformerPower) {
        return res.status(400).json({ error: "Не всі поля заповнені" });
    }

    const newSub = {
        id: substations.length + 1,
        ...req.body,
        load: 0,
        temperature: 25,
        status: "active"
    };

    substations.push(newSub);
    res.status(201).json(newSub);
});

// PUT
app.put('/api/substations/:id', (req, res) => {
    const index = substations.findIndex(s => s.id == req.params.id);

    if (index === -1) {
        return res.status(404).json({ error: "Не знайдено" });
    }

    substations[index] = {
        id: parseInt(req.params.id),
        ...req.body
    };

    res.json(substations[index]);
});

// PATCH
app.patch('/api/substations/:id', (req, res) => {
    const index = substations.findIndex(s => s.id == req.params.id);

    if (index === -1) {
        return res.status(404).json({ error: "Не знайдено" });
    }

    substations[index] = {
        ...substations[index],
        ...req.body
    };

    res.json(substations[index]);
});

// DELETE
app.delete('/api/substations/:id', (req, res) => {
    const index = substations.findIndex(s => s.id == req.params.id);

    if (index === -1) {
        return res.status(404).json({ error: "Не знайдено" });
    }

    substations.splice(index, 1);
    res.json({ message: "Видалено" });
});

// Запуск
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});