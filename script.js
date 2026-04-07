const SUPABASE_URL = 'https://eycbfksbhhzuzmjbugbx.supabase.co';
const SUPABASE_KEY = 'sb_publishable_fnYG427oU9tXRVHUNGHZyA_5j1GcUJg';

// МЕНЯЕМ ИМЯ НА db, чтобы не было ошибки
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let students = [];
let leftIdx, rightIdx;

async function loadStudents() {
    // Везде в коде меняем supabase на db
    const { data, error } = await db.from('students').select('*');
    if (error) {
        console.error("Ошибка загрузки:", error);
    } else {
        students = data;
        if (students && students.length > 0) {
            updatePair();
            updateLeaderboard();
        }
    }
}

// ... остальной код функций updatePair и updateLeaderboard остается таким же ...

async function vote(side) {
    let winner = side === 'left' ? students[leftIdx] : students[rightIdx];
    let loser = side === 'left' ? students[rightIdx] : students[leftIdx];

    const K = 32;
    let expectedW = 1 / (1 + 10 ** ((loser.rating - winner.rating) / 400));
    let expectedL = 1 / (1 + 10 ** ((winner.rating - loser.rating) / 400));

    let newWinnerRating = Math.round(winner.rating + K * (1 - expectedW));
    let newLoserRating = Math.round(loser.rating + K * (0 - expectedL));

    // Здесь тоже меняем на db
    await db.from('students').update({ rating: newWinnerRating }).eq('id', winner.id);
    await db.from('students').update({ rating: newLoserRating }).eq('id', loser.id);

    winner.rating = newWinnerRating;
    loser.rating = newLoserRating;

    updateLeaderboard();
    updatePair();
}

loadStudents();
