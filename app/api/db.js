
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

// Open SQLite database connection
export async function openDb() {
  return open({
    filename: './mydb.db',
    driver: sqlite3.Database
  })  
}