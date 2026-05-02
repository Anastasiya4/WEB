const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const DATA_FILE = path.join(__dirname, 'data', 'substations.json');

function readData() {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE));
}

function writeData(data) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/substations', (req, res) => {
    res.json(readData());
});

app.post('/api/substations', (req, res) => {
    const {
        name, type, address,
        power, voltage,
        transformers, year, status
    } = req.body;

    // Валідція
    if (!name || !type || !address || !power || !voltage || !transformers || !year || !status) {
        return res.status(400).json({
            success: false,
            message: 'Заповніть всі поля'
        });
    }

    const y = parseInt(year);
    if (y < 1950 || y > 2025) {
        return res.status(400).json({
            success: false,
            message: 'Рік має бути 1950–2025'
        });
    }

    const newItem = {
        id: Date.now().toString(),
        name,
        type,
        address,
        power: Number(power),
        voltage,
        transformers: Number(transformers),
        year: y,
        status,
        age: new Date().getFullYear() - y
    };

    const data = readData();
    data.push(newItem);
    writeData(data);

    res.json({ success: true });
});

app.delete('/api/substations/:id', (req, res) => {
    let data = readData();
    data = data.filter(x => x.id !== req.params.id);
    writeData(data);
    res.json({ success: true });
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));