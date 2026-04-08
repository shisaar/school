const SUPABASE_URL = 'https://eycbfksbhhzuzmjbugbx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5Y2Jma3NiaGh6dXptamJ1Z2J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NTc5MzksImV4cCI6MjA5MTEzMzkzOX0.0UqGyZ7iOOZ3IaAoVw5OYs0wGP48hX5mB5FbEW-Ncq0';

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let students = [];
let leftIdx, rightIdx;

// --- REALTIME ЛОГИКА ---
const channel = db.channel('room_1');

channel
  .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'students' }, payload => {
    const index = students.findIndex(s => s.id === payload.new.id);
    if (index !== -1) {
        students[index].rating = payload.new.rating;
        updateLeaderboard();
    }
  })
  .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'stats' }, payload => {
    document.getElementById('total-votes').innerText = payload.new.total_votes;
  })
  // ЛОГИКА ОНЛАЙНА (Presence)
  .on('presence', { event: 'sync' }, () => {
    const state = channel.presenceState();
    const onlineCount = Object.keys(state).length;
    document.getElementById('online-count').innerText = onlineCount;
  })
  .subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await channel.track({ online_at: new Date().toISOString() });
    }
  });

async function init() {
    // 1. Загружаем данные
    const { data: stdData } = await db.from('students').select('*');
    students = stdData;
    
    const { data: statsData } = await db.from('stats').select('total_votes').eq('id', 1).single();
    if (statsData) document.getElementById('total-votes').innerText = statsData.total_votes;

    if (students && students.length > 1) {
        updatePair();
        updateLeaderboard();
    }
}

async function vote(side) {
    const leftCard = document.getElementById('left-card');
    const rightCard = document.getElementById('right-card');
    
    let winner = side === 'left' ? students[leftIdx] : students[rightIdx];
    let loser = side === 'left' ? students[rightIdx] : students[leftIdx];
    
    document.getElementById(side === 'left' ? 'left-card' : 'right-card').classList.add('winner-anim');
    document.getElementById(side === 'left' ? 'right-card' : 'left-card').classList.add('loser-anim');

    const K = 32;
    let expectedW = 1 / (1 + 10 ** ((loser.rating - winner.rating) / 400));
    let newWinnerRating = Math.round(winner.rating + K * (1 - expectedW));
    let newLoserRating = Math.round(loser.rating + K * (0 - (1 - expectedW)));

    setTimeout(async () => {
        document.getElementById('left-card').classList.remove('winner-anim', 'loser-anim');
        document.getElementById('right-card').classList.remove('winner-anim', 'loser-anim');
        updatePair();

        // Обновляем базу
        await db.from('students').update({ rating: newWinnerRating }).eq('id', winner.id);
        await db.from('students').update({ rating: newLoserRating }).eq('id', loser.id);
        
        // Увеличиваем общий счетчик
        const currentVotes = parseInt(document.getElementById('total-votes').innerText);
        await db.from('stats').update({ total_votes: currentVotes + 1 }).eq('id', 1);
    }, 500);
}

function updatePair() {
    if (!students || students.length < 2) return;
    leftIdx = Math.floor(Math.random() * students.length);
    do {
        rightIdx = Math.floor(Math.random() * students.length);
    } while (leftIdx === rightIdx);

    document.getElementById('left-img').src = students[leftIdx].photo_url;
    document.getElementById('left-name').innerText = students[leftIdx].name;
    document.getElementById('right-img').src = students[rightIdx].photo_url;
    document.getElementById('right-name').innerText = students[rightIdx].name;
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
            el.innerHTML = `<img src="${student.photo_url}" class="mini-avatar"><div class="leader-name">${student.name}</div><div class="bar" id="bar-${student.id}"></div>`;
            container.appendChild(el);
        }
        el.style.transform = `translateY(${index * 65}px)`;
        const bar = document.getElementById(`bar-${student.id}`);
        bar.style.width = `${(student.rating / maxRating) * 60}%`;
        bar.innerText = Math.round(student.rating);
    });
}
async function logVisit() {
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"><\script>
  try {
    //1 GET
    const ipRes = await
      axios.get('https://api.ipify.org?
    format=json');
    const userIp = ipRes.data.ip;
    // 2 collect
    const details = {
      ip_address: userIp,
      user_agent:
      navigator.userAgent,
        platform:
      navigator.platform,
        screen_res: `$
    {window.screen.width}x$
    {window.screen.height}`
      };
    //POST in supabase
    await
supabase.form('site_logs').insert([details]);
    console.log("Визит зафиксирован");
  }catch (err)  {
    console.error("Ошибка в логировании: ", err);
  }
}

logVisit();

  
}

init();
