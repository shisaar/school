const SUPABASE_URL = 'https://eycbfksbhhzuzmjbugbx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5Y2Jma3NiaGh6dXptamJ1Z2J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NTc5MzksImV4cCI6MjA5MTEzMzkzOX0.0UqGyZ7iOOZ3IaAoVw5OYs0wGP48hX5mB5FbEW-Ncq0';

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let totalVotes = 0;
let students = [];
let leftIdx, rightIdx;

async function loadStudents() {
    const { data, error } = await db.from('students').select('*');
    if (error) {
        console.error("Ошибка загрузки:", error);
    } else {
        students = data;
        if (students && students.length > 1) {
            updatePair();
            updateLeaderboard();
        }
    }
}

function updatePair() {
    if (!students.length) return;
    leftIdx = Math.floor(Math.random() * students.length);
    do {
        rightIdx = Math.floor(Math.random() * students.length);
    } while (leftIdx === rightIdx);

    document.getElementById('left-img').src = students[leftIdx].photo_url;
    document.getElementById('left-name').innerText = students[leftIdx].name;
    document.getElementById('right-img').src = students[rightIdx].photo_url;
    document.getElementById('right-name').innerText = students[rightIdx].name;
}

async function vote(side) {
    if (!students[leftIdx] || !students[rightIdx]) return; // Защита от ошибок

    let winner = side === 'left' ? students[leftIdx] : students[rightIdx];
    let loser = side === 'left' ? students[rightIdx] : students[leftIdx];

    const K = 32;
    let expectedW = 1 / (1 + 10 ** ((loser.rating - winner.rating) / 400));
    let expectedL = 1 / (1 + 10 ** ((winner.rating - loser.rating) / 400));

    winner.rating = Math.round(winner.rating + K * (1 - expectedW));
    loser.rating = Math.round(loser.rating + K * (0 - expectedL));

    updateLeaderboard();
    updatePair();

    await db.from('students').update({ rating: winner.rating }).eq('id', winner.id);
    await db.from('students').update({ rating: loser.rating }).eq('id', loser.id);
}

function updateLeaderboard() {
    const container = document.getElementById('leader-container');
    if (!container) return;

    let sorted = [...students].sort((a, b) => b.rating - a.rating).slice(0, 8);
    const maxRating = sorted.length > 0 ? sorted[0].rating : 1200;

    sorted.forEach((student, index) => {
        let el = document.getElementById(`row-${student.id}`);
        if (!el) {
            el = document.createElement('div');
            el.id = `row-${student.id}`;
            el.className = 'leader-item';
            el.innerHTML = `
                <img src="${student.photo_url}" class="mini-avatar">
                <div class="leader-name" style="width:100px; overflow:hidden;">${student.name}</div>
                <div class="bar" id="bar-${student.id}"></div>
            `;
            container.appendChild(el);
        }
        el.style.transform = `translateY(${index * 60}px)`;
        const bar = document.getElementById(`bar-${student.id}`);
        bar.style.width = `${(student.rating / maxRating) * 60}%`;
        bar.innerText = Math.round(student.rating);
    });
}
d

// Обновленная функция голосования с анимацией
async function vote(side) {
    const leftCard = document.getElementById('left-card');
    const rightCard = document.getElementById('right-card');

    let winner = side === 'left' ? students[leftIdx] : students[rightIdx];
    let loser = side === 'left' ? students[rightIdx] : students[leftIdx];
    let winnerEl = side === 'left' ? leftCard : rightCard;
    let loserEl = side === 'left' ? rightCard : leftCard;

    // 1. Включаем анимацию
    winnerEl.classList.add('winner-anim');
    loserEl.classList.add('loser-anim');

    // Расчет рейтинга (оставляем твой код)
    const K = 32;
    let expectedW = 1 / (1 + 10 ** ((loser.rating - winner.rating) / 400));
    let expectedL = 1 / (1 + 10 ** ((winner.rating - loser.rating) / 400));
    winner.rating = Math.round(winner.rating + K * (1 - expectedW));
    loser.rating = Math.round(loser.rating + K * (0 - expectedL));

    // Обновляем статистику
    totalVotes++;
    document.getElementById('total-votes').innerText = totalVotes;

    // Ждем полсекунды, чтобы увидеть анимацию
    setTimeout(async () => {
        // 2. Убираем анимацию и меняем пару
        winnerEl.classList.remove('winner-anim');
        loserEl.classList.remove('loser-anim');
        
        updateLeaderboard();
        updatePair();

        // 3. Отправляем в базу
        await db.from('students').update({ rating: winner.rating }).eq('id', winner.id);
        await db.from('students').update({ rating: loser.rating }).eq('id', loser.id);
    }, 500);
}

// Простая имитация онлайна (для красоты)
function updateOnline() {
    // Генерируем число от 1 до 5 вокруг реального (пока нет сервера для точного онлайна)
    const mockOnline = Math.floor(Math.random() * 3) + 1; 
    document.getElementById('online-count').innerText = mockOnline;
}
setInterval(updateOnline, 10000); // Обновлять каждые 10 сек

loadStudents();
