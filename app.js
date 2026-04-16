const HABITS = [
  { id: 'teeth',   name: '歯磨き',   emoji: '🦷', weekly: false },
  { id: 'running', name: 'ランニング', emoji: '🏃', weekly: true  },
  { id: 'bath',    name: 'お風呂',   emoji: '🛁', weekly: false },
  { id: 'clean',   name: '掃除',     emoji: '🧹', weekly: false },
];

const STORAGE_KEY = 'habit_tracker_data';

function formatDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function todayKey() {
  return formatDate(new Date());
}

// その週の月曜日を返す
function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function loadData() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// 日次ストリーク
function getDailyStreak(data, habitId) {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = formatDate(d);
    if (data[key] && data[key][habitId]) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

// 週次ストリーク（その週に1回以上達成で継続）
function getWeeklyStreak(data, habitId) {
  let streak = 0;
  const today = new Date();
  let weekStart = getWeekStart(today);

  for (let w = 0; w < 52; w++) {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    let doneThisWeek = false;
    const limit = weekEnd < today ? weekEnd : today;
    for (let d = new Date(weekStart); d <= limit; d.setDate(d.getDate() + 1)) {
      const key = formatDate(d);
      if (data[key] && data[key][habitId]) {
        doneThisWeek = true;
        break;
      }
    }

    if (doneThisWeek) {
      streak++;
      weekStart.setDate(weekStart.getDate() - 7);
    } else {
      break;
    }
  }
  return streak;
}

// 今週達成済みか
function isWeeklyDone(data, habitId) {
  const weekStart = getWeekStart(new Date());
  const today = new Date();
  for (let d = new Date(weekStart); d <= today; d.setDate(d.getDate() + 1)) {
    const key = formatDate(d);
    if (data[key] && data[key][habitId]) return true;
  }
  return false;
}

function renderHabits(data) {
  const grid = document.getElementById('habits-grid');
  const today = todayKey();
  grid.innerHTML = '';

  HABITS.forEach(habit => {
    const done = habit.weekly
      ? isWeeklyDone(data, habit.id)
      : !!(data[today] && data[today][habit.id]);

    const streak = habit.weekly
      ? getWeeklyStreak(data, habit.id)
      : getDailyStreak(data, habit.id);

    const streakLabel = streak > 0
      ? `🔥 ${streak}${habit.weekly ? '週' : '日'}連続`
      : '記録なし';

    const checkLabel = done
      ? `✓ ${habit.weekly ? '今週達成' : '完了'}`
      : habit.weekly ? 'タップして記録（週1回）' : 'タップして記録';

    const card = document.createElement('div');
    card.className = 'habit-card' + (done ? ' done' : '');
    card.innerHTML = `
      <div class="emoji">${habit.emoji}</div>
      <div class="name">${habit.name}</div>
      <div class="streak">${streakLabel}</div>
      <div class="check-label">${checkLabel}</div>
    `;
    card.addEventListener('click', () => {
      const d = loadData();
      if (!d[today]) d[today] = {};
      d[today][habit.id] = !d[today][habit.id];
      saveData(d);
      renderHabits(d);
      renderHistory(d);
    });
    grid.appendChild(card);
  });
}

function getLast7Days() {
  const days = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = formatDate(d);
    const label = `${d.getMonth() + 1}/${d.getDate()}`;
    days.push({ key, label, isToday: i === 0 });
  }
  return days;
}

function renderHistory(data) {
  const days = getLast7Days();
  const header = document.getElementById('history-header');
  const body = document.getElementById('history-body');

  header.innerHTML = '<th>習慣</th>';
  days.forEach(day => {
    const th = document.createElement('th');
    th.textContent = day.label;
    if (day.isToday) th.classList.add('today-col');
    header.appendChild(th);
  });

  body.innerHTML = '';
  HABITS.forEach(habit => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${habit.emoji} ${habit.name}</td>`;
    days.forEach(day => {
      const td = document.createElement('td');
      if (day.isToday) td.classList.add('today-col');
      const done = data[day.key] && data[day.key][habit.id];
      td.innerHTML = done
        ? '<span class="mark-done">✓</span>'
        : '<span class="mark-empty">–</span>';
      tr.appendChild(td);
    });
    body.appendChild(tr);
  });
}

function renderDate() {
  const now = new Date();
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  document.getElementById('today-date').textContent =
    `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日（${weekdays[now.getDay()]}）`;
}

function init() {
  renderDate();
  const data = loadData();
  renderHabits(data);
  renderHistory(data);
}

init();
