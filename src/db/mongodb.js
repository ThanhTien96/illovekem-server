

let mongoose = require('mongoose');
const MONGOOSE_DB = process.env.MONGOOSE_DB;
class Database {
  constructor() {
    this._connect()
  }
_connect() {
     mongoose.connect(`${MONGOOSE_DB}/test`)
       .then(() => {
         console.log('Database connection successful')
       })
       .catch(err => {
         console.error('Database connection error')
       })
  }
}

module.exports = Database;