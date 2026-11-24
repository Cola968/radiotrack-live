export function normalizeSong(input) {
  if (!input || typeof input !== 'object') return null;
  const title = typeof input.title === 'string' ? input.title.trim() : '';
  const artist = typeof input.artist === 'string' ? input.artist.trim() : typeof input.artist?.name === 'string' ? input.artist.name.trim() : '';
  if (!title || !artist) return null;
  const value = input.started_at || input.startedAt || input.played_at || input.playedAt || null;
  return {
    title,
    artist,
    startedAt: typeof value === 'string' && !Number.isNaN(Date.parse(value)) ? new Date(value).toISOString() : null,
    cover: typeof input.album?.cover === 'string' ? input.album.cover : null,
  };
}
export function normalizeHistory(value) {
  const list = Array.isArray(value) ? value : Array.isArray(value?.songs) ? value.songs : Array.isArray(value?.last_songs) ? value.last_songs : [];
  return list.map(item => normalizeSong(item?.song || item)).filter(Boolean);
}
export function normalizeListeners(value) {
  if (Number.isInteger(value) && value >= 0) return value;
  if (!value || typeof value !== 'object') return null;
  for (const key of ['listeners', 'current_listeners', 'listener_count', 'count']) {
    if (Number.isInteger(value[key]) && value[key] >= 0) return value[key];
  }
  return null;
}
export function uniqueAirplays(songs) {
  const seen = new Set();
  return songs.filter(song => {
    if (!song?.startedAt || !song.artist || !song.title) return false;
    const key = [song.artist.trim().toLocaleLowerCase(),song.title.trim().toLocaleLowerCase(),song.startedAt].join('|');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
export function countAirplays(songs, period='today', now=new Date(), timeZone='Europe/Berlin') {
  const day = new Intl.DateTimeFormat('en-CA', {timeZone,year:'numeric',month:'2-digit',day:'2-digit'});
  const today = day.format(now);
  const lower = now.getTime() - 7*86400000;
  const grouped = new Map();
  for (const song of uniqueAirplays(songs)) {
    const ts = new Date(song.startedAt).getTime();
    if (!Number.isFinite(ts) || ts > now.getTime() + 60000) continue;
    if (period === 'today' ? day.format(new Date(ts)) !== today : ts < lower) continue;
    const key = `${song.artist.toLocaleLowerCase()}\u0000${song.title.toLocaleLowerCase()}`;
    const row = grouped.get(key) || {artist:song.artist,title:song.title,count:0,lastAt:song.startedAt};
    row.count++;
    if (song.startedAt > row.lastAt) row.lastAt = song.startedAt;
    grouped.set(key,row);
  }
  return [...grouped.values()].sort((a,b)=>b.count-a.count || a.title.localeCompare(b.title));
}
export async function fetchStation(name, fetchImpl=fetch) {
  const slug = encodeURIComponent(name.toLowerCase().trim());
  if (!slug || !/^[a-z0-9._%-]+$/.test(slug)) throw new Error('Bitte einen gültigen laut.fm-Sendernamen eingeben.');
  const base = `https://api.laut.fm/station/${slug}`;
  const paths = ['current_song','last_songs','listeners'];
  const results = await Promise.allSettled(paths.map(async p => {
    const r = await fetchImpl(`${base}/${p}`, {headers:{Accept:'application/json'}});
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.json();
  }));
  if(results.every(x=>x.status==='rejected')) throw new Error('Senderdaten derzeit nicht verfügbar. Sendernamen und Verbindung prüfen.');
  return {
    current:results[0].status==='fulfilled'?normalizeSong(results[0].value):null,
    history:results[1].status==='fulfilled'?normalizeHistory(results[1].value):[],
    listeners:results[2].status==='fulfilled'?normalizeListeners(results[2].value):null,
    errors:paths.filter((_,i)=>results[i].status==='rejected')
  };
}
