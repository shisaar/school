// Используем переменную db вместо supabase, чтобы не было конфликтов
const SUPABASE_URL = 'https://eycbfksbhhzuzmjbugbx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5Y2Jma3NiaGh6dXptamJ1Z2J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NTc5MzksImV4cCI6MjA5MTEzMzkzOX0.0UqGyZ7iOOZ3IaAoVw5OYs0wGP48hX5mB5FbEW-Ncq0';

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
        } else {
            console.log("Добавь минимум 2 человека в таблицу students в Supabase!");
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

    // Обновляем в базе
    await db.from('students').update({ rating: newWinnerRating }).eq('id', winner.id);
    await db.from('students').update({ rating: newLoserRating }).eq('id', loser.id);

    // Обновляем локально
    winner.rating = newWinnerRating;
    loser.rating = newLoserRating;

    updateLeaderboard();
    updatePair();
}

function updateLeaderboard() {
    const list = document.getElementById('leader-list');
    list.innerHTML = "";
    let sorted = [...students].sort((a, b) => b.rating - a.rating);
    sorted.slice(0, 10).forEach((s, index) => {
        list.innerHTML += `<li>#${index+1} ${s.name}: ${s.rating}</li>`;
    });
}

// Запуск
loadStudents();
