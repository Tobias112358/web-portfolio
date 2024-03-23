import { openDb } from './db.js' 

async function setup() {
  // Open SQLite connection
  const db = await openDb()

  // Define table schema
  await db.exec(`
    CREATE TABLE software (
      id INTEGER PRIMARY KEY AUTOINCREMENT,  
      title TEXT,
      github_url TEXT,
      description TEXT,
      main_image IMAGE
    );
  `)

  // Insert dummy data
  await db.run(
    'INSERT INTO software (title, github_url, description) VALUES (?, ?, ?)',
    'Simple Synth',
    'https://github.com/Tobias112358/simple-synth', 
    'A basic VST synthesizer with an LFO. Choose between 4 waveforms on both oscillators.'
  )
  
  // Close connection
  await db.close()  
}

setup()
  .catch(err => {
    console.error(err.message)
  })  