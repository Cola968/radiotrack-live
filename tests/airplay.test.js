import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeSong, normalizeHistory, countAirplays, normalizeListeners, uniqueAirplays } from '../src/data.js';

test('normalizeSong extracts artist, title, ISO timestamp, artwork optional', () => {
  const song = normalizeSong({artist:{name:'The Artist'}, title:'The Track', started_at:'2026-11-23T18:00:00Z'});
  assert.equal(song.artist,'The Artist');
  assert.equal(song.title,'The Track');
  assert.equal(song.startedAt,'2026-11-23T18:00:00.000Z');
});
test('normalizeSong handles absent and broken API values safely', () => {
  assert.equal(normalizeSong(null), null);
  assert.equal(normalizeSong({title:'Advertisement'}), null);
  assert.equal(normalizeSong({artist:'Example',title:'Sample'}).artist,'Example');
});
test('normalizeHistory supports API array and nested result object', () => {
  assert.equal(normalizeHistory([{artist:{name:'A'},title:'X'}]).length,1);
  assert.equal(normalizeHistory({songs:[{artist:{name:'A'},title:'X'}]}).length,1);
});
test('uniqueAirplays avoids double-counts by timestamp and title', () => {
  const s={artist:'A',title:'X',startedAt:'2026-11-23T12:00:00Z'};
  assert.equal(uniqueAirplays([s,s,{...s,startedAt:'2026-11-23T12:05:00Z'}]).length,2);
});
test('countAirplays selects timezone-local day and rolling seven days', () => {
  const songs=[
    {artist:'A',title:'X',startedAt:'2026-11-23T09:00:00Z'},
    {artist:'A',title:'X',startedAt:'2026-11-22T09:00:00Z'},
    {artist:'B',title:'Y',startedAt:'2026-11-12T09:00:00Z'}
  ];
  const today=countAirplays(songs,'today',new Date('2026-11-23T16:00:00Z'),'Europe/Berlin');
  const week=countAirplays(songs,'week',new Date('2026-11-23T16:00:00Z'),'Europe/Berlin');
  assert.equal(today[0].count,1);
  assert.equal(week[0].count,2);
  assert.equal(week.length,1);
});
test('normalizeListeners handles raw numeric and listener object variants',()=>{
  assert.equal(normalizeListeners(42),42);
  assert.equal(normalizeListeners({listeners:37}),37);
  assert.equal(normalizeListeners({current_listeners:19}),19);
  assert.equal(normalizeListeners({foo:99}),null);
});
