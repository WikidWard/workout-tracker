Workout Tracker Prototype 3

Run
---
Open a terminal in this folder and run:
    python app.py
Then open http://localhost:8000

You can also open index.html directly for basic testing. Running through app.py is recommended because it loads the editable exercises.json file and the PWA service worker.

What is included
-----------------
- Automatic workout date, with the ability to enter a past date.
- Actual workout weight is stored separately from the programme weight.
- Progression is applied once when calculating the next suggested weight.
- The Next session dropdown resets to Maintain after saving a workout.
- Custom / decide next session has been removed.
- Multiple programmes can be stored and switched between.
- Current, Draft and Archived programme statuses.
- Programmes can be edited after creation.
- Workout days and exercises can be added or removed without losing entered data.
- Exercise selector uses exercises.json, which can be edited in Notepad or another text editor without changing app.js.
- Exercise names can still be typed/edited after selecting from the list.
- Workout and exercise history.

Exercise list
-------------
Edit exercises.json to add, remove or rename entries in the exercise selector. Keep the file as a simple JSON list of quoted exercise names.

Important
---------
This prototype stores workout data in browser localStorage. It is not yet a synchronised or backed-up database. Do not rely on it as the only copy of important workout history until backup/export/restore is added.

If an older version of the app appears after updating
-------------------------------------------------------
The service worker has been versioned in Prototype 3. If the browser still shows an old screen, close the tab, reopen http://localhost:8000 and hard refresh with Ctrl+F5.

Prototype 4 change:
- Weight fields now accept normal numeric weights or BW for bodyweight exercises.
- BW is stored as text and displayed as BW rather than 0 kg.
- Progression on BW is treated as Maintain.
- Programme weight fields also accept BW.
