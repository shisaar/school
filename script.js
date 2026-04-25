const canvas = document.getElementById('pendulumCanvas');
const ctx = canvas.getContext('2d');
const ampInput = document.getElementById('amplitude');
const freqInput = document.getElementById('frequency');
const resetBtn = document.getElementById('resetBtn');

canvas.width = 400;
canvas.height = 400;

let time = 0;
let currentAmp = parseFloat(ampInput.value);

function draw() {
    // Эффект плавного затухания следа (шлейф)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.2)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const targetAmp = parseFloat(ampInput.value);
    const omega = parseFloat(freqInput.value);
    
    // Плавное следование за ползунком амплитуды
    currentAmp = currentAmp * 0.98 + (targetAmp * 0.02);

    const centerX = canvas.width / 2;
    const centerY = 40;
    const length = 280;

    // Математическая модель x(t) = A * cos(wt)
    // Используем sin для угла отклонения
    const angle = (currentAmp / 120) * Math.sin(omega * time);
    
    const x = centerX + length * Math.sin(angle);
    const y = centerY + length * Math.cos(angle);

    // Рисуем нить маятника
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Рисуем свечение груза
    const glow = ctx.createRadialGradient(x, y, 0, x, y, 25);
    glow.addColorStop(0, 'rgba(99, 102, 241, 0.5)');
    glow.addColorStop(1, 'transparent');
    
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    // Сам шар
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#818cf8';
    ctx.fill();

    time += 0.025;
    requestAnimationFrame(draw);
}

// Сброс амплитуды
resetBtn.onclick = () => {
    currentAmp = parseFloat(ampInput.value);
};

// Запуск
draw();
