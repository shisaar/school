alert("СКРИПТ ЗАГРУЖЕН!")
// Твои настройки подключения (УЖЕ ВПИСАЛ ТВОЙ URL)
// Используй window.supabase, чтобы браузер точно увидел библиотеку
const SUPABASE_URL = 'https://eycbfksbhhzuzmjbugbx.supabase.co';
const SUPABASE_KEY = 'sb_publishable_fM7G427oU9tXRVHUNGHZyA_5jlGcUJg'; // Проверь, чтобы тут был длинный ключ в кавычках

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


let students = [];
let leftIdx, rightIdx;

async function loadStudents() {
    const { data, error } = await supabase.from('students').select('*');
    if (error) {
        console.error("Ошибка загрузки:", error);
    } else {
        students = data;
        updatePair();
        updateLeaderboard();
    }
}

function updatePair() {
    if (students.length < 2) return;
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

    await supabase.from('students').update({ rating: newWinnerRating }).eq('id', winner.id);
    await supabase.from('students').update({ rating: newLoserRating }).eq('id', loser.id);

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

loadStudents();
