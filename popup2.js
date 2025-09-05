function pad(n) {
  return n.toString().padStart(2, '0');
}
function load() {
  chrome.storage.sync.get(['birthday', 'headingText', 'showQuotes'], (res) => {
    if (res.birthday) {
      const d = new Date(res.birthday);
      document.getElementById('date').value =
        d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
      document.getElementById('time').value =
        pad(d.getHours()) +
        ':' +
        pad(d.getMinutes()) +
        ':' +
        pad(d.getSeconds());
    }
    document.getElementById('headingText').value =
      res.headingText || 'Time Alive';
    // document.getElementById('bgMode').value = res.bgMode || 'starfield';
    document.getElementById('quotes').checked = res.showQuotes ?? true;
  });
}
function save() {
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value || '00:00:00';
  const heading = document.getElementById('headingText').value || 'Time Alive';
  const showQuotes = document.getElementById('quotes').checked;
  // const bgMode = document.getElementById('bgMode').value || 'starfield';
  if (date) {
    const d = new Date(date + 'T' + time);
    if (isNaN(d.getTime())) {
      alert('Invalid date/time');
      return;
    }
    chrome.storage.sync.set(
      { birthday: d.toString(), headingText: heading, showQuotes },
      () => {
        window.close();
      }
    );
  } else {
    chrome.storage.sync.set({ headingText: heading, showQuotes }, () => {
      window.close();
    });
  }
}
function clearAll() {
  if (confirm('Reset all LifeClock settings?')) {
    chrome.storage.sync.remove(
      ['birthday', 'headingText', 'showQuotes'],
      () => {
        window.close();
      }
    );
  }
}
document.addEventListener('DOMContentLoaded', () => {
  load();
  document.getElementById('save').addEventListener('click', save);
  document.getElementById('clear').addEventListener('click', clearAll);
});
