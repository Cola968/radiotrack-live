/** RadioTrack data layer — no fabricated spins, reach, or listeners. */
export const API_ROOT='https://api.laut.fm';
const TZ='Europe/Berlin';
const fmtDay=new Intl.DateTimeFormat('en-CA',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit'});
const fmtHour=new Intl.DateTimeFormat('en-US',{timeZone:TZ,hour:'2-digit',hourCycle:'h23'});
export function stationSlug(s){const v=String(s??'').trim().toLowerCase();if(!/^[a-z0-9][a-z0-9_-]{0,69}$/.test(v))throw new Error('Sendername ungültig. Bitte nur Buchstaben, Zahlen, Unterstriche und Bindestriche verwenden.');return v;}
export function safeURL(s){try{let u=new URL(s);return u.protocol==='https:'||u.protocol==='http:'?u.toString():null}catch{return null}}
export function normalizeStationInfo(d){if(!d||typeof d!=='object')return null;let name;try{name=stationSlug(d.name)}catch{return null}return {name,displayName:String(d.display_name||d.displayName||d.name),genres:Array.isArray(d.genres)?d.genres.slice(0,6).map(String):[],description:String(d.description||d.format||''),location:String(d.location||''),streamUrl:safeURL(d.stream_url||d.streamUrl),imageUrl:safeURL(d.images?.station_320x320||d.images?.station_120x120||d.image_url||d.imageUrl),active:d.active!==false,homepage:safeURL(d.page_url||`https://laut.fm/${name}`)};}
export function getStreamURL(station){return safeURL(station?.streamUrl)||null;}
export function parseSearchResults(input){const bags=Array.isArray(input)?input:Array.isArray(input?.results)?input.results:[];const items=[];for(const bag of bags){if(bag?.station)items.push(bag.station);else if(bag?.name)items.push(bag);else if(Array.isArray(bag?.items))for(const item of bag.items)items.push(item?.station||item);}const seen=new Set();return items.map(normalizeStationInfo).filter(x=>{if(!x||seen.has(x.name))return false;seen.add(x.name);return true}).slice(0,30);}
export function parseApiDate(s){if(!s)return null;const value=String(s).replace(/^(\d{4}-\d\d-\d\d) (\d\d:\d\d:\d\d) ([+-]\d\d)(\d\d)$/,'$1T$2$3:$4');const n=Date.parse(value);return Number.isFinite(n)?new Date(n).toISOString():null;}
export function normalizeSong(raw){if(!raw||typeof raw!=='object')return null;const title=typeof raw.title==='string'?raw.title.trim():'';const artist=typeof raw.artist==='string'?raw.artist.trim():typeof raw.artist?.name==='string'?raw.artist.name.trim():'';if(!title||!artist)return null;return {title,artist,startedAt:parseApiDate(raw.started_at||raw.startedAt||raw.played_at||raw.playedAt),endsAt:parseApiDate(raw.ends_at||raw.endsAt),duration:Number.isFinite(raw.length)?raw.length:null};}
export function normalizeHistory(obj){const items=Array.isArray(obj)?obj:Array.isArray(obj?.songs)?obj.songs:Array.isArray(obj?.last_songs)?obj.last_songs:[];return items.map(x=>normalizeSong(x?.song?{...x.song,started_at:x.started_at||x.song.started_at,ends_at:x.ends_at||x.song.ends_at}:x)).filter(Boolean).sort((a,b)=>(b.startedAt||'').localeCompare(a.startedAt||''));}
export function normalizeListeners(x){if(Number.isInteger(x)&&x>=0)return x;if(!x||typeof x!=='object')return null;for(const k of ['listeners','current_listeners','listener_count','count'])if(Number.isInteger(x[k])&&x[k]>=0)return x[k];return null;}
export function getSongKey(s){return `${String(s.artist||'').trim().toLocaleLowerCase()}\u0000${String(s.title||'').trim().toLocaleLowerCase()}`;}
export function uniqueAirplays(songs){const seen=new Set();return (Array.isArray(songs)?songs:[]).filter(s=>{if(!s||!s.title||!s.artist||!parseApiDate(s.startedAt))return false;const key=getSongKey(s)+'\u0000'+parseApiDate(s.startedAt)+'\u0000'+String(s.station||'').trim().toLocaleLowerCase();if(seen.has(key))return false;seen.add(key);return true}).sort((a,b)=>b.startedAt.localeCompare(a.startedAt));}
export function filterPeriod(songs,period='today',now=new Date()){const current=now.getTime(),day=fmtDay.format(now);let ms=period==='week'?7*86400000:period==='month'?30*86400000:null;return uniqueAirplays(songs).filter(s=>{const ts=Date.parse(s.startedAt);if(!Number.isFinite(ts)||ts>current+60000)return false;return ms===null?fmtDay.format(new Date(ts))===day:ts>=current-ms;});}
export function countAirplays(songs,period='today',now=new Date(),timeZone=TZ){const filtered=period==='today'&&timeZone!==TZ?uniqueAirplays(songs).filter(s=>new Intl.DateTimeFormat('en-CA',{timeZone,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(s.startedAt))===new Intl.DateTimeFormat('en-CA',{timeZone,year:'numeric',month:'2-digit',day:'2-digit'}).format(now)):filterPeriod(songs,period,now);const byKey=new Map();for(const s of filtered){const k=getSongKey(s);const row=byKey.get(k)||{title:s.title,artist:s.artist,count:0,lastAt:s.startedAt};row.count++;if(s.startedAt>row.lastAt)row.lastAt=s.startedAt;byKey.set(k,row);}return [...byKey.values()].sort((a,b)=>b.count-a.count||a.title.localeCompare(b.title,'de'));}
export function findTopArtists(songs,period=null,now=new Date()){const rows=new Map();for(const s of period?filterPeriod(songs,period,now):uniqueAirplays(songs)){const k=s.artist.toLocaleLowerCase();const row=rows.get(k)||{artist:s.artist,count:0};row.count++;rows.set(k,row)}return [...rows.values()].sort((a,b)=>b.count-a.count||a.artist.localeCompare(b.artist,'de'));}
export function computeStats(songs,period='today',now=new Date()){const sample=filterPeriod(songs,period,now);const ranking=countAirplays(sample,period,now);const artists=findTopArtists(sample);return {spins:sample.length,uniqueSongs:new Set(sample.map(getSongKey)).size,uniqueArtists:artists.length,topSong:ranking[0]||null,topArtist:artists[0]||null,ranking,artists};}
export function groupByHour(songs,period='today',now=new Date()){const bins=Array.from({length:24},(_,h)=>({label:String(h).padStart(2,'0')+':00',value:0}));for(const s of filterPeriod(songs,period,now)){let h=Number(fmtHour.format(new Date(s.startedAt)));if(h>=0&&h<24)bins[h].value++}return bins;}
export function groupByDay(songs,now=new Date()){const keys=Array.from({length:7},(_,i)=>fmtDay.format(new Date(now.getTime()-(6-i)*86400000)));const counts=new Map(keys.map(k=>[k,0]));for(const s of filterPeriod(songs,'week',now)){const k=fmtDay.format(new Date(s.startedAt));if(counts.has(k))counts.set(k,counts.get(k)+1);}return keys.map(k=>({label:k.slice(5),date:k,value:counts.get(k)}));}
export function filterSongs(songs,q){const v=String(q||'').trim().toLocaleLowerCase();if(!v)return [...songs];return songs.filter(s=>(s.artist+' '+s.title).toLocaleLowerCase().includes(v));}
export function safeImport(text){let data;try{data=JSON.parse(text)}catch{throw new Error('Die Datei ist kein gültiges JSON.')}if(!Array.isArray(data?.plays))throw new Error('Die Datei enthält keine gültige RadioTrack-Songliste.');return uniqueAirplays(data.plays.map(x=>{const song=normalizeSong(x);return song?{...song,station:typeof x?.station==='string'?x.station:undefined}:null}).filter(Boolean));}
function csvCell(s){let v=String(s??'');if(/^[=+@\-\t\r]/.test(v))v="'"+v;return `"${v.replace(/"/g,'""')}"`}
export function buildCsv(songs){return '\uFEFF'+[['Zeit (ISO)','Interpret','Titel','Sender'].map(csvCell).join(';'),...uniqueAirplays(songs).map(s=>[s.startedAt,s.artist,s.title,s.station||''].map(csvCell).join(';'))].join('\r\n');}
export function shortRelativeTime(s,now=new Date()){const n=Date.parse(s);if(!Number.isFinite(n))return '–';const delta=Math.floor((now.getTime()-n)/60000);if(delta<0)return 'gleich';if(delta<1)return 'gerade eben';if(delta<60)return `vor ${delta} Min.`;if(delta<1440)return `vor ${Math.floor(delta/60)} Std.`;return `vor ${Math.floor(delta/1440)} Tg.`;}
export function aggregateStations(datasets,snapshots=[],now=new Date()){return Object.entries(datasets||{}).map(([name,plays])=>{const last=snapshots.filter(x=>x.name===name).sort((a,b)=>b.time.localeCompare(a.time))[0];return {name,spins:filterPeriod(plays,'week',now).length,unique:new Set(filterPeriod(plays,'week',now).map(getSongKey)).size,listeners:last?.count??null,asOf:last?.time||null};}).sort((a,b)=>b.spins-a.spins);}

/** Senderübergreifende, belegte Songstarts. Ein leerer Suchtext zeigt die Top-Songs. */
export function aggregateRadar(datasets,query='',period='week',now=new Date()){
  const q=String(query||'').trim().toLocaleLowerCase();
  const grouped=new Map();
  for(const [station,plays] of Object.entries(datasets||{})){
    let slug;try{slug=stationSlug(station)}catch{continue}
    const cleaned=filterPeriod((Array.isArray(plays)?plays:[]).map(x=>({...x,station:slug})),period,now);
    for(const song of cleaned){
      if(q&&!(song.artist+' '+song.title).toLocaleLowerCase().includes(q))continue;
      const key=getSongKey(song);
      const row=grouped.get(key)||{title:song.title,artist:song.artist,totalSpins:0,lastAt:song.startedAt,stations:[]};
      row.totalSpins++;
      if(song.startedAt>row.lastAt)row.lastAt=song.startedAt;
      let entry=row.stations.find(x=>x.name===slug);
      if(!entry){entry={name:slug,spins:0,lastAt:song.startedAt};row.stations.push(entry)}
      entry.spins++;
      if(song.startedAt>entry.lastAt)entry.lastAt=song.startedAt;
      grouped.set(key,row);
    }
  }
  return [...grouped.values()].map(x=>({...x,stations:x.stations.sort((a,b)=>b.spins-a.spins||a.name.localeCompare(b.name))}))
    .sort((a,b)=>b.totalSpins-a.totalSpins||b.stations.length-a.stations.length||b.lastAt.localeCompare(a.lastAt));
}
/** Stützpunkte, keine kontinuierlich gemessene Hörerschaft. */
export function listenerTimeline(snapshots,station,period='today',now=new Date()){
  const data=Array.isArray(snapshots)?snapshots:[];
  const nowMs=now.getTime();
  const samples=data.filter(x=>x?.name===station&&Number.isInteger(x.count)&&x.count>=0&&Number.isFinite(Date.parse(x.time))&&Date.parse(x.time)<=nowMs)
    .filter(x=>period==='today'?fmtDay.format(new Date(x.time))===fmtDay.format(now):Date.parse(x.time)>=nowMs-(period==='month'?30:7)*86400000)
    .sort((a,b)=>a.time.localeCompare(b.time)).map(x=>({time:x.time,count:x.count}));
  return {samples,minimum:samples.length?Math.min(...samples.map(x=>x.count)):null,maximum:samples.length?Math.max(...samples.map(x=>x.count)):null,average:samples.length?Math.round(samples.reduce((a,b)=>a+b.count,0)/samples.length):null};
}
/** Stunden mit mindestens einem bekannten Songstart sind KEINE Uptime-Messung. */
export function summarizeCoverage(songs,period='today',now=new Date()){
  const valid=filterPeriod(songs,period,now);
  const times=valid.map(x=>x.startedAt).sort();
  const hours=new Set(valid.map(x=>fmtDay.format(new Date(x.startedAt))+'-'+fmtHour.format(new Date(x.startedAt))));
  return {spins:valid.length,observedHours:hours.size,first:times[0]||null,last:times.at(-1)||null};
}
async function request(path,fetchImpl,signal){const controller=new AbortController();const tm=setTimeout(()=>controller.abort(),12500);if(signal)signal.addEventListener('abort',()=>controller.abort(),{once:true});try{const r=await fetchImpl(`${API_ROOT}${path}`,{headers:{Accept:'application/json'},signal:controller.signal,cache:'no-store'});if(!r.ok)throw new Error('HTTP '+r.status);return await r.json();}finally{clearTimeout(tm);}}
export async function fetchStation(name,fetchImpl=fetch,signal){const s=stationSlug(name);const paths=[`/station/${s}`,`/station/${s}/current_song`,`/station/${s}/last_songs`,`/station/${s}/listeners`];const res=await Promise.allSettled(paths.map(p=>request(p,fetchImpl,signal)));if(res.every(x=>x.status==='rejected'))throw new Error('Der Sender antwortet nicht. Namen oder Internetverbindung prüfen.');const info=res[0].status==='fulfilled'?normalizeStationInfo(res[0].value):normalizeStationInfo({name:s});return {info,current:res[1].status==='fulfilled'?normalizeSong(res[1].value):null,history:res[2].status==='fulfilled'?normalizeHistory(res[2].value):[],listeners:res[3].status==='fulfilled'?normalizeListeners(res[3].value):null,errors:paths.filter((_,i)=>res[i].status==='rejected').map((p)=>p.split('/').pop())};}
export async function searchStations(query,fetchImpl=fetch,signal){const q=String(query||'').trim();if(q.length<2)return [];const payload=await request(`/search/stations?query=${encodeURIComponent(q)}&limit=10`,fetchImpl,signal);return parseSearchResults(payload);}
