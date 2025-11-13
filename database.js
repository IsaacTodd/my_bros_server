const root_dir  =  process.cwd();
const path = require('path');
const db_loc = path.join(root_dir,'mydb.db');
const sqlite3 = require('sqlite3');


const db = new sqlite3.Database(db_loc);

module.exports = db;