let energy = 0;

// Графіки
let chart, effChart;
let labels = [], data = [];
let effLabels = [], effData = [];

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function checkStatus(value, min, max, element) {
    if (value >= min && value <= max) {
        element.parentElement.classList.add("normal");
        element.parentElement.classList.remove("warning");
    } else {
        element.parentElement.classList.add("warning");
        element.parentElement.classList.remove("normal");
    }
}


function initChart() {
    chart = new Chart(document.getElementById('powerChart'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Потужність (кВт)',
                data: data,
                tension: 0.3
            }]
        }
    });
}

function updateChart(value) {
    let time = new Date().toLocaleTimeString();
    labels.push(time);
    data.push(value);

    if (labels.length > 10) {
        labels.shift();
        data.shift();
    }

    chart.update();
}

function initEffChart() {
    effChart = new Chart(document.getElementById('effChart'), {
        type: 'line',
        data: {
            labels: effLabels,
            datasets: [{
                label: 'Ефективність (%)',
                data: effData,
                tension: 0.3
            }]
        }
    });
}

function updateEffChart(value) {
    let time = new Date().toLocaleTimeString();
    effLabels.push(time);
    effData.push(value);

    if (effLabels.length > 10) {
        effLabels.shift();
        effData.shift();
    }

    effChart.update();
}

// Основна функція

function updateData() {

    let radiation = getRandom(400, 1000);
    let power = getRandom(0, 500);
    let voltage = getRandom(600, 800);
    let temp = getRandom(20, 85);
    let efficiency = getRandom(12, 20);

    document.getElementById("radiation").innerText = radiation + " Вт/м²";
    document.getElementById("power").innerText = power + " кВт";
    document.getElementById("voltage").innerText = voltage + " В";
    document.getElementById("temp").innerText = temp + " °C";
    document.getElementById("efficiency").innerText = efficiency + " %";

    checkStatus(radiation, 600, 900, document.getElementById("radiation"));
    checkStatus(power, 100, 450, document.getElementById("power"));
    checkStatus(voltage, 650, 750, document.getElementById("voltage"));
    checkStatus(temp, 30, 70, document.getElementById("temp"));
    checkStatus(efficiency, 14, 18, document.getElementById("efficiency"));

    // Інвертор
    let inverter = document.getElementById("inverter");
    if (power > 50) {
        inverter.innerText = "Працює";
        inverter.parentElement.classList.add("normal");
    } else {
        inverter.innerText = "Вимкнений";
        inverter.parentElement.classList.add("warning");
    }

    // Енергія
    energy += power / 100;
    document.getElementById("energy").innerText = energy.toFixed(2) + " кВт·год";

    // День/ніч
    let hour = new Date().getHours();
    let timeBadge = document.getElementById("timeOfDay");

    if (hour >= 6 && hour <= 18) {
        timeBadge.innerText = "День";
        document.body.classList.remove("night");
    } else {
        timeBadge.innerText = "Ніч";
        document.body.classList.add("night");
    }

    // Alert
    let alertBox = document.getElementById("alertBox");

    if (
        radiation < 500 ||
        power < 50 ||
        voltage < 620 ||
        temp > 80 ||
        efficiency < 13
    ) {
        alertBox.classList.remove("d-none");
    } else {
        alertBox.classList.add("d-none");
    }

    // Оновлення графіків
    updateChart(power);
    updateEffChart(efficiency);
}

// Запуск
initChart();
initEffChart();
updateData();
setInterval(updateData, 5000);