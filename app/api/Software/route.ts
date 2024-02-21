const sqlite3 = require("sqlite3").verbose();
import { open, Database } from 'sqlite'

export async function GET() {
    
    var db = await open({
        filename: './mydb.db',
        driver: sqlite3.Database
      })  
      // Perform a database query to retrieve all items from the "items" table
    const items =  await db.all("SELECT * FROM software");

    // Return the items as a JSON response with status 200
    return new Response(JSON.stringify(items), {
        headers: { "Content-Type": "application/json" },
        status: 200,
    });
}