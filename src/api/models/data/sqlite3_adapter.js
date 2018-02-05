import sqlite3 from 'sqlite3';

export default class Sqlite3Adapter {
    constructor(db) {
        if (db != undefined) {
            this.db = db;
        }
    }

    rebuild_db = function() {
        var fs = require('fs');
        var script_filestream = fs.readFileSync('./api/models/data/create_db.sql');

        this.connect_to_db('./test.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
        this.query_db(() => {
            this.db.run(script_filestream.toString());
            this.close_db_connection();
        });
    }

    query_db = function(query_function) {
        try {
            this.db.serialize(query_function);
        } catch (err) {
            throw err;
        }
    }

    connect_to_db = function(url, open_mode) {
        this.db = new sqlite3.Database(url, open_mode, (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Connected to: ' + url +
                '\nIn mode: ' + open_mode);
        });
    }

    close_db_connection = function() {
        // close the database connection
        this.db.close((err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Close the database connection.');
        });
    }
}