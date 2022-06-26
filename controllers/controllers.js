const db = require('../db')

class Controllers {
   async createUser(userID) {
      await db.query('INSERT INTO newtea(userID) values($1) RETURNING *', [userID])
      await db.query('INSERT INTO users(userID) values($1) RETURNING *', [userID])

   }
   async setTeaName(teaName, id) {
      await db.query(`update newtea set teaname = '${teaName}' where userid = ${id}`)
   }
   async setTeaDes(des, id) {
      await db.query(`update newtea set teadescription = '${des}' where userid = ${id}`)
   }
   async setTeaIsTea(isTea, id) {
      await db.query(`update newtea set istea = ${isTea} where userid = ${id}`)
   }
   async setTeaAutor(autor, id) {
      await db.query(`update newtea set autorname = '${autor}' where userid = ${id}`)
   }
   async setTeaRating(rating, id) {
      await db.query(`update newtea set rating = ${rating} where userid = ${id}`)
   }
   async updateTeaRating(NewRating) {
      await db.query(`update staterating set rating = ${NewRating.rating} where id = ${NewRating.id}`)
      await db.query(`update staterating set reviewtimes = ${NewRating.reviewtimes} where id = ${NewRating.id}`)
   }
   async deleteReviewTea(id) {
      await db.query(`delete from statereview where id = ${id}`)
   }
   async deleteRatingTea(id) {
      await db.query(`delete from staterating where id = ${id}`)
   }
   async getUser(callback) {
      await db.query('SELECT * FROM users', function (err, results) {
         if (err) console.log(err)
         callback(results)
      });
   }
   async getRatings(istea, callback) {
      await db.query(`SELECT * FROM staterating where istea = ${istea}`, function (err, results) {
         if (err) console.log(err)
         callback(results)
      });
   }
   async getReviews(istea, callback) {
      await db.query(`SELECT * FROM statereview where istea = ${istea}`, function (err, results) {
         if (err) console.log(err)
         callback(results)
      });
   }
   async getNewTea(id, callback) {
      await db.query(`SELECT * FROM newtea where userid = ${id}`, function (err, results) {
         if (err) console.log(err)
         callback(results)
      });
   }
   async getMyReview(id, callback) {
      await db.query(`SELECT * FROM statereview where userid = ${id}`, function (err, results) {
         if (err) console.log(err)
         callback(results)
      });
   }
   async getStateRating(callback) {
      await db.query('SELECT * FROM staterating', function (err, results) {
         if (err) console.log(err)
         callback(results)
      });
   }
   async getStateReview(callback) {
      await db.query('SELECT * FROM statereview', function (err, results) {
         if (err) console.log(err)
         callback(results)
      });
   }
   async createNewRating(newRating) {
      await db.query('INSERT INTO staterating(teaname, istea, rating, reviewtimes) values($1, $2, $3, $4) RETURNING *', [newRating.teaname, newRating.istea, newRating.rating, newRating.reviewtimes])
   }
   async createNewTea(user) {
      await db.query('INSERT INTO statereview(userID, autorname, teaname, istea, rating, teadescription) values($1, $2, $3, $4, $5, $6) RETURNING *', [user.userid, user.newTea.autorname, user.newTea.teaname, user.newTea.istea, user.newTea.rating, user.newTea.teadescription])
   }

}

module.exports = new Controllers()
