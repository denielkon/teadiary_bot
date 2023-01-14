const TelegramApi = require('node-telegram-bot-api')
const express = require('express')
const Router = require('express');
const controllers = require('./controllers/controllers');
const { checkLengthAndSendMessages, translateTeaKindToText } = require('./functions.js');

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
   const lookOptionsForRate = {
      reply_markup: JSON.stringify({
         inline_keyboard: [
            [{ text: 'Шу Пуэр', callback_data: 'puerShuRate' }, { text: 'Шен Пуэр', callback_data: 'puerShenRate' }],
            [{ text: 'Улун', callback_data: 'ulunRate' }, { text: 'Зелёный', callback_data: 'greenRate' }],
            [{ text: 'Красный', callback_data: 'redRate' }, { text: 'Белый', callback_data: 'whiteRate' }]
         ]
      })
   }
   const lookOptionsForAdd = {
      remove_keyboard: true,
      reply_markup: JSON.stringify({
         inline_keyboard: [
            [{ text: 'Шу Пуэр', callback_data: 'puerShuAdd' }, { text: 'Шен Пуэр', callback_data: 'puerShenAdd' }],
            [{ text: 'Улун', callback_data: 'ulunAdd' }, { text: 'Зелёный', callback_data: 'greenAdd' }],
            [{ text: 'Красный', callback_data: 'redAdd' }, { text: 'Белый', callback_data: 'whiteAdd' }]
         ]
      })
   }
   const lookOptionsForDescription = {
      reply_markup: JSON.stringify({
         inline_keyboard: [
            [{ text: 'Шу Пуэр', callback_data: 'puerShuView' }, { text: 'Шен Пуэр', callback_data: 'puerShenView' }],
            [{ text: 'Улун', callback_data: 'ulunView' }, { text: 'Зелёный', callback_data: 'greenView' }],
            [{ text: 'Красный', callback_data: 'redView' }, { text: 'Белый', callback_data: 'whiteView' }]

         ]
      })
   }
   const reviewAction = {
      reply_markup: JSON.stringify({
         inline_keyboard: [
            [{ text: 'Да', callback_data: 'addTeaToState' }],
            [{ text: 'Начать ввод заново', callback_data: 'addTeaToStateAgain' }],
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
         let users = [];
         controllers.getUser(function (result) {
            users = result.rows;
            let newUserflag = 0;
            for (let i = 0; i < users.length; i++) {
               if (users[i].userid == msg.from.id) {
                  newUserflag = 1;
               }
            }
            if (newUserflag === 0) {
               controllers.createUser(msg.from.id);
            }
         })
         return bot.sendMessage(chatId, `Добро пожаловать в чайный дневник, ${msg.from.first_name}! Ты можешь посмотреть отзывы о чае или написать свой`, getMainMenu);
      }
      if (text === '/mail') {
         return bot.sendMessage(chatId, 'football-forever@bk.ru \n Применимо на сайте <a href="https://moychay.ru/">Мойчай.ру</a>', { parse_mode: "HTML" })
      }
      if (text === 'Посмотреть рейтинги') {
         return bot.sendMessage(chatId, 'Выберете вид чая', lookOptionsForRate);
      }
      if (text === 'Все отзывы') {
         return bot.sendMessage(chatId, 'Выберете вид чая', lookOptionsForDescription);
      }
      
      if (text === 'Мои отзывы') {
         controllers.getMyReview(msg.from.id, function (result) {
            let myReview = result.rows;
            let numberReview = 0;
            if (myReview.length === 0) {
               bot.sendMessage(chatId, `У вас пока нет отзывов`)
            } else {
               for (let i = 0; i < myReview.length; i++) {
                  myReview[i].numberReview = ++numberReview;
               }
               result = myReview.map((item) =>
                  `${item.numberReview}. ${item.teaname}, ${item.rating}\n${item.teadescription}\n\n`).join('');
               checkLengthAndSendMessages(bot, result, chatId, reviewDelete);
            }
         })
      }
      if (text === 'Добавить отзыв') {
         controllers.setTeaName(0, chatId)
         controllers.setTeaDes(0, chatId)
         controllers.setTeaRating(0, chatId)
         return bot.sendMessage(chatId, 'На какой чай хотите добавить отзыв?', lookOptionsForAdd);
      }
   })

   bot.on('callback_query', (msg) => {
      data = msg.data;
      const chatId = msg.message.chat.id;
      function showRates(thisTea, thisTeaKind) {
         if (thisTea.length == 0) {
            bot.sendMessage(chatId, 'Пока что нет отзывов на такие чаи')
         } else {
            const setTea = [...new Set(thisTea.map(item => { return item.teaname }))];
            const ratesTea = [];
            for (let i = 0; i < setTea.length; i++) { 
               ratesTea.push({ teaname: setTea[i], rating: 0, reviewTimes: 0 });
            }
            for (let i = 0; i < ratesTea.length; i++) {
               for (let j = 0; j < thisTea.length; j++) {
                  if (ratesTea[i].teaname.toLowerCase() === thisTea[j].teaname.toLowerCase()) {
                     ratesTea[i].rating += thisTea[j].rating;
                     ratesTea[i].reviewTimes++;
                  }   
               }
            }
            let rateMessage = ratesTea.map((item) =>
               `${item.teaname}, <strong>${
                  Math.floor(item.rating / item.reviewTimes * 100) / 100
               }</strong>\n\n`);
               rateMessage = `<strong>${thisTeaKind}</strong>\n\n\n${rateMessage.join('')}`;
            checkLengthAndSendMessages(bot, rateMessage, chatId, { parse_mode: "HTML" });
         }
      }
      function showReview(thisTea, thisTeaKind) {
         if (thisTea.length == 0) {
            bot.sendMessage(chatId, 'Пока что нет отзывов на такие чаи')
         } else {
            let reviewMessage = thisTea.map((item) =>
               `${item.autorname}\n<b>${item.teaname}, ${item.rating}</b>\n${item.teadescription}\n\n`);
               reviewMessage = `<strong>${thisTeaKind}</strong>\n\n\n${reviewMessage.join('')}`
            checkLengthAndSendMessages(bot, reviewMessage, chatId, { parse_mode: "HTML" });
         }
      }

      if (data.includes('View') || data.includes('Rate')) {
         let teaKindFordb, teaKind;
         if (data.includes('puerShu')) teaKindFordb = 1;
         if (data.includes('puerShen')) teaKindFordb = 2;
         if (data.includes('ulun')) teaKindFordb = 3;
         if (data.includes('green')) teaKindFordb = 4;
         if (data.includes('red')) teaKindFordb = 5;
         if (data.includes('white')) teaKindFordb = 6;
         teaKind = translateTeaKindToText(teaKindFordb);
         controllers.getReviews(teaKindFordb, function (result) {
            if (data.includes('View')) {
               showReview(result.rows, teaKind);
            } else showRates(result.rows, teaKind);
         }) 
      }

      if (data == 'addTeaToStateAgain') {
         return bot.sendMessage(chatId, 'На какой чай хотите добавить отзыв?', lookOptionsForAdd);
      }

      controllers.getUser(function (result) {
         let users = result.rows;
         for (let i = 0; i < users.length; i++) {
            users[i].newTea = {};
            if (msg.from.id == users[i].userid) {
               let teaName, description;
               if ((data == 'puerShuAdd') || (data == 'puerShenAdd') || (data == 'ulunAdd') || (data == 'redAdd') || (data == 'greenAdd') || (data == 'whiteAdd')) {
                  isTea = data;
                  if (isTea === 'puerShuAdd') controllers.setTeaIsTea(1, msg.from.id);
                  if (isTea === 'puerShenAdd') controllers.setTeaIsTea(2, msg.from.id);
                  if (isTea === 'ulunAdd') controllers.setTeaIsTea(3, msg.from.id);
                  if (isTea === 'greenAdd') controllers.setTeaIsTea(4, msg.from.id);
                  if (isTea === 'redAdd') controllers.setTeaIsTea(5, msg.from.id);
                  if (isTea === 'whiteAdd') controllers.setTeaIsTea(6, msg.from.id);
                  bot.sendMessage(chatId, 'Введите название чая');
                  users[i].teaFlag = 1;
                  if ((users[i].teaFlag == 1) && (msg.from.id == users[i].userid)) {
                     controllers.getNewTea(msg.from.id, function (result) {
                        users[i].counter = 1;
                        users[i].newTea = result.rows[0];
                        if ((users[i].newTea.teaname == '0') && (msg.from.id == users[i].userid)) {
                           bot.on('message', msg => {
                              if ((users[i].newTea.teaname == '0') && (msg.from.id == users[i].userid)) {
                                 if ((msg.text == "/start") || (msg.text == "Добавить отзыв") || (msg.text == "Посмотреть рейтинги") || (msg.text == "Все отзывы") || (msg.text == "Мои отзывы")) {
                                    return users[i].teaFlag = 0;
                                 }
                                 teaName = msg.text;
                                 users[i].newTea.teaname = teaName;
                                 controllers.setTeaName(teaName, msg.from.id);
                                 setDescription();
                                 bot.sendMessage(chatId, 'Напишите описание');
                              }
                           })
                        }

                        function setDescription() {
                           if ((users[i].newTea.teaname !== '0') && (msg.from.id == users[i].userid)) {
                              bot.on('message', msg => {
                                 if ((users[i].newTea.teadescription == '0') && (msg.from.id == users[i].userid)) {
                                    if ((msg.text == "/start") || (msg.text == "Добавить отзыв") || (msg.text == "Посмотреть рейтинги") || (msg.text == "Все отзывы") || (msg.text == "Мои отзывы")) {
                                       return users[i].teaFlag = 0;
                                    }
                                    description = msg.text;
                                    users[i].newTea.teadescription = description;
                                    controllers.setTeaDes(description, msg.from.id);
                                    if (users[i].newTea.teaname !== users[i].newTea.teadescription) {
                                       setRating();
                                    }
                                 }
                              })
                           }
                        }
                        function setRating() {
                           if ((users[i].newTea.teadescription !== '0') && (msg.from.id == users[i].userid)) {
                              bot.sendMessage(chatId, 'Поставьте рейтинг', showRateNumber);
                           }
                        }
                     })
                  }
               }
               if ((data == '1') || (data == '2') || (data == '3') || (data == '4') || (data == '5') || (data == '6') || (data == '7') || (data == '8') || (data == '9') || (data == '10')) {
                  controllers.getNewTea(msg.from.id, function (result) {
                     users[i].newTea = result.rows[0];
                     users[i].newTea.rating = +data;
                     controllers.setTeaRating(+data, msg.from.id);
                     users[i].newTea.userId = msg.from.id;
                     if (msg.from.last_name) {
                        users[i].newTea.autorname = `${msg.from.first_name} ${msg.from.last_name}`;
                        controllers.setTeaAutor(users[i].newTea.autorname, msg.from.id)
                     } else {
                        users[i].newTea.autorname = msg.from.first_name;
                        controllers.setTeaAutor(users[i].newTea.autorname, msg.from.id)
                     }
                     const teaKind = translateTeaKindToText(users[i].newTea.istea);
                     bot.sendMessage(chatId, `${users[i].newTea.autorname}\n${teaKind}\n${users[i].newTea.teaname}, ${users[i].newTea.rating} \n${users[i].newTea.teadescription}\n\nЗаписать чай?`, reviewAction, { parse_mode: "HTML" });
                  })
               }
               if (data == 'addTeaToState') {
                  bot.sendMessage(chatId, 'Отлично! Вы добавили отзыв');
                  controllers.getNewTea(msg.from.id, function (result) {
                     users[i].newTea = result.rows[0];
                     controllers.createNewTea(users[i]);
                     const teaKind = translateTeaKindToText(users[i].newTea.istea);
                     bot.sendMessage(-374465935, `<strong>${users[i].newTea.autorname}</strong> добавляет новый отзыв\n\n${teaKind}\n<strong>${users[i].newTea.teaname}, ${users[i].newTea.rating}</strong> \n${users[i].newTea.teadescription}`, { parse_mode: "HTML" });
                  })
               }
            }
         }
      })

      if (data == 'teaDelete') {
         bot.sendMessage(chatId, 'Введите номер отзыва, который хотите удалить');
         let count = 0;
         bot.on('message', msg => {
            count++
            if (count === 1) {
               let deleteId;
               controllers.getMyReview(msg.from.id, function (result) {
                  let myReview = result.rows;
                  if (+msg.text <= myReview.length) {
                     let index = msg.text - 1;
                     deleteId = myReview[index].id;
                     controllers.deleteReviewTea(deleteId);
                     bot.sendMessage(chatId, 'Ваш отзыв успешно удалён');
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
