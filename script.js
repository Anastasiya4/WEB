const form = document.getElementById('form');
const list = document.getElementById('list');
const filter = document.getElementById('filter');
const search = document.getElementById('search');
const message = document.getElementById('message');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form));

    try {
        const res = await fetch('/api/substations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (!res.ok) throw new Error(result.message);

        showMessage('success', 'Підстанцію додано');
        form.reset();
        load();

    } catch (err) {
        showMessage('danger', err.message);
    }
});

async function load() {
    const res = await fetch('/api/substations');
    let data = await res.json();

    if (filter.value !== 'all') {
        data = data.filter(x => x.status === filter.value);
    }

    if (search.value) {
        data = data.filter(x =>
            x.name.toLowerCase().includes(search.value.toLowerCase())
        );
    }

    render(data);
    drawChart(data);
}

function render(data) {
    list.innerHTML = data.map(x => `
        <div class="card p-3 mb-2 ${getStatusClass(x)}">
            <h5>${x.name}</h5>

            <p><b>Тип:</b> ${x.type}</p>
            <p><b>Адреса:</b> ${x.address}</p>
            <p><b>Потужність:</b> ${x.power} МВА</p>
            <p><b>Клас напруги:</b> ${x.voltage}</p>
            <p><b>Кількість трансформаторів:</b> ${x.transformers}</p>

            <p><b>Рік:</b> ${x.year}</p>
            <p><b>Вік:</b> ${x.age} років</p>
            <p><b>Стан:</b> ${x.status}</p>

            <button class="btn btn-danger btn-sm"
                onclick="remove('${x.id}')">Видалити</button>
        </div>
    `).join('');
}

function getStatusClass(x) {
    if (x.status === 'active') return 'border-success';
    if (x.status === 'repair') return 'border-warning';
    return 'border-danger';
}

async function remove(id) {
    if (!confirm('Видалити підстанцію?')) return;

    await fetch('/api/substations/' + id, { method: 'DELETE' });
    showMessage('warning', 'Видалено');
    load();
}

function showMessage(type, text) {
    message.innerHTML = `<div class="alert alert-${type}">${text}</div>`;
    setTimeout(() => message.innerHTML = '', 4000);
}

let chart;

function drawChart(data) {
    const counts = {
        active: data.filter(x => x.status === 'active').length,
        repair: data.filter(x => x.status === 'repair').length,
        аварійна: data.filter(x => x.status === 'аварійна').length
    };

    const ctx = document.getElementById('chart');

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Активні', 'Ремонт', 'Аварійні'],
            datasets: [{
                data: Object.values(counts)
            }]
        }
    });
}

filter.addEventListener('change', load);
search.addEventListener('input', load);

setInterval(load, 5000);
load();