const db = require('../db')
class Controllers {
   async createUser(userID, cou, teaFlag) {

      await db.query('INSERT INTO users(userID, cou, teaFlag) values($1, $2, $3) RETURNING *', [userID, cou, teaFlag])

   }
}

module.exports = new Controllers()