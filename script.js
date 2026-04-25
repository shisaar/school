const canvas = document.getElementById('pendulumCanvas');
const ctx = canvas.getContext('2d');
const ampInput = document.getElementById('amplitude');
const freqInput = document.getElementById('frequency');
const resetBtn = document.getElementById('resetBtn');

canvas.width = 400;
canvas.height = 400;

let time = 0;
let damping = 0.998; 
let currentAmp = parseFloat(ampInput.value);

function draw() {
    // Полупрозрачный фон для эффекта шлейфа
    ctx.fillStyle = 'rgba(15, 23, 42, 0.2)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const targetAmp = parseFloat(ampInput.value);
    const omega = parseFloat(freqInput.value);
    
    // Плавный переход амплитуды
    currentAmp = currentAmp * damping + (targetAmp * (1 - damping));

    const centerX = canvas.width / 2;
    const centerY = 50;
    const length = 250;

    // Уравнение гармонических колебаний
    const angle = (currentAmp / 100) * Math.sin(omega * time);
    
    const x = centerX + length * Math.sin(angle);
    const y = centerY + length * Math.cos(angle);

    // Рисуем нить
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Свечение груза
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 20);
    gradient.addColorStop(0, '#818cf8');
    gradient.addColorStop(1, 'transparent');
    
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Сам груз
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#6366f1';
    ctx.fill();

    time += 0.02;
    requestAnimationFrame(draw);
}

resetBtn.onclick = () => { 
    currentAmp = parseFloat(ampInput.value); 
};

draw();
