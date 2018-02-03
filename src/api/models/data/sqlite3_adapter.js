import sqlite3 from 'sqlite3';

export default class Sqlite3Adapter {
  constructor(db) {
    if (db != undefined) {
      this.db = db;
    }
  }

  connect_to_in_memory_db = function() {
    this.connect_to_db(':memory:');
  }

  rebuild_db = function() {
    var script = fs.readFileSync('create_db.sql')
    connect_to_db(':memory:', sqlite3.OPEN_CREATE);
    query_db(() => {})
  }

  const query_db = function(query_function) {
    try { db.serialize(query_function); }
    catch(err) { throw err; }
  }

  const connect_to_db = function(url, open_mode) {
    this.db = new sqlite3.Database(url, open_mode, (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Connected to the in-memory SQlite database.');
    });
  }

  const close_db_connection = function() {
    // close the database connection
    db.close((err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Close the database connection.');
    });
  }




}
