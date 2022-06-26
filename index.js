const TelegramApi = require('node-telegram-bot-api')
const express = require('express')
const Router = require('express');
const controllers = require('./controllers/controllers')

const PORT = process.env.PORT || 8080
const app = express()

require('dotenv').config()
const opt = { polling: true }
const bot = new TelegramApi(process.env.BOT_TOKEN, opt)




app.use(express.json())
app.use('/api', Router)
app.listen(PORT, () => {
   console.log(`App running on port ${PORT}.`)
})


const start = () => {
   bot.setMyCommands([
      { command: '/start', description: 'Начальное приветствие' },
      { command: '/mail', description: 'Напомнить почту Алана' }
   ])


   const getMainMenu = {
      reply_markup: JSON.stringify({
         resize_keyboard: true,

         keyboard: [
            [{ text: 'Посмотреть рейтинги' }, { text: 'Все отзывы' }],
            [{ text: 'Добавить отзыв' }, { text: 'Мои отзывы' }],

         ]
      })
   }
   const lookOptions = {
      reply_markup: JSON.stringify({
         inline_keyboard: [
            [{ text: 'Шу Пуэр', callback_data: 'puerShuRate' }, { text: 'Шен Пуэр', callback_data: 'puerShenRate' }],
            [{ text: 'Улун', callback_data: 'ulunRate' }, { text: 'Зелёный', callback_data: 'greenRate' }],
            [{ text: 'Красный', callback_data: 'redRate' }]
         ]
      })
   }
   const lookOptionsForAdd = {
      remove_keyboard: true,
      reply_markup: JSON.stringify({
         inline_keyboard: [
            [{ text: 'Шу Пуэр', callback_data: 'puerShuAdd' }, { text: 'Шен Пуэр', callback_data: 'puerShenAdd' }],
            [{ text: 'Улун', callback_data: 'ulunAdd' }, { text: 'Зелёный', callback_data: 'greenAdd' }],
            [{ text: 'Красный', callback_data: 'redAdd' }]
         ]
      })
   }
   const lookOptionsWithDescription = {
      reply_markup: JSON.stringify({
         inline_keyboard: [
            [{ text: 'Шу Пуэр', callback_data: 'puerShuView' }, { text: 'Шен Пуэр', callback_data: 'puerShenView' }],
            [{ text: 'Улун', callback_data: 'ulunView' }, { text: 'Зелёный', callback_data: 'greenView' }],
            [{ text: 'Красный', callback_data: 'redView' }]

         ]
      })
   }
   const reviewAction = {
      reply_markup: JSON.stringify({
         inline_keyboard: [
            [{ text: 'Да', callback_data: 'addTeaToState' }],
         ]
      })
   }
   const reviewDelete = {
      reply_markup: JSON.stringify({
         inline_keyboard: [
            [{ text: 'Удалить отзыв', callback_data: 'teaDelete' }],
         ]
      })
   }

   const showRateNumber = {

      reply_markup: JSON.stringify({
         inline_keyboard: [
            [{ text: '1 💩', callback_data: '1' }, { text: '2 🤢', callback_data: '2' }, { text: '3 🥴', callback_data: '3' }],
            [{ text: '4  😬', callback_data: '4' }, { text: '5 🤔', callback_data: '5' }, { text: '6 ☺️', callback_data: '6' }],
            [{ text: '7  😏', callback_data: '7' }, { text: '8 🥰', callback_data: '8' }, { text: '9 🤤', callback_data: '9' }],
            [{ text: '10 🔥🔥🔥', callback_data: '10' }]
         ]
      })
   }

   bot.on('message', async msg => {
      const text = msg.text;
      const chatId = msg.chat.id;

      if (text === '/start') {
         let users;
         controllers.getUser(function (result) {
            users = result.rows;
            let flag = 0;
            for (let i = 0; i < users.length; i++) {
               if (users[i].userid == msg.from.id) {
                  flag = 1
               }
            }
            if (flag == 0) {
               controllers.createUser(msg.from.id)
            }
         })

         return bot.sendMessage(chatId, `Добро пожаловать в чайный дневник, ${msg.from.first_name}! Ты можешь посмотреть отзывы о чае или написать свой`, getMainMenu);
      }
      if (text === '/mail') {
         return bot.sendMessage(chatId, 'football-forever@bk.ru \n Применимо на сайте <a href="https://moychay.ru/">Мойчай.ру</a>', { parse_mode: "HTML" })
      }
      if (text === 'Посмотреть рейтинги') {
         return bot.sendMessage(chatId, 'Выберете вид чая', lookOptions);
      }
      if (text === 'Все отзывы') {
         return bot.sendMessage(chatId, 'Выберете вид чая', lookOptionsWithDescription);
      }
      if (text === 'Мои отзывы') {
         let myReview = [];
         myReview.length = 0;
         let numberReview = 0;
         controllers.getMyReview(msg.from.id, function (result) {
            let myReview = result.rows;
            for (let i = 0; i < myReview.length; i++) {
               myReview[i].numberReview = ++numberReview;
            }
            if (myReview.length === 0) {
               bot.sendMessage(chatId, `У вас пока нет отзывов`)
            } else {
               result = myReview.map((item) =>
                  `${item.numberReview}. ${item.autorname}\n${item.teaname}, ${item.rating}\n${item.teadescription}\n\n`);
               result = result.join('');
               bot.sendMessage(chatId, `${result}`, reviewDelete)
            }
         })
      }
      if (text === 'Добавить отзыв') {
         return bot.sendMessage(chatId, 'На какой чай хотите добавить отзыв?', lookOptionsForAdd);
      }
   })

   bot.on('callback_query', (msg) => {
      data = msg.data;
      const chatId = msg.message.chat.id;
      let result;
      function showRates(thisTea) {
         if (thisTea.length == 0) {
            bot.sendMessage(chatId, 'Пока что нет рейнтигов и отзывов на такие чаи')
         } else {
            result = thisTea.map((item) =>
               `${item.teaname}, <strong>${item.rating}</strong>  \n\n`);
            result = result.join('');
            bot.sendMessage(chatId, `${result}`, { parse_mode: "HTML" })
         }
      }
      if (data == 'puerShuRate') {
         controllers.getRatings(1, function (result) {
            thisTea = result.rows
            showRates(thisTea)
         })
      }
      if (data == 'puerShenRate') {
         controllers.getRatings(2, function (result) {
            thisTea = result.rows
            showRates(thisTea)
         })
      }
      if (data == 'ulunRate') {
         controllers.getRatings(3, function (result) {
            thisTea = result.rows
            showRates(thisTea)
         })
      }
      if (data == 'greenRate') {
         controllers.getRatings(4, function (result) {
            thisTea = result.rows
            showRates(thisTea)
         })
      }
      if (data == 'redRate') {
         controllers.getRatings(5, function (result) {
            thisTea = result.rows
            showRates(thisTea)
         })
      }
      function showReview(thisTea) {
         if (thisTea.length == 0) {
            bot.sendMessage(chatId, 'Пока что нет отзывов на такие чаи')
         } else {
            result = thisTea.map((item) =>
               `${item.autorname}\n<b>${item.teaname}, ${item.rating}</b>\n${item.teadescription}\n\n`);
            result = result.join('');
            bot.sendMessage(chatId, `${result}`, { parse_mode: "HTML" })
         }
      }
      if (data == 'puerShuView') {
         controllers.getReviews(1, function (result) {
            thisTea = result.rows
            showReview(thisTea)
         })
      }
      if (data == 'puerShenView') {
         controllers.getReviews(2, function (result) {
            thisTea = result.rows
            showReview(thisTea)
         })
      }
      if (data == 'redView') {
         controllers.getReviews(5, function (result) {
            thisTea = result.rows
            showReview(thisTea)
         })
      }
      if (data == 'ulunView') {
         controllers.getReviews(3, function (result) {
            thisTea = result.rows
            showReview(thisTea)
         })
      }
      if (data == 'greenView') {
         controllers.getReviews(4, function (result) {
            thisTea = result.rows
            showReview(thisTea)
         })
      }

      controllers.getUser(function (result) {
         let users = result.rows
         for (let i = 0; i < users.length; i++) {
            users[i].newTea = {}
            if (msg.from.id == users[i].userid) {

               let teaName, description, rating;
               let flag

               if ((data == 'puerShuAdd') || (data == 'puerShenAdd') || (data == 'ulunAdd') || (data == 'redAdd') || (data == 'greenAdd')) {
                  isTea = data;
                  if (isTea === 'puerShuAdd') {
                     controllers.setTeaIsTea(1, msg.from.id)
                  }
                  if (isTea === 'puerShenAdd') {
                     controllers.setTeaIsTea(2, msg.from.id)
                  }
                  if (isTea === 'ulunAdd') {
                     controllers.setTeaIsTea(3, msg.from.id)
                  }
                  if (isTea === 'greenAdd') {
                     controllers.setTeaIsTea(4, msg.from.id)
                  }
                  if (isTea === 'redAdd') {
                     controllers.setTeaIsTea(5, msg.from.id)
                  }

                  bot.sendMessage(chatId, 'Введите название чая');
                  users[i].teaFlag = 1
                  users[i].cou = 1
                  flag = 0

                  if ((users[i].teaFlag == 1) && (msg.from.id == users[i].userid)) {
                     bot.on('message', async msg => {
                        flag++
                        if ((users[i].cou === 1) && (flag === 1) && (msg.from.id == users[i].userid)) {
                           teaName = msg.text;
                           controllers.setTeaName(teaName, msg.from.id)
                           bot.sendMessage(chatId, 'Напишите описание')
                           users[i].cou++
                           flag += 2
                        }
                        if ((users[i].cou == 2) && (flag === 4) && (msg.from.id == users[i].userid)) {
                           description = msg.text
                           controllers.setTeaDes(description, msg.from.id)
                           users[i].cou++
                           flag += 2
                        }
                        if ((users[i].cou == 3) && (flag === 6) && (msg.from.id == users[i].userid)) {
                           bot.sendMessage(chatId, 'Поставьте рейтинг', showRateNumber);
                           users[i].cou = 0;

                           flag = 0
                        }
                     })
                     flag = 0
                  }
                  flag = 0
                  users[i].teaFlag = 0;
               }

               if ((data == '1') || (data == '2') || (data == '3') || (data == '4') || (data == '5') || (data == '6') || (data == '7') || (data == '8') || (data == '9') || (data == '10')) {
                  controllers.getNewTea(msg.from.id, function (result) {
                     users[i].newTea = result.rows[0]
                     rating = +data;
                     users[i].newTea.rating = rating;
                     controllers.setTeaRating(rating, msg.from.id)
                     users[i].newTea.userId = msg.from.id


                     if (msg.from.last_name !== undefined) {
                        users[i].newTea.autorname = `${msg.from.first_name} ${msg.from.last_name}`;
                        controllers.setTeaAutor(users[i].newTea.autorname, msg.from.id)
                     } else {
                        users[i].newTea.autorname = msg.from.first_name;
                        controllers.setTeaAutor(users[i].newTea.autorname, msg.from.id)
                     }

                     bot.sendMessage(chatId, `${users[i].newTea.autorname}\n${users[i].newTea.teaname}, ${users[i].newTea.rating} \n${users[i].newTea.teadescription}\n\n Записать чай?`, reviewAction, { parse_mode: "HTML" });
                  })
               }

               if (data == 'addTeaToState') {
                  bot.sendMessage(chatId, 'Отлично! Вы добавили отзыв')
                  controllers.getNewTea(msg.from.id, function (result) {
                     users[i].newTea = result.rows[0];
                     let user = users[i].newTea;

                     controllers.createNewTea(users[i])
                     const newRating = {
                        teaname: users[i].newTea.teaname,
                        istea: users[i].newTea.istea,
                        rating: users[i].newTea.rating,
                        reviewtimes: 1
                     }
                     controllers.getStateRating(function (result) {
                        stateRating = result.rows
                        let flag = 0;

                        if (stateRating.length > 0) {
                           for (let i = 0; i < stateRating.length; i++) {
                              if (stateRating[i].teaname == user.teaname) {
                                 stateRating[i].reviewtimes++;
                                 controllers.getStateReview(function (results) {
                                    stateReview = results.rows
                                    let rate = 0;
                                    for (let j = 0; j < stateReview.length; j++) {
                                       if (user.teaname == stateReview[j].teaname) {
                                          rate += stateReview[j].rating
                                       }
                                    }

                                    stateRating[i].rating = rate / stateRating[i].reviewtimes;
                                    stateRating[i].rating = Math.floor(stateRating[i].rating * 100) / 100
                                    controllers.updateTeaRating(stateRating[i])
                                 })

                                 flag++
                              }
                           }
                        }
                        if ((flag === 0) || (stateRating.length == 0)) {
                           controllers.createNewRating(newRating)
                        }
                     })
                  })
               }
            }
         }

      })

      if (data == 'teaDelete') {
         bot.sendMessage(chatId, 'Введите номер отзыва, который хотите удалить');
         let count = 0
         bot.on('message', msg => {

            count++
            if (count === 1) {
               let deleteId;
               controllers.getMyReview(msg.from.id, function (result) {
                  let myReview = result.rows;
                  if (+msg.text <= myReview.length) {
                     let index = msg.text - 1
                     deleteId = myReview[index].id
                     controllers.deleteReviewTea(deleteId)
                     bot.sendMessage(chatId, 'Ваш отзыв успешно удалён')
                     controllers.getStateRating(function (result) {
                        stateRating = result.rows
                        for (let i = 0; i < stateRating.length; i++) {
                           if ((stateRating[i].teaname == myReview[index].teaname) && (stateRating[i].reviewtimes == 1)) {
                              deleteId = stateRating[i].id
                              controllers.deleteRatingTea(deleteId)
                           } else if ((stateRating[i].teaname == myReview[index].teaname) && (stateRating[i].reviewtimes > 1)) {
                              stateRating[i].reviewtimes -= 1;
                              controllers.getStateReview(function (results) {
                                 stateReview = results.rows
                                 let rate = 0;
                                 for (let j = 0; j < stateReview.length; j++) {
                                    if (myReview[index].teaname == stateReview[j].teaname) {
                                       rate += stateReview[j].rating
                                    }
                                 }
                                 stateRating[i].rating = rate / stateRating[i].reviewtimes;
                                 stateRating[i].rating = Math.floor(stateRating[i].rating * 100) / 100
                                 controllers.updateTeaRating(stateRating[i])
                              })
                           }
                        }
                     })
                  } else {
                     bot.sendMessage(chatId, 'Вы ввели не число или несуществующий номер. Пожалуйста, введите существующий номер отзыва.')
                  }
               })
            }
         })
      }
   })
   bot.on('polling_error', (err) => console.log(err))

}

start()
