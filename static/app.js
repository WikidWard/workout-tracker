const KEY = "workoutTrackerDataV1";
let exerciseLibrary = [];

const starterProgramme = {
  id: crypto.randomUUID(),
  name: "Adrian 5 x 5",
  startDate: "2026-09-15",
  status: "current",
  days: [
    { id: crypto.randomUUID(), name: "Day 1", exercises: [
      {id:crypto.randomUUID(), name:"Dumbbell Chest Press", sets:5, reps:5, programWeight:20, note:""},
      {id:crypto.randomUUID(), name:"Dumbbell Incline Chest Press", sets:5, reps:5, programWeight:17.5, note:""},
      {id:crypto.randomUUID(), name:"Chest Supported Dumbbell Row", sets:5, reps:5, programWeight:22.5, note:""},
      {id:crypto.randomUUID(), name:"Close Grip Lat Pulldown", sets:5, reps:5, programWeight:40, note:""}
    ]},
    { id: crypto.randomUUID(), name: "Day 2", exercises: [
      {id:crypto.randomUUID(), name:"Dumbbell Bulgarians", sets:5, reps:5, programWeight:16, note:""},
      {id:crypto.randomUUID(), name:"Dumbbell Goblet Squats", sets:5, reps:5, programWeight:20, note:"Elevate heels"},
      {id:crypto.randomUUID(), name:"Dumbbell Shoulder Press", sets:5, reps:5, programWeight:12.5, note:""},
      {id:crypto.randomUUID(), name:"Dumbbell Upright Row", sets:5, reps:5, programWeight:12.5, note:"Wide grip"}
    ]}
  ]
};

let data = loadData();
let activeDayId = data.programmes.find(p=>p.status==="current")?.days[0]?.id;
let draftWorkout = {};

function loadData() {
  const raw = localStorage.getItem(KEY);
  if (raw) {
    const parsed = JSON.parse(raw);
    // Keep compatibility with the first prototype.
    parsed.progression ||= {};
    parsed.sessions ||= [];
    parsed.programmes ||= [];
    return parsed;
  }
  return {programmes:[starterProgramme], sessions:[], progression:{}};
}
function saveData(){ localStorage.setItem(KEY, JSON.stringify(data)); }
function currentProgramme(){ return data.programmes.find(p=>p.status==="current") || data.programmes[0]; }
function currentDay(){ return currentProgramme()?.days.find(d=>d.id===activeDayId) || currentProgramme()?.days[0]; }
function today(){ return new Date().toISOString().slice(0,10); }
function formatDate(s){ return new Date(s+"T12:00:00").toLocaleDateString("en-AU",{day:"numeric",month:"short",year:"numeric"}); }

// The last completed workout is the source for both the previous weight and
// the progression instruction. The progression is applied ONCE to that weight
// when preparing the next workout; it is never applied to today's actual weight.
function previousExerciseRecord(exerciseName){
  const matches = data.sessions
    .flatMap(s=>s.exercises.filter(e=>e.name===exerciseName).map(e=>({...e, sessionDate:s.date, sessionId:s.id})))
    .sort((a,b)=>b.sessionDate.localeCompare(a.sessionDate));
  return matches[0] || null;
}
function previousWeight(exerciseName){ return previousExerciseRecord(exerciseName)?.weight ?? null; }
function normaliseWeight(value){
  if(value===null || value===undefined) return null;
  const text=String(value).trim();
  if(!text) return null;
  if(text.toUpperCase()==="BW") return "BW";
  const n=Number(text);
  return Number.isNaN(n) ? null : n;
}
function displayWeight(value){
  if(value===null || value===undefined || value==="") return "Not set";
  return String(value).toUpperCase()==="BW" ? "BW" : `${value} kg`;
}
function applyProgression(base, rule){
  if(base==="" || base===null || base===undefined) return base;
  if(String(base).trim().toUpperCase()==="BW") return "BW";
  const n=Number(base);
  if(Number.isNaN(n)) return base;
  if(rule==="inc2.5") return n+2.5;
  if(rule==="inc5") return n+5;
  if(rule==="dec2.5") return Math.max(0,n-2.5);
  if(rule==="dec5") return Math.max(0,n-5);
  return n;
}
function suggestedWeight(ex){
  const prevRecord=previousExerciseRecord(ex.name);
  const base=prevRecord?.weight ?? ex.programWeight ?? "";
  const rule=prevRecord?.progression || "maintain";
  return applyProgression(base, rule);
}
async function loadExerciseLibrary(){
  try {
    const response = await fetch("exercises.json", {cache:"no-store"});
    if (!response.ok) throw new Error("Exercise list unavailable");
    exerciseLibrary = await response.json();
  } catch (err) {
    // When index.html is opened directly as a file, browsers may block fetch().
    // Keep a small fallback so the editor still works; exercises.json is used
    // automatically when the app is run through app.py.
    exerciseLibrary = [
      "Dumbbell Chest Press", "Dumbbell Incline Chest Press", "Chest Supported Dumbbell Row",
      "Close Grip Lat Pulldown", "Dumbbell Bulgarians", "Dumbbell Goblet Squats",
      "Dumbbell Shoulder Press", "Dumbbell Upright Row", "Barbell Bench Press",
      "Incline Bench Press", "Dumbbell Row", "Seated Cable Row", "Lat Pulldown",
      "Pull Up", "Chin Up", "Romanian Deadlift", "Barbell Squat", "Goblet Squat",
      "Leg Press", "Leg Extension", "Leg Curl", "Lunge", "Bulgarian Split Squat",
      "Calf Raise", "Dumbbell Lateral Raise", "Cable Face Pull", "Bicep Curl",
      "Hammer Curl", "Tricep Pushdown", "Push Up", "Plank"
    ];
  }
  exerciseLibrary = [...new Set(exerciseLibrary.map(x=>String(x).trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
}
function exerciseOptions(selected=""){
  const values = [...new Set([...exerciseLibrary, selected].filter(Boolean))].sort((a,b)=>a.localeCompare(b));
  return `<option value="">Select exercise...</option>${values.map(n=>`<option value="${escapeHtml(n)}" ${n===selected?"selected":""}>${escapeHtml(n)}</option>`).join("")}`;
}
function render(){
  const p=currentProgramme();
  document.getElementById("programmeStatus").textContent = p ? `${p.name} • ${p.status==="current"?"Current":"Archived"}` : "No programme";
  const select=document.getElementById("daySelect");
  select.innerHTML=(p?.days||[]).map(d=>`<option value="${d.id}">${escapeHtml(d.name)}</option>`).join("");
  if(activeDayId && p?.days.some(d=>d.id===activeDayId)) select.value=activeDayId;
  else activeDayId=p?.days[0]?.id;
  renderWorkout();
  renderHistory();
  renderProgrammes();
  renderExerciseHistoryOptions();
}
function renderWorkout(){
  const p=currentProgramme(), d=currentDay();
  document.getElementById("workoutTitle").textContent=d?`${p.name} — ${d.name}`:"No workout";
  const dateInput=document.getElementById("workoutDate");
  if(!dateInput.value) dateInput.value=today();
  if(!d){ document.getElementById("exerciseList").innerHTML="<div class='card'>Create a programme first.</div>"; return; }
  const list=document.getElementById("exerciseList");
  list.innerHTML=d.exercises.map(ex=>{
    const key=ex.id;
    const prev=previousWeight(ex.name);
    const suggestion=suggestedWeight(ex);
    const current=draftWorkout[key]?.weight ?? suggestion ?? "";
    const reps=draftWorkout[key]?.reps ?? "";
    const progression=draftWorkout[key]?.progression ?? "maintain";
    return `<div class="exercise">
      <h3>${escapeHtml(ex.name)}</h3>
      <div class="exercise-note">${ex.sets} × ${ex.reps}${ex.note?` • ${escapeHtml(ex.note)}`:""}</div>
      <div class="controls">
        <div><label>Today's weight</label><input type="text" inputmode="decimal" data-weight="${key}" placeholder="kg or BW" value="${escapeHtml(current)}"></div>
        <div><label>Actual reps (optional)</label><input type="text" data-reps="${key}" placeholder="${ex.sets} × ${ex.reps}" value="${escapeHtml(reps)}"></div>
      </div>
      <div class="progression">
        <label>Next session</label>
        <select data-progression="${key}">
          <option value="maintain" ${progression==="maintain"?"selected":""}>Maintain</option>
          <option value="inc2.5" ${progression==="inc2.5"?"selected":""}>Increase 2.5 kg</option>
          <option value="inc5" ${progression==="inc5"?"selected":""}>Increase 5 kg</option>
          <option value="dec2.5" ${progression==="dec2.5"?"selected":""}>Decrease 2.5 kg</option>
          <option value="dec5" ${progression==="dec5"?"selected":""}>Decrease 5 kg</option>
        </select>
      </div>
      <p class="muted">Previous: ${prev===null?"No previous record":displayWeight(prev)} • Programme: ${displayWeight(ex.programWeight)}${current!==""?` • Next suggested: ${displayWeight(applyProgression(current,progression))}`:""}</p>
    </div>`;
  }).join("");
  list.querySelectorAll("[data-weight]").forEach(el=>el.addEventListener("input",e=>{
    const k=e.target.dataset.weight; draftWorkout[k]??={}; draftWorkout[k].weight=e.target.value;
    const row=e.target.closest(".exercise");
    const progression=row.querySelector("[data-progression]")?.value || "maintain";
    const hint=row.querySelector(".muted");
    if(hint) hint.innerHTML=`Previous: ${previousWeight(d.exercises.find(x=>x.id===k).name)===null?"No previous record":displayWeight(previousWeight(d.exercises.find(x=>x.id===k).name))} • Programme: ${displayWeight(d.exercises.find(x=>x.id===k).programWeight)}${e.target.value!==""?` • Next suggested: ${displayWeight(applyProgression(e.target.value,progression))}`:""}`;
  }));
  list.querySelectorAll("[data-reps]").forEach(el=>el.addEventListener("input",e=>{
    const k=e.target.dataset.reps; draftWorkout[k]??={}; draftWorkout[k].reps=e.target.value;
  }));
  list.querySelectorAll("[data-progression]").forEach(el=>el.addEventListener("change",e=>{
    const k=e.target.dataset.progression; draftWorkout[k]??={}; draftWorkout[k].progression=e.target.value;
    // Do not alter today's weight. This setting describes the change to make
    // to the weight for the NEXT workout.
    const row=e.target.closest(".exercise");
    const weight=row.querySelector("[data-weight]").value;
    const hint=row.querySelector(".muted");
    const ex=d.exercises.find(x=>x.id===k);
    if(hint) hint.innerHTML=`Previous: ${previousWeight(ex.name)===null?"No previous record":displayWeight(previousWeight(ex.name))} • Programme: ${displayWeight(ex.programWeight)}${weight!==""?` • Next suggested: ${displayWeight(applyProgression(weight,e.target.value))}`:""}`;
  }));
}
function renderHistory(){
  const box=document.getElementById("historyList");
  const sessions=[...data.sessions].sort((a,b)=>b.date.localeCompare(a.date));
  box.innerHTML=sessions.length?sessions.map(s=>`<div class="historyItem">
    <strong>${formatDate(s.date)} — ${escapeHtml(s.programmeName)} — ${escapeHtml(s.dayName)}</strong>
    ${s.exercises.map(e=>`<div>${escapeHtml(e.name)}: <strong>${displayWeight(e.weight)}</strong>${e.reps?` (${escapeHtml(e.reps)})`:""}</div>`).join("")}
    ${s.notes?`<p class="muted">Note: ${escapeHtml(s.notes)}</p>`:""}
  </div>`).join(""):"<p class='muted'>No completed workouts yet.</p>";
}
function renderExerciseHistoryOptions(){
  const names=[...new Set(data.sessions.flatMap(s=>s.exercises.map(e=>e.name)))].sort();
  const sel=document.getElementById("exerciseHistorySelect");
  sel.innerHTML=names.length?names.map(n=>`<option>${escapeHtml(n)}</option>`).join(""):"<option>No exercise history yet</option>";
  renderExerciseHistory();
}
function renderExerciseHistory(){
  const name=document.getElementById("exerciseHistorySelect").value;
  const rows=data.sessions.flatMap(s=>s.exercises.filter(e=>e.name===name).map(e=>({date:s.date,programme:s.programmeName,day:s.dayName,...e}))).sort((a,b)=>b.date.localeCompare(a.date));
  document.getElementById("exerciseHistory").innerHTML=rows.map(r=>`<div class="historyItem">${formatDate(r.date)} — ${escapeHtml(r.programme)} — <strong>${displayWeight(r.weight)}</strong>${r.reps?` — ${escapeHtml(r.reps)}`:""}</div>`).join("") || "<p class='muted'>No records.</p>";
}
function renderProgrammes(){
  const sorted=[...data.programmes].sort((a,b)=>({current:0,draft:1,archived:2}[a.status]??3)-({current:0,draft:1,archived:2}[b.status]??3));
  document.getElementById("programmeList").innerHTML=sorted.map(p=>`<div class="programmeItem">
    <div class="row between">
      <div><strong>${escapeHtml(p.name)}</strong><br><span class="muted">Started ${formatDate(p.startDate)}</span></div>
      <span class="badge ${p.status}">${p.status}</span>
    </div>
    <p class="muted">${p.days.length} workout day${p.days.length===1?"":"s"} • ${p.days.reduce((a,d)=>a+d.exercises.length,0)} exercises</p>
    <div class="buttonRow">
      <button class="secondary small" data-edit-programme="${p.id}">Edit</button>
      ${p.status!=="current"?`<button class="secondary small" data-activate="${p.id}">Make Current</button>`:""}
    </div>
  </div>`).join("");
  document.querySelectorAll("[data-activate]").forEach(b=>b.onclick=()=>activateProgramme(b.dataset.activate));
  document.querySelectorAll("[data-edit-programme]").forEach(b=>b.onclick=()=>openProgrammeEditor(b.dataset.editProgramme));
}
function activateProgramme(id){
  const target=data.programmes.find(p=>p.id===id);
  if(!target) return;
  data.programmes.forEach(p=>p.status=p.id===id?"current":(p.status==="draft"?"draft":"archived"));
  target.status="current";
  activeDayId=target.days[0]?.id;
  draftWorkout={};
  document.getElementById("workoutDate").value=today();
  saveData(); render();
}

function syncProgrammeEditor(days){
  days.forEach((d,i)=>{
    const dayName=document.querySelector(`[data-day-name="${i}"]`);
    if(dayName) d.name=dayName.value;
    d.exercises.forEach((x,j)=>{
      const name=document.querySelector(`[data-ex-name="${i}-${j}"]`);
      const select=document.querySelector(`[data-ex-select="${i}-${j}"]`);
      const sets=document.querySelector(`[data-ex-sets="${i}-${j}"]`);
      const reps=document.querySelector(`[data-ex-reps="${i}-${j}"]`);
      const weight=document.querySelector(`[data-ex-weight="${i}-${j}"]`);
      const note=document.querySelector(`[data-ex-note="${i}-${j}"]`);
      if(name) x.name=name.value;
      if(sets) x.sets=Number(sets.value)||0;
      if(reps) x.reps=Number(reps.value)||0;
      if(weight) x.programWeight=normaliseWeight(weight.value);
      if(note) x.note=note.value;
    });
  });
}
function programmeEditorHtml(days){
  return days.map((d,i)=>`
    <div class="dayEditor">
      <div class="editorHeading"><strong>Workout day</strong><button class="secondary small" data-remove-day="${i}">Remove day</button></div>
      <input data-day-name="${i}" value="${escapeHtml(d.name)}" placeholder="e.g. Day 1">
      <div class="editorLabels"><span>Exercise</span><span>Sets</span><span>Reps</span><span>kg</span><span>Notes</span></div>
      <div id="dayEx${i}">
        ${d.exercises.map((e,j)=>`
          <div class="exerciseEditor">
            <div class="exerciseNameFields">
              <select data-ex-select="${i}-${j}">${exerciseOptions(e.name)}</select>
              <input data-ex-name="${i}-${j}" value="${escapeHtml(e.name)}" placeholder="Or type/edit exercise name">
            </div>
            <input data-ex-sets="${i}-${j}" type="number" min="0" value="${e.sets??""}" aria-label="Sets">
            <input data-ex-reps="${i}-${j}" type="number" min="0" value="${e.reps??""}" aria-label="Reps">
            <input class="weightField" data-ex-weight="${i}-${j}" type="text" inputmode="decimal" value="${escapeHtml(e.programWeight??"")}" placeholder="kg or BW" aria-label="kg or BW">
            <input data-ex-note="${i}-${j}" value="${escapeHtml(e.note||"")}" placeholder="Notes" aria-label="Exercise notes">
            <button class="secondary small removeExercise" data-remove-ex="${i}-${j}">Remove</button>
          </div>`).join("")}
      </div>
      <button class="secondary small" data-add-ex="${i}">+ Exercise</button>
    </div>`).join("");
}
function openProgrammeEditor(programmeId){
  const p=data.programmes.find(x=>x.id===programmeId);
  if(!p) return;
  document.getElementById("modalTitle").textContent=`Edit Programme: ${p.name}`;
  let days=JSON.parse(JSON.stringify(p.days));
  document.getElementById("modalBody").innerHTML=`
    <div class="formGrid">
      <div><label>Programme name</label><input id="editName" value="${escapeHtml(p.name)}"></div>
      <div><label>Start date</label><input id="editDate" type="date" value="${escapeHtml(p.startDate||today())}"></div>
    </div>
    <p class="muted" style="margin-top:10px">Choose an exercise from the list or type/edit the name underneath it. Programme weights are the trainer's prescribed weights and are separate from your actual workout weights.</p>
    <div id="editDays">${programmeEditorHtml(days)}</div>
    <button id="editAddDay" class="secondary">+ Add Workout Day</button>
    <button id="saveProgramme" class="primary full">Save Programme</button>`;
  document.getElementById("modal").classList.remove("hidden");

  const refreshDays=()=>{
    syncProgrammeEditor(days);
    document.getElementById("editDays").innerHTML=programmeEditorHtml(days);
  };
  document.getElementById("editAddDay").onclick=()=>{
    syncProgrammeEditor(days);
    days.push({name:`Day ${days.length+1}`,exercises:[{name:"",sets:3,reps:8,programWeight:null,note:""}]});
    refreshDays();
  };
  document.getElementById("modalBody").addEventListener("click",e=>{
    if(e.target.dataset.addEx!==undefined){
      syncProgrammeEditor(days);
      const i=Number(e.target.dataset.addEx);
      days[i].exercises.push({name:"",sets:3,reps:8,programWeight:null,note:""});
      refreshDays();
      return;
    }
    if(e.target.dataset.removeEx!==undefined){
      syncProgrammeEditor(days);
      const [i,j]=e.target.dataset.removeEx.split("-").map(Number);
      days[i].exercises.splice(j,1);
      refreshDays();
      return;
    }
    if(e.target.dataset.removeDay!==undefined){
      syncProgrammeEditor(days);
      days.splice(Number(e.target.dataset.removeDay),1);
      refreshDays();
    }
  });
  document.getElementById("modalBody").addEventListener("change",e=>{
    if(e.target.dataset.exSelect!==undefined){
      const [i,j]=e.target.dataset.exSelect.split("-").map(Number);
      const nameInput=document.querySelector(`[data-ex-name="${i}-${j}"]`);
      if(nameInput && e.target.value) nameInput.value=e.target.value;
    }
  });
  document.getElementById("saveProgramme").onclick=()=>{
    syncProgrammeEditor(days);
    p.name=document.getElementById("editName").value.trim()||p.name;
    p.startDate=document.getElementById("editDate").value||p.startDate||today();
    p.days=days.map((d,di)=>({
      id:d.id||crypto.randomUUID(),
      name:d.name.trim()||`Day ${di+1}`,
      exercises:d.exercises.map(x=>({
        id:x.id||crypto.randomUUID(),
        name:x.name.trim(), sets:Number(x.sets)||0, reps:Number(x.reps)||0,
        programWeight:normaliseWeight(x.programWeight),
        note:x.note||""
      })).filter(x=>x.name)
    })).filter(d=>d.exercises.length);
    if(p.status==="current") activeDayId=p.days.find(d=>d.id===activeDayId)?.id||p.days[0]?.id;
    saveData(); closeModal(); render();
  };
}
function openNewProgramme(){
  document.getElementById("modalTitle").textContent="New Programme";
  let days=[];
  document.getElementById("modalBody").innerHTML=`
    <div class="formGrid">
      <div><label>Programme name</label><input id="newName" placeholder="e.g. Holiday Programme"></div>
      <div><label>Start date</label><input id="newDate" type="date" value="${today()}"></div>
    </div>
    <p class="muted" style="margin-top:10px">Choose an exercise from the list or type/edit the name underneath it. Your entries will remain in place when you add another day or exercise.</p>
    <div id="newDays"></div>
    <button id="addDay" class="secondary">+ Add Workout Day</button>
    <button id="createProgramme" class="primary full">Create Programme</button>`;
  document.getElementById("modal").classList.remove("hidden");
  const renderDays=()=>{ document.getElementById("newDays").innerHTML=programmeEditorHtml(days); };
  document.getElementById("addDay").onclick=()=>{
    syncProgrammeEditor(days);
    days.push({name:`Day ${days.length+1}`,exercises:[{name:"",sets:3,reps:8,programWeight:null,note:""}]});
    renderDays();
  };
  document.getElementById("modalBody").addEventListener("click",e=>{
    if(e.target.dataset.addEx!==undefined){
      syncProgrammeEditor(days);
      const i=Number(e.target.dataset.addEx);
      days[i].exercises.push({name:"",sets:3,reps:8,programWeight:null,note:""});
      renderDays();
      return;
    }
    if(e.target.dataset.removeEx!==undefined){
      syncProgrammeEditor(days);
      const [i,j]=e.target.dataset.removeEx.split("-").map(Number);
      days[i].exercises.splice(j,1); renderDays(); return;
    }
    if(e.target.dataset.removeDay!==undefined){
      syncProgrammeEditor(days); days.splice(Number(e.target.dataset.removeDay),1); renderDays();
    }
  });
  document.getElementById("modalBody").addEventListener("change",e=>{
    if(e.target.dataset.exSelect!==undefined){
      const [i,j]=e.target.dataset.exSelect.split("-").map(Number);
      const nameInput=document.querySelector(`[data-ex-name="${i}-${j}"]`);
      if(nameInput && e.target.value) nameInput.value=e.target.value;
    }
  });
  document.getElementById("createProgramme").onclick=()=>{
    syncProgrammeEditor(days);
    days=days.map((d,di)=>({
      id:crypto.randomUUID(), name:d.name.trim()||`Day ${di+1}`,
      exercises:d.exercises.map(x=>({id:crypto.randomUUID(),name:x.name.trim(),sets:Number(x.sets)||0,reps:Number(x.reps)||0,programWeight:normaliseWeight(x.programWeight),note:x.note||""})).filter(x=>x.name)
    })).filter(d=>d.exercises.length);
    const p={id:crypto.randomUUID(),name:document.getElementById("newName").value.trim()||"New Programme",startDate:document.getElementById("newDate").value||today(),status:"draft",days};
    data.programmes.unshift(p); activeDayId=p.days[0]?.id; saveData(); closeModal(); render();
  };
  renderDays();
}
function closeModal(){document.getElementById("modal").classList.add("hidden");}

function saveWorkout(){
  const p=currentProgramme(), d=currentDay();
  if(!p||!d)return;
  const workoutDate=document.getElementById("workoutDate").value||today();
  const exercises=d.exercises.map(ex=>{
    const x=draftWorkout[ex.id]||{};
    const rawWeight=x.weight!==undefined && x.weight!=="" ? x.weight : suggestedWeight(ex);
    return {name:ex.name, weight:normaliseWeight(rawWeight), reps:x.reps||"", progression:x.progression||"maintain"};
  });
  data.sessions.push({id:crypto.randomUUID(),date:workoutDate,programmeId:p.id,programmeName:p.name,dayId:d.id,dayName:d.name,exercises,notes:document.getElementById("sessionNotes").value});
  saveData();
  draftWorkout={};
  document.getElementById("sessionNotes").value="";
  document.getElementById("workoutDate").value=today();
  document.getElementById("saveMessage").textContent="Workout saved.";
  render();
  setTimeout(()=>document.getElementById("saveMessage").textContent="",2500);
}
function escapeHtml(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}

document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{
  document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));
  document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active"));
  b.classList.add("active"); document.getElementById(b.dataset.screen+"Screen").classList.add("active");
});
document.getElementById("daySelect").onchange=e=>{activeDayId=e.target.value;draftWorkout={};renderWorkout();};
document.getElementById("saveSession").onclick=saveWorkout;
document.getElementById("newProgramme").onclick=openNewProgramme;
document.getElementById("closeModal").onclick=closeModal;
document.getElementById("exerciseHistorySelect").onchange=renderExerciseHistory;
document.getElementById("installHint").onclick=()=>alert("On iPhone: open the app in Safari, tap Share, then Add to Home Screen.");
if("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js?v=3").catch(()=>{});
render();
loadExerciseLibrary().then(render);
