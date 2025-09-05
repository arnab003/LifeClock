function diffCalendar(from, to) {
  if (to < from) [from, to] = [to, from];
  let cursor = new Date(from.getTime());
  let years = to.getFullYear() - cursor.getFullYear();
  let test = new Date(cursor);
  test.setFullYear(cursor.getFullYear() + years);
  if (test > to) years--;
  cursor.setFullYear(cursor.getFullYear() + years);
  let months = to.getMonth() - cursor.getMonth();
  if (months < 0) months += 12;
  test = new Date(cursor);
  test.setMonth(cursor.getMonth() + months);
  if (test > to) months--;
  cursor.setMonth(cursor.getMonth() + months);
  let ms = to - cursor;
  const DAY = 24 * 3600 * 1000,
    HOUR = 3600 * 1000,
    MIN = 60000,
    SEC = 1000;
  let days = Math.floor(ms / DAY);
  ms -= days * DAY;
  let hours = Math.floor(ms / HOUR);
  ms -= hours * HOUR;
  let minutes = Math.floor(ms / MIN);
  ms -= minutes * MIN;
  let seconds = Math.floor(ms / SEC);
  return { years, months, days, hours, minutes, seconds };
}

function createUnit(value, label) {
  const unit = document.createElement('div');
  unit.className = 'unit';
  const num = document.createElement('div');
  num.className = 'num';
  num.textContent = value.toString().padStart(2, '0');
  const lbl = document.createElement('div');
  lbl.className = 'label';
  lbl.textContent = label;
  unit.appendChild(num);
  unit.appendChild(lbl);
  return unit;
}

function buildGridIfEmpty(container, parts, labels) {
  if (container.children.length === 0) {
    container.innerHTML = '';
    for (let i = 0; i < parts.length; i++) {
      container.appendChild(createUnit(parts[i], labels[i]));
    }
    return true;
  }
  return false;
}

let birth = null,
  interval = null,
  lastParts = null;
function animateChanges(container, newParts) {
  const nums = container.querySelectorAll('.num');
  newParts.forEach((val, idx) => {
    const el = nums[idx];
    const text = val.toString().padStart(2, '0');
    if (el.textContent !== text) {
      // create flip effect: clone for smoothness
      el.classList.add('flip');
      setTimeout(() => {
        el.textContent = text;
        el.classList.remove('flip');
      }, 220);
      // neon pulse: temporary box-shadow/glow
      const unit = el.parentElement;
      unit.style.boxShadow = '0 8px 30px rgba(0,240,255,0.14)';
      setTimeout(() => {
        unit.style.boxShadow = '';
      }, 500);
    }
  });
}

function updateDisplays() {
  if (!birth) return;
  const now = new Date();
  const a = diffCalendar(birth, now);
  const parts = [a.years, a.months, a.days, a.hours, a.minutes, a.seconds];
  const labels = ['Years', 'Months', 'Days', 'Hours', 'Minutes', 'Seconds'];
  const ageGrid = document.getElementById('ageGrid');
  const wasEmpty = buildGridIfEmpty(ageGrid, parts, labels);
  if (!wasEmpty) {
    animateChanges(ageGrid, parts);
  }
  // next
  const nb = new Date(birth);
  nb.setFullYear(now.getFullYear());
  if (nb <= now) nb.setFullYear(now.getFullYear() + 1);
  const u = diffCalendar(now, nb);
  const nextGrid = document.getElementById('nextGrid');
  buildGridIfEmpty(
    nextGrid,
    [u.months, u.days, u.hours],
    ['Months', 'Days', 'Hours']
  );
  // update nextGrid numeric changes simply by replacing text (no heavy animation)
  const ngNums = nextGrid.querySelectorAll('.num');
  [u.months, u.days, u.hours].forEach((v, i) => {
    if (ngNums[i] && ngNums[i].textContent !== v.toString().padStart(2, '0'))
      ngNums[i].textContent = v.toString().padStart(2, '0');
  });
  lastParts = parts.slice();
}

function startTicker() {
  if (interval) clearInterval(interval);
  updateDisplays();
  interval = setInterval(updateDisplays, 1000);
}

function loadSettings(cb) {
  chrome.storage.sync.get(['birthday', 'headingText', 'showQuotes'], (res) => {
    cb({
      birthday: res.birthday ? new Date(res.birthday) : null,
      headingText: res.headingText || 'Time Alive',
      showQuotes: res.showQuotes ?? true,
      // bgMode: res.bgMode || 'starfield',
    });
  });
}

function showRandomQuote(quotes) {
  if (quotes.length === 0) return;
  const randomIndex = Math.floor(Math.random() * quotes.length);
  document.getElementById('timeQuotes').textContent = quotes[randomIndex];
}

document.addEventListener('DOMContentLoaded', () => {
  loadSettings((s) => {
    birth = s.birthday;
    document.getElementById('heading').textContent =
      s.headingText || 'Time Alive';
    // post message to bg to set mode
    // try {
    //   window.postMessage({ type: 'life-set-mode', mode: s.bgMode }, '*');
    // } catch (e) {}
    if (birth) startTicker();

    if (s.showQuotes) {
      // Fetch the JSON file
      fetch('quotes.json')
        .then((response) => response.json())
        .then((data) => {
          showRandomQuote(data);
        })
        .catch((err) => {
          document.getElementById('timeQuotes').textContent =
            'Failed to load quotes.';
          console.error(err);
        });
    }

    // celebrate if today
    const now = new Date();
    if (
      birth &&
      birth.getDate() === now.getDate() &&
      birth.getMonth() === now.getMonth()
    ) {
      try {
        const script = document.createElement('script');
        script.src = 'confetti.js';
        document.body.appendChild(script);
        setTimeout(() => {
          burstConfetti();
        }, 1000);
      } catch (e) {}
    }
  });
});
