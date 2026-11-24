import test from 'node:test';
import assert from 'node:assert/strict';
import { stationSlug, parseSearchResults, normalizeStationInfo, getSongKey, computeStats, groupByHour, groupByDay, buildCsv, safeImport, filterSongs, findTopArtists, shortRelativeTime, normalizeSong, normalizeHistory, normalizeListeners, aggregateStations, getStreamURL } from '../src/data.js';
const plays = [
  { artist:'Luna',title:'Song A',startedAt:'2026-11-24T08:00:00Z'},
  { artist:'Luna',title:'Song A',startedAt:'2026-11-24T09:00:00Z'},
  { artist:'Sol',title:'Song B',startedAt:'2026-11-24T10:00:00Z'},
];
test('validated station slug preserves underscores, normalizes case and rejects dangerous values',()=>{
 assert.equal(stationSlug('  LionFM  '),'lionfm');assert.equal(stationSlug('0-24_80er_pop_rock'),'0-24_80er_pop_rock');
 assert.throws(()=>stationSlug('../script'));assert.throws(()=>stationSlug('https://bad.site'));
});
test('station directory parses grouped API results without relying on first category',()=>{
 const obj={results:[{items:[{station:{name:'lionfm',display_name:'LionFM',stream_url:'https://lionfm.stream.laut.fm/lionfm',genres:['Pop']}},{station:{name:'lofi',display_name:'Lofi'}}]},{items:[{station:{name:'lionfm'}}]}]};
 const list=parseSearchResults(obj);assert.equal(list.length,2);assert.equal(list[0].name,'lionfm');assert.equal(list[0].displayName,'LionFM');
});
test('normalization understands laut.fm song timestamps with timezone offsets and end time',()=>{
 const s=normalizeSong({title:'A',artist:{name:'B'},started_at:'2026-11-24 21:01:30 +0100',ends_at:'2026-11-24 21:05:00 +0100'});
 assert.equal(s.startedAt,'2026-11-24T20:01:30.000Z');assert.equal(s.endsAt,'2026-11-24T20:05:00.000Z');
});
test('station metadata uses provider stream and rejects unknown URL protocols',()=>{
 const station=normalizeStationInfo({name:'LionFM',display_name:'LionFM',stream_url:'https://lionfm.stream.laut.fm/lionfm',genres:['Pop','Dance']});
 assert.equal(station.name,'lionfm');assert.equal(getStreamURL(station),'https://lionfm.stream.laut.fm/lionfm');
 assert.equal(getStreamURL({...station,streamUrl:'javascript:alert(1)'}),null);
});
test('dedup songs and compute true time-window local stats',()=>{
 const s=computeStats([...plays,plays[0]],'today',new Date('2026-11-24T14:00:00Z'));
 assert.equal(s.spins,3);assert.equal(s.uniqueSongs,2);assert.equal(s.uniqueArtists,2);assert.equal(s.topSong.count,2);
});
test('hourly and daily chart bins sum to observed songs',()=>{
 assert.equal(groupByHour(plays,'today',new Date('2026-11-24T14:00:00Z')).reduce((a,b)=>a+b.value,0),3);
 assert.equal(groupByDay(plays,new Date('2026-11-24T14:00:00Z')).reduce((a,b)=>a+b.value,0),3);
});
test('CSV export guards against formula injection and quotes',()=>{
 const text=buildCsv([{artist:'=2+2',title:'Hello, "world"',startedAt:'2026-11-24T10:00:00Z'}]);
 assert.match(text,/"'=2\+2"/);assert.match(text,/"Hello, ""world"""/);assert.match(text,/Interpret/);
});
test('imports user data defensively and ignores malformed records',()=>{
 const imported=safeImport(JSON.stringify({plays:[plays[0],{},null,{artist:'N',title:'Y',startedAt:'bad'}]}));assert.equal(imported.length,1);
 assert.throws(()=>safeImport('not JSON'));assert.throws(()=>safeImport('{"plays":"bad"}'));
});
test('search filters songs across title and artist with localized matching',()=>{
 assert.equal(filterSongs(plays,'song b').length,1);assert.equal(filterSongs(plays,'LUNA').length,2);
});
test('top artists group by name and sort by observed spins',()=>{
 const artists=findTopArtists(plays);assert.equal(artists[0].artist,'Luna');assert.equal(artists[0].count,2);
});
test('relative time correctly distinguishes recent and future timestamps',()=>{
 assert.equal(shortRelativeTime('2026-11-24T13:59:00Z',new Date('2026-11-24T14:00:00Z')),'vor 1 Min.');
 assert.equal(shortRelativeTime('bad',new Date()),'–');
});
test('compare stations never conflates listener snapshots with measured audience reach',()=>{
 const rows=aggregateStations({'lionfm':plays,'lofi':[plays[0]]},[{name:'lionfm',count:8,time:'2026-11-24T14:00:00Z'}],new Date('2026-11-24T14:00:00Z'));
 assert.equal(rows[0].spins,3);assert.equal(rows[0].listeners,8);assert.equal(rows[1].listeners,null);
});
