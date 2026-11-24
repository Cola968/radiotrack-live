import test from 'node:test';
import assert from 'node:assert/strict';
import { uniqueAirplays, buildCsv, aggregateRadar, listenerTimeline, summarizeCoverage } from '../src/data.js';
const NOW=new Date('2026-11-24T20:00:00.000Z');
const same={title:'Flowers in the Hurricane',artist:'Example Artist',startedAt:'2026-11-24T18:00:00.000Z'};

test('A simultaneous spin on two stations must count as two distinct transmissions',()=>{
  const rows=uniqueAirplays([{...same,station:'lionfm'},{...same,station:'lofi'},{...same,station:'lionfm'}]);
  assert.equal(rows.length,2);
  assert.equal(buildCsv(rows).split('\r\n').length,3);
});

test('Radar searches across different stations but ignores duplicate observations',()=>{
  const data={lionfm:[same,same,{...same,title:'Different'}],lofi:[same]};
  const found=aggregateRadar(data,'hurricane','today',NOW);
  assert.equal(found.length,1);
  assert.equal(found[0].totalSpins,2);
  assert.equal(found[0].stations.length,2);
  assert.equal(found[0].stations.find(s=>s.name==='lionfm').spins,1);
  assert.equal(aggregateRadar(data,'hurricáné','week',NOW).length,0);
  assert.equal(aggregateRadar(data,'unknown','week',NOW).length,0);
});

test('Radar filters past timestamps and past-week vs today correctly',()=>{
  const old={...same,startedAt:'2026-11-15T18:00:00.000Z'};
  const future={...same,startedAt:'2026-11-27T18:00:00.000Z'};
  assert.equal(aggregateRadar({a:[same,old,future]},'','week',NOW)[0].totalSpins,1);
});

test('Listener timeline rejects invalid and stale samples and calculates time-window range',()=>{
  const series=listenerTimeline([
   {name:'lionfm',count:10,time:'2026-11-24T15:00:00.000Z'},
   {name:'lofi',count:300,time:'2026-11-24T16:00:00.000Z'},
   {name:'lionfm',count:6,time:'2026-11-24T19:00:00.000Z'},
   {name:'lionfm',count:-1,time:'2026-11-24T19:30:00.000Z'},
   {name:'lionfm',count:7,time:'2026-11-25T19:00:00.000Z'},
  ],'lionfm','today',NOW);
  assert.equal(series.samples.length,2);
  assert.equal(series.minimum,6);
  assert.equal(series.maximum,10);
  assert.equal(series.average,8);
  assert.equal(series.samples[0].count,10);
});

test('Coverage reports only hours with observed starts, not true monitoring uptime',()=>{
  const c=summarizeCoverage([same,{...same,title:'Again',startedAt:'2026-11-24T18:20:00.000Z'},{...same,title:'Earlier',startedAt:'2026-11-24T12:00:00.000Z'}],'today',NOW);
  assert.equal(c.spins,3);
  assert.equal(c.observedHours,2);
  assert.equal(c.first,'2026-11-24T12:00:00.000Z');
  assert.equal(c.last,'2026-11-24T18:20:00.000Z');
});
