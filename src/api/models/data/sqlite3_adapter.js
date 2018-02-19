var sqlite3 = require('sqlite3').verbose();

export default class Sqlite3Adapter {
  constructor(url, open_mode) {
    this.url = url;
    this.open_mode = open_mode;

    this.nonquery_db = this.nonquery_db.bind(this);
    this.open_connection = this.open_connection.bind(this);
    this.run_query = this.run_query.bind(this);
    this.close_connection = this.close_connection.bind(this);

  }

  insert_or_replace_into(db, table_map, params) {

    var stmt = db.prepare(`INSERT OR REPLACE INTO ` + table_map.name + `(` + params.columns.join() + `) VALUES( ? )`);
    for (var i = 0; i < 10; i++) {
      stmt.run(params.values[i]);
    }
    stmt.finalize();
  }

  nonquery_db(db_command_method, script, params, callback) {
    console.log('\nLoading Script:');
    console.log(script);
    let db = this.open_connection((err) => {
      if (err) {
        callback(err);
      }
      //Serialize Query and execute
      console.log('\nSerialize and Execute Script');
      db_command_method(db, script, params, (err) => {
        if (err) {
          callback(err);
        }
        //Close connection
        console.log('\nAttempting to close db');
        this.close_connection(db, (err) => {
          if (err) {
            callback(err);
            return;
          }
          console.log('\nQuery complete.');
          callback(null);
        });
      });
    });
  }

  open_connection(query_callback) {
    //Connect to db
    return new sqlite3.Database(this.url, this.open_mode, (err) => {
      if (err) {
        console.log('\nError: couldnt connect:', err, err.stack);
        query_callback(err);
        return;
      }
      console.log('Connected to: ' + this.url + '\nIn mode: ' + this.open_mode);
      query_callback(null);
    });
  }

  run_query(db, script, params, close_callback) {
    db.serialize(() => {
      db.run(script, params, (err) => {
        if (err) {
          console.log('\nError executing statement:', err, err.stack);
          close_callback(err);
          return;
        }
        console.log('\nScript executed.');
        close_callback(null);
      });
    });
  }

  close_connection(db, callback) {
    db.close((err) => {
      if (err) {
        console.log('\nError closing db:', err, err.stack);
        callback(err);
        return;
      }
      console.log('\nDb connection closed.');
      callback(null);
    });
  }



}
