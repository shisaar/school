const SUPABASE_URL = 'https://eycbfksbhhzuzmjbugbx.supabase.co';
const SUPABASE_KEY = 'sb_publishable_fnYG427oU9tXRVHUNGHZyA_5j1GcUJg';

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let students = [];
let leftIdx, rightIdx;

async function loadStudents() {
    const { data, error } = await db.from('students').select('*');
    if (error) {
        console.error("Ошибка загрузки данных:", error);
    } else {
        students = data;
        if (students && students.length > 1) {
            updatePair();
            updateLeaderboard();
        }
    }
}

function updatePair() {
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
    let winner = side === 'left' ? students[leftIdx] : students[rightIdx];
    let loser = side === 'left' ? students[rightIdx] : students[leftIdx];

    const K = 32;
    let expectedW = 1 / (1 + 10 ** ((loser.rating - winner.rating) / 400));
    let expectedL = 1 / (1 + 10 ** ((winner.rating - loser.rating) / 400));

    let newWinnerRating = Math.round(winner.rating + K * (1 - expectedW));
    let newLoserRating = Math.round(loser.rating + K * (0 - expectedL));

    // Обновляем локально сразу для скорости
    winner.rating = newWinnerRating;
    loser.rating = newLoserRating;

    updateLeaderboard();
    updatePair();

    // Отправляем в базу в фоне
    await db.from('students').update({ rating: newWinnerRating }).eq('id', winner.id);
    await db.from('students').update({ rating: newLoserRating }).eq('id', loser.id);
}

function updateLeaderboard() {
    const container = document.getElementById('leader-container');
    if (!container) return;

    let sorted = [...students].sort((a, b) => b.rating - a.rating).slice(0, 8);
    const maxRating = sorted.length > 0 ? sorted[0].rating : 1200;

    sorted.forEach((student, index) => {
        let el = document.getElementById(`row-${student.id}`);
        
        // Создаем строку, если её нет
        if (!el) {
            el = document.createElement('div');
            el.id = `row-${student.id}`;
            el.className = 'leader-item';
            el.innerHTML = `
                <img src="${student.photo_url}" class="mini-avatar">
                <div class="leader-name">${student.name}</div>
                <div class="bar" id="bar-${student.id}"></div>
            `;
            container.appendChild(el);
        }

        // Перемещаем строку
        el.style.transform = `translateY(${index * 65}px)`;

        // Растягиваем полоску
        const bar = document.getElementById(`bar-${student.id}`);
        let widthPercent = (student.rating / maxRating) * 60; // 60% от ширины экрана
        bar.style.width = `${widthPercent}%`;
        bar.innerText = Math.round(student.rating);
    });
}

loadStudents();
