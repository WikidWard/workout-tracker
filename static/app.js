// Key used to save and retrieve this user's workout data in browser storage.
// Keep this unchanged between normal updates so existing data remains accessible.
const KEY = "workoutTrackerDataV1";

// Exercise names loaded from exercises.json and used in programme editor dropdowns.
let exerciseLibrary = [];

// Built-in starter programmes offered to new users.
// These are copied into saved data when needed; the saved versions can then be edited
// without changing these original templates.
const starterProgrammes = [
  {
    id: "starter-full-body-3",
    name: "Full Body - 3 Days",
    startDate: "2026-01-01",
    status: "archived",
    days: [
      {
        id: crypto.randomUUID(),
        name: "Day 1",
        exercises: [
          {id:crypto.randomUUID(), name:"Goblet Squat", sets:3, reps:8, programWeight:null, note:""},
          {id:crypto.randomUUID(), name:"Chest Press", sets:3, reps:8, programWeight:null, note:""},
          {id:crypto.randomUUID(), name:"Rows", sets:3, reps:8, programWeight:null, note:""},
          {id:crypto.randomUUID(), name:"Shoulder Press", sets:3, reps:8, programWeight:null, note:""}
        ]
      },
      {
        id: crypto.randomUUID(),
        name: "Day 2",
        exercises: [
          {id:crypto.randomUUID(), name:"Deadlift", sets:3, reps:8, programWeight:null, note:""},
          {id:crypto.randomUUID(), name:"Incline Chest Press", sets:3, reps:8, programWeight:null, note:""},
          {id:crypto.randomUUID(), name:"Lat Pulldown", sets:3, reps:8, programWeight:null, note:""},
          {id:crypto.randomUUID(), name:"Lateral Raise", sets:3, reps:10, programWeight:null, note:""}
        ]
      },
      {
        id: crypto.randomUUID(),
        name: "Day 3",
        exercises: [
          {id:crypto.randomUUID(), name:"Lunges - Reverse", sets:3, reps:8, programWeight:null, note:"Each Leg"},
          {id:crypto.randomUUID(), name:"Push Ups", sets:3, reps:10, programWeight:"BW", note:""},
          {id:crypto.randomUUID(), name:"Seated Cable Row", sets:3, reps:8, programWeight:null, note:""},
          {id:crypto.randomUUID(), name:"Bicep Curls", sets:3, reps:10, programWeight:null, note:""}
        ]
      }
    ]
  },

  {
    id: "starter-dumbbell",
    name: "Full Body - 2 Days",
    startDate: "2026-01-01",
    status: "archived",
    days: [
      {
        id: crypto.randomUUID(),
        name: "Day 1",
        exercises: [
          {id:crypto.randomUUID(), name:"Goblet Squat", sets:3, reps:10, programWeight:null, note:""},
          {id:crypto.randomUUID(), name:"Chest Press", sets:3, reps:10, programWeight:null, note:""},
          {id:crypto.randomUUID(), name:"Bent Over Rows", sets:3, reps:10, programWeight:null, note:""},
          {id:crypto.randomUUID(), name:"Shoulder Press", sets:3, reps:10, programWeight:null, note:""}
        ]
      },
      {
        id: crypto.randomUUID(),
        name: "Day 2",
        exercises: [
          {id:crypto.randomUUID(), name:"Lunges", sets:3, reps:8, programWeight:null, note:""},
          {id:crypto.randomUUID(), name:"Incline Chest Press", sets:3, reps:10, programWeight:null, note:""},
          {id:crypto.randomUUID(), name:"Deadlift", sets:3, reps:10, programWeight:null, note:""},
          {id:crypto.randomUUID(), name:"Upright Row", sets:3, reps:10, programWeight:null, note:""}
        ]
      }
    ]
  },

  {
    id: "starter-bodyweight",
    name: "Bodyweight",
    startDate: "2026-01-01",
    status: "archived",
    days: [
      {
        id: crypto.randomUUID(),
        name: "Day 1",
        exercises: [
          {id:crypto.randomUUID(), name:"Push Ups", sets:3, reps:10, programWeight:"BW", note:""},
          {id:crypto.randomUUID(), name:"Squats", sets:3, reps:15, programWeight:"BW", note:""},
          {id:crypto.randomUUID(), name:"Glute Bridge", sets:3, reps:12, programWeight:"BW", note:""},
          {id:crypto.randomUUID(), name:"Plank", sets:3, reps:30, programWeight:"BW", note:"Seconds"}
        ]
      },
      {
        id: crypto.randomUUID(),
        name: "Day 2",
        exercises: [
          {id:crypto.randomUUID(), name:"Pull Ups", sets:3, reps:10, programWeight:"BW", note:""},
          {id:crypto.randomUUID(), name:"Sissy Squats", sets:3, reps:8, programWeight:"BW", note:""},
          {id:crypto.randomUUID(), name:"Russian Twists", sets:3, reps:10, programWeight:"BW", note:""},
          {id:crypto.randomUUID(), name:"Leg Raisers", sets:3, reps:30, programWeight:"BW", note:""}
        ]
      }
    ]
  },

  {
    id: "starter-upper-lower",
    name: "Upper/Lower",
    startDate: "2026-01-01",
    status: "archived",
    days: [
      {
        id: crypto.randomUUID(),
        name: "Upper 1",
        exercises: [
          {id:crypto.randomUUID(), name:"Chest Press", sets:4, reps:8, programWeight:null, note:""},
          {id:crypto.randomUUID(), name:"Chest Supported Rows", sets:4, reps:8, programWeight:null, note:""},
          {id:crypto.randomUUID(), name:"Shoulder Press", sets:3, reps:10, programWeight:null, note:""},
          {id:crypto.randomUUID(), name:"Bicep Curl", sets:3, reps:10, programWeight:null, note:""}
        ]
      },
      {
        id: crypto.randomUUID(),
        name: "Lower 1",
        exercises: [
          {id:crypto.randomUUID(), name:"Goblet Squat", sets:4, reps:8, programWeight:null, note:""},
          {id:crypto.randomUUID(), name:"Deadlift - Romanian", sets:4, reps:8, programWeight:null, note:""},
          {id:crypto.randomUUID(), name:"Lunges", sets:3, reps:10, programWeight:null, note:""}
        ]
      },
      {
        id: crypto.randomUUID(),
        name: "Upper 2",
        exercises: [
          {id:crypto.randomUUID(), name:"Incline Chest Press", sets:4, reps:8, programWeight:null, note:""},
          {id:crypto.randomUUID(), name:"Lat Pulldown", sets:4, reps:8, programWeight:null, note:""},
          {id:crypto.randomUUID(), name:"Lateral Raise", sets:3, reps:12, programWeight:null, note:""},
          {id:crypto.randomUUID(), name:"Tricep Extension", sets:3, reps:10, programWeight:null, note:""}
        ]
      },
      {
        id: crypto.randomUUID(),
        name: "Lower 2",
        exercises: [
          {id:crypto.randomUUID(), name:"Bulgarian Split Squat", sets:4, reps:8, programWeight:null, note:"Each leg"},
          {id:crypto.randomUUID(), name:"Goblet Squat", sets:3, reps:10, programWeight:null, note:""},
          {id:crypto.randomUUID(), name:"Calf Raise", sets:3, reps:15, programWeight:null, note:""}
        ]
      }
    ]
  }
];

// Initialise the app from browser storage.
// Track whether this is the first visit, which workout day is selected, and any unsaved changes entered on the current workout screen.
let isFirstVisit = localStorage.getItem(KEY) === null;
let data = loadData();
let activeDayId = data.programmes.find(p=>p.status==="current")?.days[0]?.id;
let draftWorkout = {};

// Load saved data from browser storage.
// If data already exists, add any missing starter programmes without replacing
// the user's existing programmes, workout history or progression settings.
// If no saved data exists, initialise the app with copies of the starter programmes.
function loadData() {
  const raw = localStorage.getItem(KEY);

  if (raw) {
    const parsed = JSON.parse(raw);

    // Keep compatibility with the first prototype.
    parsed.progression ||= {};
    parsed.sessions ||= [];
    parsed.programmes ||= [];

    // Add only starter programmes whose IDs are not already saved.
    // This allows new starter programmes to be introduced in future updates
    // without overwriting a user's existing version of a programme.
    starterProgrammes.forEach(starter => {
      if (!parsed.programmes.some(p => p.id === starter.id)) {
        parsed.programmes.push(JSON.parse(JSON.stringify(starter)));
      }
    });

    return parsed;
  }

  // First time the app is used.
  return {
    programmes: JSON.parse(JSON.stringify(starterProgrammes)),
    sessions: [],
    progression: {}
  };
}

// Save the complete app data object to browser storage as JSON.
function saveData(){ localStorage.setItem(KEY, JSON.stringify(data)); }

// Display the first-visit welcome screen and hide the normal app screens.
// Build the starter programme choices and connect each button to its programme.
function showWelcome() {
  document.getElementById("welcomeScreen").classList.remove("hidden");
  document.querySelector(".tabs").classList.add("hidden");

  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.add("hidden");
  });

  const choices = document.getElementById("starterChoices");

  choices.innerHTML = starterProgrammes.map(p => `
    <div class="card">
      <h3>${escapeHtml(p.name)}</h3>
      <p class="muted">${p.days.length} workout days</p>
      <button class="primary full" data-starter="${p.id}">
        Choose this programme
      </button>
    </div>
  `).join("");

  choices.querySelectorAll("[data-starter]").forEach(button => {
    button.onclick = () => activateProgramme(button.dataset.starter);
  });
}

// Complete the welcome process and display the normal app interface,
// opening the Workout screen first.
function finishWelcome() {
  isFirstVisit = false;
  document.getElementById("welcomeScreen").classList.add("hidden");
  document.querySelector(".tabs").classList.remove("hidden");

  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("hidden");
    screen.classList.remove("active");
  });

  document.querySelector('[data-screen="workout"]').classList.add("active");
  document.getElementById("workoutScreen").classList.add("active");
}

// Export the complete saved app data as a downloadable JSON backup.
// Include the app name, backup format version and export timestamp so the
// file can be identified and checked when it is restored.
function exportBackup(){
  const backup = {
    app: "Workout Tracker",
    version: 1,
    exportedAt: new Date().toISOString(),
    data: data
  };

  // Convert the backup object into a downloadable JSON file.
  const file = new Blob(
    [JSON.stringify(backup, null, 2)],
    {type: "application/json"}
  );

  // Create a temporary browser URL so the backup can be downloaded.
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");

  link.href = url;
  link.download = `workout-backup-${today()}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

// Restore app data from a selected backup file.
// Check that the file is valid and has the expected structure before asking
// the user to confirm replacing their current data.
async function importBackup(file){
  if(!file) return;

  let backup;

  // Read the selected file and parse its JSON contents.
  // Reject unreadable or invalid JSON before making any changes.
  try {
    const text = await file.text();
    backup = JSON.parse(text);
  } catch {
    alert("This file is not a valid backup file.");
    return;
  }

  // Check the backup's identifying information and required data structures
  // before allowing it to replace the current saved data.
  if(
    backup.app !== "Workout Tracker" ||
    backup.version !== 1 ||
    !backup.data ||
    !Array.isArray(backup.data.programmes) ||
    !Array.isArray(backup.data.sessions) ||
    typeof backup.data.progression !== "object" ||
    backup.data.progression === null ||
    Array.isArray(backup.data.progression)
  ){
    alert("The file does not contain a recognised workout backup.");
    return;
  }

  // Restoring a backup replaces the current data rather than merging it.
  // Ask for confirmation because this can overwrite newer workouts and programmes.
  const confirmed = confirm(
    "Restore this backup?\n\n" +
    "Your current programmes, workout history and progression data " +
    "will be replaced by the data in this backup.\n\n" +
    "Export a backup of your current data first if you want to keep it."
  );

  if(!confirmed) return;

  // Preserve the current data if saving the imported data fails.
  const previousData = localStorage.getItem(KEY);

  // Save the backup to browser storage and update the app's in-memory data.
  // If the restore fails, the catch block attempts to restore the previous stored data.
  try {
    localStorage.setItem(KEY, JSON.stringify(backup.data));
    data = JSON.parse(JSON.stringify(backup.data));

    activeDayId = currentProgramme()?.days[0]?.id;
    draftWorkout = {};

    render();
    alert("Backup restored successfully.");
  } catch(error) {
    if(previousData === null){
      localStorage.removeItem(KEY);
    } else {
      localStorage.setItem(KEY, previousData);
    }

    alert("The backup could not be restored. Your previous data has been kept.");
  }
}


// Return the current programme, or fall back to the first available programme
// if none is marked as current.
function currentProgramme(){ return data.programmes.find(p=>p.status==="current") || data.programmes[0]; }

// Return the selected workout day within the current programme.
// If the selected day is no longer available, fall back to the programme's first day.
function currentDay(){ return currentProgramme()?.days.find(d=>d.id===activeDayId) || currentProgramme()?.days[0]; }

// Return today's date as a YYYY-MM-DD string for date fields and saved sessions.
function today(){ return new Date().toISOString().slice(0,10); }

// Convert a YYYY-MM-DD date into a readable Australian date format.
// Using midday when parsing helps avoid dates shifting because of time zones.
function formatDate(s){ return new Date(s+"T12:00:00").toLocaleDateString("en-AU",{day:"numeric",month:"short",year:"numeric"}); }

// Find the most recent saved record for an exercise name across all programmes.
// Attach each session's date to its matching exercise record, then sort the records
// newest first. The returned record supplies the previous weight and progression rule.
function previousExerciseRecord(exerciseName){
  const matches = data.sessions
    .flatMap(s=>s.exercises.filter(e=>e.name===exerciseName).map(e=>({...e, sessionDate:s.date, sessionId:s.id})))
    .sort((a,b)=>b.sessionDate.localeCompare(a.sessionDate));
  return matches[0] || null;
}

// Return the most recently recorded weight for an exercise, or null if none exists.
function previousWeight(exerciseName){ return previousExerciseRecord(exerciseName)?.weight ?? null; }

// Convert a weight entered by the user into a consistent stored value.
// Numeric weights are stored as numbers, BW is stored as the text "BW",
// and empty or invalid entries are represented by null.
function normaliseWeight(value){
  if(value===null || value===undefined) return null;
  const text=String(value).trim();
  if(!text) return null;
  if(text.toUpperCase()==="BW") return "BW";
  const n=Number(text);
  return Number.isNaN(n) ? null : n;
}

// Format a stored weight for display, adding "kg" to numeric values
// while keeping bodyweight exercises labelled "BW".
function displayWeight(value){
  if(value===null || value===undefined || value==="") return "Not set";
  return String(value).toUpperCase()==="BW" ? "BW" : `${value} kg`;
}

// Calculate the next suggested weight from a starting weight and progression rule.
// This function calculates a suggestion; it does not change the saved workout weight.
// Bodyweight exercises do not receive an automatic numeric weight adjustment.
function applyProgression(base, rule){
  if(base==="" || base===null || base===undefined) return base;
  if(String(base).trim().toUpperCase()==="BW") return "BW";
  const n=Number(base);
  if(Number.isNaN(n)) return base;

  // Apply the standard 2.5 kg adjustment for weighted exercises.
  if(rule==="increase") return n+2.5;

  // Keep the result at or above zero when decreasing a weight.
  if(rule==="decrease"){
    const nextWeight=Math.max(0,n-2.5);
    return nextWeight===0 ? "BW" : nextWeight;
  }
  
  return n;
}

// Choose the starting point for the next workout's weight suggestion.
// Prefer the most recent recorded weight; if no workout record exists,
// use the programme's prescribed weight. Apply the last progression choice once.
function suggestedWeight(ex){
  const prevRecord=previousExerciseRecord(ex.name);
  const base=prevRecord?.weight ?? ex.programWeight ?? "";
  const rule=prevRecord?.progression || "maintain";
  return applyProgression(base, rule);
}

// Load the exercise names from exercises.json.
// If the file cannot be loaded, use the built-in fallback list so the programme
// editor can still offer exercise choices.
async function loadExerciseLibrary(){
  try {
    const response = await fetch("exercises.json", {cache:"no-store"});
    if (!response.ok) throw new Error("Exercise list unavailable");
    exerciseLibrary = await response.json();
  } catch (err) {
    
    // When index.html is opened directly as a file, browsers may block fetch().
    // Keep a small fallback so the editor still works.
    // When the app is served through a web server, load exercises.json instead.
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
  
  // Remove duplicates and blank names, trim whitespace, and sort alphabetically.
  exerciseLibrary = [...new Set(exerciseLibrary.map(x=>String(x).trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
}

// Build the HTML options for an exercise dropdown.
// Include the currently selected name even if it is not in the standard exercise library.
function exerciseOptions(selected=""){
  const values = [...new Set([...exerciseLibrary, selected].filter(Boolean))].sort((a,b)=>a.localeCompare(b));
  return `<option value="">Select exercise...</option>${values.map(n=>`<option value="${escapeHtml(n)}" ${n===selected?"selected":""}>${escapeHtml(n)}</option>`).join("")}`;
}

// Refresh the main interface using the current app data.
// Update the programme status and workout-day selector, then refresh each screen's content.
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

// Build the workout screen for the selected programme and day.
// Populate each exercise with its previous record, suggested weight and any
// unsaved entries, then attach the input handlers used during the workout.
function renderWorkout(){
  const p=currentProgramme(), d=currentDay();
  document.getElementById("workoutTitle").textContent=d?`${p.name} — ${d.name}`:"No workout";
  
  // Find the most recent session by date for the summary shown above the workout.
  const lastWorkout = data.sessions
    .slice()
    .sort((a,b)=>b.date.localeCompare(a.date))[0];

  document.getElementById("lastWorkout").textContent =
    lastWorkout ? `${lastWorkout.programmeName} — ${lastWorkout.dayName}` : "No previous workout";

  
  const dateInput=document.getElementById("workoutDate");
  if(!dateInput.value) dateInput.value=today();
  if(!d){ document.getElementById("exerciseList").innerHTML="<div class='card'>Create a programme first.</div>"; return; }
  const list=document.getElementById("exerciseList");
  
  // Build one interface card for each exercise in the selected workout day.
  // Keep unsaved entries in draftWorkout so a screen refresh does not discard them.
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
      <div>
        <label>Today's weight</label>
        <div class="weightInputRow">
          <input type="text" inputmode="decimal" data-weight="${key}" placeholder="kg or BW" value="${escapeHtml(current)}">
          <button type="button" class="secondary small bwButton" data-bw="${key}">BW</button>
        </div>
      </div>        
      <div><label>Actual reps (optional)</label><input type="text" data-reps="${key}" placeholder="${ex.sets} × ${ex.reps}" value="${escapeHtml(reps)}"></div>
      </div>
      <div class="progression">
        <label>Next session</label>
        <select data-progression="${key}">
          <option value="maintain" ${progression==="maintain"?"selected":""}>Maintain</option>
          <option value="increase" ${progression==="increase"?"selected":""}>Increase</option>
          <option value="decrease" ${progression==="decrease"?"selected":""}>Decrease</option>
        </select>
      </div>
      <p class="muted">Previous: ${prev===null?"No previous record":displayWeight(prev)} • Programme: ${displayWeight(ex.programWeight)}${current!==""?` • Next suggested: ${displayWeight(applyProgression(current,progression))}`:""}</p>
    </div>`;
  }).join("");
  
  // Keep the draft weight in sync with the input and update the displayed suggestion whenever the user changes today's weight.
  list.querySelectorAll("[data-weight]").forEach(el=>el.addEventListener("input",e=>{
    const k=e.target.dataset.weight; draftWorkout[k]??={}; draftWorkout[k].weight=e.target.value;
    const row=e.target.closest(".exercise");
    const progression=row.querySelector("[data-progression]")?.value || "maintain";
    const hint=row.querySelector(".muted");
    if(hint) hint.innerHTML=`Previous: ${previousWeight(d.exercises.find(x=>x.id===k).name)===null?"No previous record":displayWeight(previousWeight(d.exercises.find(x=>x.id===k).name))} • Programme: ${displayWeight(d.exercises.find(x=>x.id===k).programWeight)}${e.target.value!==""?` • Next suggested: ${displayWeight(applyProgression(e.target.value,progression))}`:""}`;
  }));

  // Set the exercise weight to BW and trigger the normal input handler so the draft and displayed suggestion are updated together.
  list.querySelectorAll("[data-bw]").forEach(el=>el.addEventListener("click",e=>{
  const k=e.target.dataset.bw;
  draftWorkout[k]??={};
  draftWorkout[k].weight="BW";

  const input=list.querySelector(`[data-weight="${k}"]`);
  if(input) input.value="BW";

  input?.dispatchEvent(new Event("input", {bubbles:true}));
}));

  // Store the actual repetitions entered for this exercise in the unsaved workout draft.
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

// Display all saved workout sessions, newest first, including their exercises,
// recorded weights, actual repetitions and any session notes.
function renderHistory(){
  const box=document.getElementById("historyList");
  const sessions=[...data.sessions].sort((a,b)=>b.date.localeCompare(a.date));
  box.innerHTML=sessions.length?sessions.map(s=>`<div class="historyItem">
    <strong>${formatDate(s.date)} — ${escapeHtml(s.programmeName)} — ${escapeHtml(s.dayName)}</strong>
    ${s.exercises.map(e=>`<div>${escapeHtml(e.name)}: <strong>${displayWeight(e.weight)}</strong>${e.reps?` (${escapeHtml(e.reps)})`:""}</div>`).join("")}
    ${s.notes?`<p class="muted">Note: ${escapeHtml(s.notes)}</p>`:""}
  </div>`).join(""):"<p class='muted'>No completed workouts yet.</p>";
}

// Build the exercise-history dropdown from the unique exercise names
// found in saved workout sessions, then display the selected exercise's history.
function renderExerciseHistoryOptions(){
  const names=[...new Set(data.sessions.flatMap(s=>s.exercises.map(e=>e.name)))].sort();
  const sel=document.getElementById("exerciseHistorySelect");
  sel.innerHTML=names.length?names.map(n=>`<option>${escapeHtml(n)}</option>`).join(""):"<option>No exercise history yet</option>";
  renderExerciseHistory();
}

// Display saved records for the exercise selected in the history dropdown,
// sorted from newest to oldest.
function renderExerciseHistory(){
  const name=document.getElementById("exerciseHistorySelect").value;
  const rows=data.sessions.flatMap(s=>s.exercises.filter(e=>e.name===name).map(e=>({date:s.date,programme:s.programmeName,day:s.dayName,...e}))).sort((a,b)=>b.date.localeCompare(a.date));
  document.getElementById("exerciseHistory").innerHTML=rows.map(r=>`<div class="historyItem">${formatDate(r.date)} — ${escapeHtml(r.programme)} — <strong>${displayWeight(r.weight)}</strong>${r.reps?` — ${escapeHtml(r.reps)}`:""}</div>`).join("") || "<p class='muted'>No records.</p>";
}

// Display all programmes, ordered by status, and connect their activate,
// edit and delete buttons to the relevant functions.
function renderProgrammes(){
  // Order programmes by status: current first, drafts second, archived last.
  const sorted=[...data.programmes].sort((a,b)=>({current:0,draft:1,archived:2}[a.status]??3)-({current:0,draft:1,archived:2}[b.status]??3));
  document.getElementById("programmeList").innerHTML=sorted.map(p=>`<div class="programmeItem">
    <div class="row between">
      <div><strong>${escapeHtml(p.name)}</strong><br><span class="muted">Started ${formatDate(p.startDate)}</span></div>
      <span class="badge ${p.status}">${p.status}</span>
    </div>
    <p class="muted">${p.days.length} workout day${p.days.length===1?"":"s"} • ${p.days.reduce((a,d)=>a+d.exercises.length,0)} exercises</p>
    <div class="buttonRow">
      <button class="secondary small" data-edit-programme="${p.id}">Edit</button>
      ${p.status!=="current"?`
        <button class="secondary small" data-activate="${p.id}">Make Current</button>
        <button class="secondary small" data-delete-programme="${p.id}">Delete</button>
      `:""}
    </div>
  </div>`).join("");
  document.querySelectorAll("[data-activate]").forEach(b=>b.onclick=()=>activateProgramme(b.dataset.activate));
  document.querySelectorAll("[data-edit-programme]").forEach(b=>b.onclick=()=>openProgrammeEditor(b.dataset.editProgramme));
  document.querySelectorAll("[data-delete-programme]").forEach(b=> b.onclick=()=>deleteProgramme(b.dataset.deleteProgramme));
}

// Make the selected programme current and archive other non-draft programmes.
// Reset the selected day and unsaved workout draft, save the change, and refresh the interface.
function activateProgramme(id){
  const target = data.programmes.find(p => p.id === id);
  if(!target) return;

  // Update programme statuses without converting existing drafts into archived programmes.
  data.programmes.forEach(p => {
    p.status = p.id === id ? "current" :
      (p.status === "draft" ? "draft" : "archived");
  });

  target.status = "current";
  activeDayId = target.days[0]?.id;
  draftWorkout = {};
  document.getElementById("workoutDate").value = today();

  saveData();

  if(isFirstVisit) {
    finishWelcome();
  }

  render();
}

// Delete a non-current programme after confirmation.
// Also remove its associated workout history so the deleted programme does not leave orphaned sessions in the app.
function deleteProgramme(id){
  const programme=data.programmes.find(p=>p.id===id);
  if(!programme || programme.status==="current") return;

  const confirmed=confirm(
    `Delete "${programme.name}"?\n\nThis will also delete the workout history recorded for this programme. This cannot be undone.`
  );

  if(!confirmed) return;

  data.programmes=data.programmes.filter(p=>p.id!==id);
  data.sessions=data.sessions.filter(s=>s.programmeId!==id);

  saveData();
  render();
}

// Copy the current values from the programme editor's HTML fields into the days array.
// This must happen before rebuilding the editor, otherwise unsaved field entries
// could be lost when a day or exercise is added or removed.
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

// Generate the HTML for all workout days and their exercise fields.
// The data attributes identify each day and exercise so event handlers can
// find the correct fields when reading, updating or removing entries.
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
            <div class="unitInput">
              <input data-ex-sets="${i}-${j}" type="number" min="0" value="${e.sets??""}" aria-label="Sets">
              <span>sets</span>
            </div>
            <div class="unitInput">
              <input data-ex-reps="${i}-${j}" type="number" min="0" value="${e.reps??""}" aria-label="Reps">
              <span>reps</span>
            </div>
            <div class="weightInputRow">
              <input class="weightField" data-ex-weight="${i}-${j}" type="text" inputmode="decimal" value="${escapeHtml(e.programWeight??"")}" placeholder="kg or BW" aria-label="kg or BW">
              <button type="button" class="secondary small bwProgrammeButton" data-bw-programme="${i}-${j}">BW</button>
            </div>
            <input data-ex-note="${i}-${j}" value="${escapeHtml(e.note||"")}" placeholder="Notes" aria-label="Exercise notes">
            <button class="secondary small removeExercise" data-remove-ex="${i}-${j}">Remove</button>
          </div>`).join("")}
      </div>
      <button class="secondary small" data-add-ex="${i}">+ Exercise</button>
    </div>`).join("");
}

// Open the editor for an existing programme.
// Work on a copy of its days until Save Programme is selected, so edits are
// not written to the saved programme until the user confirms them.
function openProgrammeEditor(programmeId){
  const p=data.programmes.find(x=>x.id===programmeId);
  if(!p) return;
  document.getElementById("modalTitle").textContent=`Edit Programme: ${p.name}`;
  
  // Make a deep copy so editing the form does not directly modify the saved programme.
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

  // Read the current fields into the days array before rebuilding the editor HTML.
  const refreshDays=()=>{
    syncProgrammeEditor(days);
    document.getElementById("editDays").innerHTML=programmeEditorHtml(days);
  };

  // Handle add/remove actions for days and exercises.
  // Synchronise the existing form values first, then rebuild the HTML to reflect the change.
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

  // Set the selected programme exercise's prescribed weight to BW.
  document.getElementById("modalBody").addEventListener("click",e=>{
  if(e.target.dataset.bwProgramme!==undefined){
    const [i,j]=e.target.dataset.bwProgramme.split("-").map(Number);
    const input=document.querySelector(`[data-ex-weight="${i}-${j}"]`);
    if(input) input.value="BW";
  }
});

  // When an exercise is selected from the dropdown, copy its name into the editable
  // text field, which still allows the user to customise the name.
  document.getElementById("modalBody").addEventListener("change",e=>{
    if(e.target.dataset.exSelect!==undefined){
      const [i,j]=e.target.dataset.exSelect.split("-").map(Number);
      const nameInput=document.querySelector(`[data-ex-name="${i}-${j}"]`);
      if(nameInput && e.target.value) nameInput.value=e.target.value;
    }
  });

  // Collect the final form values, validate and normalise the stored fields,
  // preserve existing IDs where possible, and save the updated programme.
  document.getElementById("saveProgramme").onclick=()=>{
    syncProgrammeEditor(days);
    p.name=document.getElementById("editName").value.trim()||p.name;
    p.startDate=document.getElementById("editDate").value||p.startDate||today();

    // Preserve existing day and exercise IDs so references to those items remain stable.
    // Generate IDs only for new items, and exclude blank exercises and empty workout days.
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

// Open the form for creating a new programme.
// Build the workout days and exercises in a temporary array, then save the new
// programme when the user confirms creation.
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
  
  // Rebuild the displayed workout-day and exercise fields from the working days array.
  const renderDays=()=>{ document.getElementById("newDays").innerHTML=programmeEditorHtml(days); };
  document.getElementById("addDay").onclick=()=>{
    syncProgrammeEditor(days);
    days.push({name:`Day ${days.length+1}`,exercises:[{name:"",sets:3,reps:8,programWeight:null,note:""}]});
    renderDays();
  };

  // Handle adding and removing days and exercises while preserving existing field values.
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

  // Convert the completed form into a new programme object, assigning unique IDs
  // to the programme, each workout day and each exercise before saving it.
  document.getElementById("createProgramme").onclick=()=>{
    syncProgrammeEditor(days);
    days=days.map((d,di)=>({
      id:crypto.randomUUID(), name:d.name.trim()||`Day ${di+1}`,
      exercises:d.exercises.map(x=>({id:crypto.randomUUID(),name:x.name.trim(),sets:Number(x.sets)||0,reps:Number(x.reps)||0,programWeight:normaliseWeight(x.programWeight),note:x.note||""})).filter(x=>x.name)
    })).filter(d=>d.exercises.length);
    const p={
      id:crypto.randomUUID(),
      name:document.getElementById("newName").value.trim()||"New Programme",
      startDate:document.getElementById("newDate").value||today(),
      status:isFirstVisit ? "current" : "draft",
      days
    };
    data.programmes.unshift(p);

    // During first-time setup, make the new programme current and finish the welcome process.
    // Otherwise, create it as a draft so it does not replace the user's current programme.
    if(isFirstVisit) {
      data.programmes.forEach(programme => {
        if(programme.id !== p.id && programme.status !== "draft") {
          programme.status = "archived";
        }
      });
      finishWelcome();
    }

    activeDayId=p.days[0]?.id;
    saveData();
    closeModal();
    render();
  };
  renderDays();
}

// Hide the programme editor modal.
function closeModal(){document.getElementById("modal").classList.add("hidden");}

// Save the current workout as a dated session.
// Use the user's entries where provided and suggested weights otherwise,
// then save the data, clear the draft and refresh the interface.
function saveWorkout(){
  const p=currentProgramme(), d=currentDay();
  if(!p||!d)return;
  const workoutDate=document.getElementById("workoutDate").value||today();
  
  // Build the saved exercise records, normalising weights and retaining actual reps
  // and the progression choice for the next session.
  const exercises=d.exercises.map(ex=>{
    const x=draftWorkout[ex.id]||{};
    const rawWeight=x.weight!==undefined && x.weight!=="" ? x.weight : suggestedWeight(ex);
    return {name:ex.name, weight:normaliseWeight(rawWeight), reps:x.reps||"", progression:x.progression||"maintain"};
  });
  
  // Add this workout to the session history with its date, programme, day and notes.
  data.sessions.push({id:crypto.randomUUID(),date:workoutDate,programmeId:p.id,programmeName:p.name,dayId:d.id,dayName:d.name,exercises,notes:document.getElementById("sessionNotes").value});
  saveData();
  draftWorkout={};
  document.getElementById("sessionNotes").value="";
  document.getElementById("workoutDate").value=today();
  document.getElementById("saveMessage").textContent="Workout saved.";
  render();
  setTimeout(()=>document.getElementById("saveMessage").textContent="",2500);
}

// Escape HTML special characters before inserting user-provided text into generated HTML.
// This helps prevent entered programme or exercise names from being interpreted as HTML.
function escapeHtml(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}

// Connect the page controls to their actions.
// These event handlers respond to tab changes, workout selection, saving,
// programme editing, backup and restore, and other interface actions.
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{
  document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));
  document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active"));
  b.classList.add("active"); document.getElementById(b.dataset.screen+"Screen").classList.add("active");
});

// When the workout day changes, discard the unsaved draft for the previous day
// and display the newly selected day's exercises.
document.getElementById("daySelect").onchange=e=>{activeDayId=e.target.value;draftWorkout={};renderWorkout();};
document.getElementById("saveSession").onclick=saveWorkout;
document.getElementById("newProgramme").onclick=openNewProgramme;
document.getElementById("createOwnProgramme").onclick = openNewProgramme;
document.getElementById("exportBackup").onclick=exportBackup;

// Open the file picker so the user can select a backup to restore.
document.getElementById("importBackup").onclick=()=>{
  document.getElementById("backupFile").click();
};

// Process the selected backup file, then clear the file input so the same file
// can be selected again if needed.
document.getElementById("backupFile").onchange=async e=>{
  const file=e.target.files[0];
  if(file) await importBackup(file);
  e.target.value="";
};

document.getElementById("closeModal").onclick=closeModal;
document.getElementById("exerciseHistorySelect").onchange=renderExerciseHistory;
document.getElementById("installHint").onclick=()=>alert("To install this app, open it in your phone's browser, then use the browser's menu or Share option and choose Add to Home Screen.");
if("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js?v=3").catch(()=>{});

// Clear all saved app data in this browser after confirmation.
// Reload the app so it starts again with the first-visit setup.
// This removes the stored data for this app, so users should export a backup first.
document.getElementById("resetTestData").onclick = () => {
  const confirmed = confirm(
    "Reset the app in this browser?\n\n" +
    "This will delete all programmes, workout history and progression " +
    "saved by this app in this browser. Export a backup first if needed."
  );

  if(!confirmed) return;

  localStorage.removeItem(KEY);
  location.reload();
};

// Initialise the interface using saved data, load the exercise library,
// and show the welcome screen if this browser has not used the app before.
render();
loadExerciseLibrary().then(render);

if(isFirstVisit) {
  showWelcome();
}
