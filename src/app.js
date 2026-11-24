import { fetchStation, normalizeSong, uniqueAirplays, countAirplays } from './data.js';
const $ = id => document.getElementById(id);
const safe = str => String(str ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const time = value => value ? new Intl.DateTimeFormat('de-DE',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/Berlin'}).format(new Date(value)) : '—';
const model = {station:'laut-fm-station',period:'today',songs:[],history:[],current:null,listeners:null,updated:null,loading:false,loadingStation:null,requestId:0};
const storageKey = () => `radiotrack:plays:${model.station}`;
function readStorage() {try {const x=JSON.parse(localStorage.getItem(storageKey())||'[]');return Array.isArray(x)?x:[];}catch{return [];}}
function store() {try{const kept=uniqueAirplays(model.songs).filter(s=>new Date(s.startedAt).getTime()>Date.now()-8*86400000).slice(-1500);localStorage.setItem(storageKey(),JSON.stringify(kept));}catch{/* Browsers may block storage */}}
function remember(history,current) {
  model.songs = uniqueAirplays([...readStorage(),...history,current].filter(Boolean)).filter(s=>s.startedAt);
  store();
}
function render() {
  $('station-label').textContent = model.station;
  $('updated-at').textContent=model.updated?new Intl.DateTimeFormat('de-DE',{hour:'2-digit',minute:'2-digit'}).format(model.updated):'–';
  $('listener-value').textContent=model.listeners==null?'–':new Intl.NumberFormat('de-DE').format(model.listeners);
  $('listeners-caption').textContent=model.listeners==null?'Aktuelle Hörerzahl nicht verfügbar':'Gleichzeitige Stream-Verbindungen';
  $('song-count').textContent=new Intl.NumberFormat('de-DE').format(model.songs.length);
  $('unique-count').textContent=new Intl.NumberFormat('de-DE').format(new Set(model.songs.map(x=>x.artist.toLowerCase()+'|'+x.title.toLowerCase())).size);
  $('current-title').textContent=model.current?.title || 'Kein Titel verfügbar';
  $('current-artist').textContent=model.current?.artist || 'Sender liefert aktuell keinen Song';
  $('current-time').textContent=model.current?.startedAt?`Beginn um ${time(model.current.startedAt)} Uhr`:'Aktuelle Songzeit nicht verfügbar';
  const status=$('status');status.className='pill status-pill '+(model.loading?'':model.updated?'ready':'error');status.innerHTML=`<i></i>${model.loading?'Aktualisiere ...':model.updated?'Daten abgerufen':'Offline'}`;
  const ranking=countAirplays(model.songs,model.period);
  $('ranking').innerHTML=ranking.length ? ranking.slice(0,8).map((r,i)=>`<div class="chart-row"><span class="rank-number">${i+1}</span><div class="song-dot">♫</div><div class="chart-main"><div class="chart-title">${safe(r.title)}</div><div class="chart-artist">${safe(r.artist)}</div><div class="bar-track"><div class="bar-fill" style="width:${(r.count/ranking[0].count)*100}%"></div></div></div><span class="chart-count">${r.count}<small>× gespielt</small></span></div>`).join(''):'<div class="empty">In diesem Zeitraum liegen noch keine erfassten Titel mit Zeitstempel vor. Die Erfassung beginnt beim ersten Abruf.</div>';
  $('history-list').innerHTML=model.history.length ? model.history.slice(0,8).map(s=>`<div class="history-entry"><span class="history-mark">♫</span><div class="history-text"><strong>${safe(s.title)}</strong><small>${safe(s.artist)}</small></div><span class="history-time">${time(s.startedAt)}</span></div>`).join(''):'<div class="empty">Keine Playliste vom Sender verfügbar.</div>';
  document.querySelectorAll('.period').forEach(b=>b.classList.toggle('selected',b.dataset.period===model.period));
  document.querySelectorAll('.station-shortcut').forEach(b=>b.classList.toggle('selected',b.dataset.station===model.station));
}
async function load() {
  if(model.loading && model.loadingStation===model.station)return;
  const requestId=++model.requestId;
  const station=model.station;
  model.loading=true;model.loadingStation=station;render();$('error-box').hidden=true;
  try {
    const result=await fetchStation(station);
    if(requestId!==model.requestId)return;
    model.current=result.current;model.history=result.history;model.listeners=result.listeners;model.updated=new Date();
    remember(result.history,result.current);
    if(result.errors.length){$('error-box').hidden=false;$('error-box').textContent='Einzelne Daten konnten nicht geladen werden: '+result.errors.join(', ')+'. Andere Werte sind trotzdem verfügbar.';}
  } catch(e) {
    if(requestId!==model.requestId)return;
    model.updated=null;model.listeners=null;model.current=null;model.history=[];
    $('error-box').hidden=false;$('error-box').textContent=e.message;
  }finally {if(requestId===model.requestId){model.loading=false;model.loadingStation=null;render();}}
}
function chooseStation(name) {
  if (!name.trim())return;
  model.station=name.trim().toLowerCase();$('station-input').value=model.station;
  model.current=null;model.history=[];model.listeners=null;model.updated=null;model.songs=readStorage();render();load();
}
$('station-form').addEventListener('submit',e=>{e.preventDefault();chooseStation($('station-input').value);});
document.querySelectorAll('.station-shortcut').forEach(b=>b.addEventListener('click',()=>chooseStation(b.dataset.station)));
document.querySelectorAll('.period').forEach(b=>b.addEventListener('click',()=>{model.period=b.dataset.period;render();}));
model.songs=readStorage();render();load();setInterval(()=>{if(!document.hidden)load();},60000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)load();});
