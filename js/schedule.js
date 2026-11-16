/* Website schedule. Edit these seven entries to change public hours.
   This does not read or write Twitch Extension Configuration Service settings. */
(() => {
  'use strict';
  const eastern = 'America/New_York';
  const schedule = [
    { day: 'Monday', title: 'Current Cabinet', start: '16:00', end: '18:00' },
    { day: 'Tuesday', title: 'Arcade recharging', start: '', end: '' },
    { day: 'Wednesday', title: 'Arcade recharging', start: '', end: '' },
    { day: 'Thursday', title: 'Current Cabinet', start: '16:00', end: '18:00' },
    { day: 'Friday', title: 'Current Cabinet', start: '16:00', end: '18:00' },
    { day: 'Saturday', title: 'JRPG Weekend', start: '15:00', end: '17:00' },
    { day: 'Sunday', title: 'JRPG Weekend', start: '15:00', end: '17:00' }
  ];
  function parts(date, zone = eastern) {
    return Object.fromEntries(new Intl.DateTimeFormat('en-US', {
      timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
    }).formatToParts(date).filter(p => p.type !== 'literal').map(p => [p.type, Number(p.value)]));
  }
  // Calendar dates use UTC only as a neutral container. Stream times are Eastern.
  function monday(now = new Date()) {
    const p = parts(now), date = new Date(Date.UTC(p.year, p.month - 1, p.day));
    date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 6) % 7);
    return date;
  }
  function dayAt(base, offset) {
    const date = new Date(base);
    date.setUTCDate(date.getUTCDate() + offset);
    return date;
  }
  function atEastern(date, time) {
    const [hour, minute] = time.split(':').map(Number);
    const target = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), hour, minute);
    let guess = target;
    for (let i = 0; i < 3; i++) {
      const p = parts(new Date(guess));
      guess += target - Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
    }
    return new Date(guess);
  }
  function nextEvent(now = new Date(), entries = schedule) {
    const base = monday(now);
    for (let i = 0; i < 14; i++) {
      const item = entries[i % 7];
      if (!item.start) continue;
      const date = dayAt(base, i), start = atEastern(date, item.start), end = atEastern(date, item.end);
      if (end > now) return { ...item, start, end };
    }
    return null;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { schedule, parts, monday, dayAt, atEastern, nextEvent };
    return;
  }
  const $ = id => document.getElementById(id);
  let weekOffset = 0, zone = eastern, lastDay = '';
  function node(tag, className, text) {
    const el = document.createElement(tag);
    el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }
  function dateKey(date, timeZone = eastern) {
    const p = parts(date, timeZone);
    return `${p.year}-${p.month}-${p.day}`;
  }
  function formatTime(date) {
    return new Intl.DateTimeFormat('en-US', { timeZone: zone, hour: 'numeric', minute: '2-digit' }).format(date).replace(':00', '');
  }
  function render() {
    const base = dayAt(monday(), weekOffset * 7);
    const dateLabel = date => new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' }).format(date);
    $('weekRange').textContent = `${dateLabel(base)} – ${dateLabel(dayAt(base, 6))}`;
    $('scheduleGrid').replaceChildren();
    const now = new Date();
    schedule.forEach((item, i) => {
      const date = dayAt(base, i), active = !!item.start;
      const start = active ? atEastern(date, item.start) : null;
      const end = active ? atEastern(date, item.end) : null;
      // Local mode moves active events to their actual local start date.
      const displayed = active ? parts(start, zone) : { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
      const key = `${displayed.year}-${displayed.month}-${displayed.day}`;
      const today = key === dateKey(now, active ? zone : eastern);
      const card = node('article', `day-card${active ? '' : ' off'}${i > 4 ? ' weekend' : ''}${today ? ' today' : ''}`);
      const weekday = active ? new Intl.DateTimeFormat('en-US', { timeZone: zone, weekday: 'short' }).format(start) : item.day.slice(0, 3);
      const top = node('div', 'day-top');
      top.append(node('span', 'day-name', weekday.toUpperCase()), node('span', 'day-number', String(displayed.day).padStart(2, '0')));
      if (today) card.append(node('span', 'today-tag', 'TODAY'));
      card.append(top, node('h3', '', item.title));
      if (active) {
        let hours = `${formatTime(start)} – ${formatTime(end)}`;
        if (dateKey(start, zone) !== dateKey(end, zone)) hours += ' (+1 day)';
        card.append(node('p', '', hours));
        if (zone !== eastern) card.append(node('small', '', `${item.day.slice(0, 3)} in Eastern time`));
      } else card.append(node('p', '', 'Day off · recharge time'));
      $('scheduleGrid').append(card);
    });
    $('zoneNote').textContent = zone === eastern ? 'Eastern time · automatically follows EST / EDT' : `Your time zone: ${zone.replaceAll('_', ' ')} · off days refer to Eastern dates`;
    tick();
  }
  function tick() {
    const now = new Date(), event = nextEvent(now);
    if (!event) {
      $('nextLabel').textContent = 'ARCADE HOURS';
      $('nextTitle').textContent = 'New hours coming soon';
      $('nextDate').textContent = '';
      $('countdown').textContent = 'Stay awhile.';
      $('countdownLabel').textContent = 'No streams scheduled';
      return;
    }
    const active = event.start <= now;
    $('nextLabel').textContent = active ? 'SCHEDULED NOW · CHECK TWITCH' : 'NEXT SCHEDULED STREAM';
    $('nextTitle').textContent = event.title;
    $('nextDate').textContent = new Intl.DateTimeFormat('en-US', { timeZone: zone, weekday: 'short', month: 'short', day: 'numeric' }).format(event.start) + ' · ' + formatTime(event.start);
    const seconds = Math.max(0, Math.floor(((active ? event.end : event.start) - now) / 1000));
    const days = Math.floor(seconds / 86400), hours = Math.floor(seconds / 3600) % 24, minutes = Math.floor(seconds / 60) % 60;
    $('countdown').textContent = `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`;
    $('countdownLabel').textContent = active ? 'until scheduled end' : 'until the next cabinet';
  }
  $('previousWeek').addEventListener('click', () => { weekOffset--; render(); });
  $('nextWeek').addEventListener('click', () => { weekOffset++; render(); });
  $('thisWeek').addEventListener('click', () => { weekOffset = 0; render(); });
  $('timeZone').addEventListener('change', event => { zone = event.target.value === 'local' ? Intl.DateTimeFormat().resolvedOptions().timeZone : eastern; render(); });
  function refresh() {
    if (document.hidden) return;
    const key = dateKey(new Date());
    if (key !== lastDay) { lastDay = key; render(); } else tick();
  }
  render();
  setInterval(refresh, 1000);
  document.addEventListener('visibilitychange', refresh);
})();
