// Временная база данных (заменится на реальную облачную позже)
let students = [
    { id: 1, name: "Алексей", photo: "https://via.placeholder.com/300x400?text=Alex", rating: 1200 },
    { id: 2, name: "Мария", photo: "https://via.placeholder.com/300x400?text=Maria", rating: 1200 },
    { id: 3, name: "Иван", photo: "https://via.placeholder.com/300x400?text=Ivan", rating: 1200 },
    { id: 4, name: "Дарья", photo: "https://via.placeholder.com/300x400?text=Daria", rating: 1200 }
];

let leftIdx, rightIdx;

function updatePair() {
    leftIdx = Math.floor(Math.random() * students.length);
    do {
        rightIdx = Math.floor(Math.random() * students.length);
    } while (leftIdx === rightIdx);

    document.getElementById('left-img').src = students[leftIdx].photo;
    document.getElementById('left-name').innerText = students[leftIdx].name;
    document.getElementById('right-img').src = students[rightIdx].photo;
    document.getElementById('right-name').innerText = students[rightIdx].name;
}

function vote(side) {
    let winner = side === 'left' ? students[leftIdx] : students[rightIdx];
    let loser = side === 'left' ? students[rightIdx] : students[leftIdx];

    // Формула Эло
    const K = 32;
    let expectedW = 1 / (1 + 10 ** ((loser.rating - winner.rating) / 400));
    let expectedL = 1 / (1 + 10 ** ((winner.rating - loser.rating) / 400));

    winner.rating += Math.round(K * (1 - expectedW));
    loser.rating += Math.round(K * (0 - expectedL));

    updateLeaderboard();
    updatePair();
}

function updateLeaderboard() {
    const list = document.getElementById('leader-list');
    list.innerHTML = "";
    let sorted = [...students].sort((a, b) => b.rating - a.rating);
    sorted.forEach(s => {
        list.innerHTML += `<li>${s.name}: ${s.rating}</li>`;
    });
}

// Старт
updatePair();
updateLeaderboard();