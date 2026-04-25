const canvas = document.getElementById('pendulumCanvas');
const ctx = canvas.getContext('2d');
const ampInput = document.getElementById('amplitude');
const freqInput = document.getElementById('frequency');
const ampValue = document.getElementById('ampValue');
const freqValue = document.getElementById('freqValue');

canvas.width = 400;
canvas.height = 300;

let time = 0;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const A = parseFloat(ampInput.value);
    const omega = parseFloat(freqInput.value);
    
    ampValue.textContent = A;
    freqValue.textContent = omega;

    // Центр подвеса
    const centerX = canvas.width / 2;
    const centerY = 50;

    // Расчет положения по формуле x(t) = A * cos(omega * t)
    // Используем sin для вертикального маятника, чтобы он качался влево-вправо
    const x = A * Math.sin(omega * time);
    const y = Math.sqrt(Math.pow(200, 2) - Math.pow(x, 2)); // Длина нити зафиксирована (200)

    // Рисуем нить
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + x, centerY + y);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Рисуем груз
    ctx.beginPath();
    ctx.arc(centerX + x, centerY + y, 15, 0, Math.PI * 2);
    ctx.fillStyle = '#007bff';
    ctx.fill();
    ctx.closePath();

    time += 0.02; // Скорость течения времени
    requestAnimationFrame(draw);
}

draw();
