import { openDb } from './db.js' 

async function setup() {
  // Open SQLite connection
  const db = await openDb()

  // Define table schema
  await db.exec(`
    CREATE TABLE tblProjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,  
      title TEXT,
      project_link TEXT,
      description TEXT,
      main_image IMAGE,
      link_label TEXT,
      color TEXT
    );
  `)

  // Insert project data
  await db.run(
    'INSERT INTO tblProjects (title, project_link, description, link_label, color) VALUES (?, ?, ?, ?, ?)',
    'Simple Synth',
    'https://github.com/Tobias112358/simple-synth', 
    'A basic VST synthesizer with an LFO. Choose between 4 waveforms on both oscillators.',
    "Project GitHub",
    "#4d21c4"
  )

  await db.run(
    'INSERT INTO tblProjects (title, project_link, description, link_label, color) VALUES (?, ?, ?, ?, ?)',
    'FM Oscillator - WASM',
    'https://github.com/Tobias112358/fmoscillator-wasm', 
    'An FM Synthesizer using the browser\'s native AudioContext. This is a WASM module to be used as a NodeJS package.',
    "Project GitHub",
    "#15b0ab"
  )
  
  await db.run(
    'INSERT INTO tblProjects (title, project_link, description, link_label, color) VALUES (?, ?, ?, ?, ?)',
    'COFF - Music Project',
    'https://soundcloud.com/user-959442736', 
    'An Electro-Pop music project consisting of Chris Skottun and I. Music performed, composed, produced and distributed by us.',
    "Sound Cloud",
    "#ff8c19"
  )
  // Close connection
  await db.close()  
}

setup()
  .catch(err => {
    console.error(err.message)
  })  