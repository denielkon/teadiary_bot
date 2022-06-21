const TelegramApi = require('node-telegram-bot-api')
const express = require('express')
const userRouter = require('./routes/routes')
const state = require('./state')
const { Pool } = require('pg')
const { pool } = require('./db')
const controllers = require('./controllers/controllers')

const PORT = process.env.PORT || 8080
const app = express()
require('dotenv').config()
const opt = { polling: true }
const bot = new TelegramApi(process.env.BOT_TOKEN, opt)

let isTea;
let index;
let User = {};
let myReview = [];

//app.use(express.json())
app.use('/api', userRouter)
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
         /* let flag = 0;
          for (let i = 0; i < state.users.length; i++) {
             if (state.users[i].id == msg.from.id) {
                flag++
             }
          }
          if (flag == 0) {
             User.id = msg.from.id;
             User.cou = 0;
             User.newTea = {};
             User.teaFlag = 0;
             let clone = {};
 
             for (let key in User) {
                clone[key] = User[key];
             }
             state.users.push(clone)
          }*/
         //Router.post('/user',UserController.createUser)

         controllers.createUser(msg.chat.id, 0, 0)

         return bot.sendMessage(chatId, `Добро пожаловать в чайный дневник, ${msg.from.first_name}! Ты можешь посмотреть отзывы о чае или написать свой.`, getMainMenu);
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
      let reviewFlag = 0;
      let numberReview = 0;

      if (text === 'Мои отзывы') {
         myReview.length = 0;
         console.log(state.stateRewiew);
         for (let i = 0; i < state.stateRewiew.length; i++) {
            if (msg.from.id === state.stateRewiew[i].userId) {
               reviewFlag++
               console.log(state.stateRewiew);
               myReview[i] = state.stateRewiew[i]
            }
         }
         myReview = myReview.filter(Boolean);

         for (let i = 0; i < reviewFlag; i++) {
            myReview[i].numberReview = ++numberReview;
         }

         result = myReview.map((item) =>
            `${item.numberReview}. ${item.autorName}\n${item.name}, ${item.rating}\n${item.description}\n\n`);
         result = result.join('');
         if (reviewFlag > 0) {
            bot.sendMessage(chatId, `${result}`, reviewDelete)
         }
         if (reviewFlag === 0) {
            bot.sendMessage(chatId, `У вас пока нет отзывов`)
         }
      }
      if (text === 'Добавить отзыв') {
         return bot.sendMessage(chatId, 'На какой чай хотите добавить отзыв?', lookOptionsForAdd);
      }

   })

   bot.on('callback_query', (msg) => {

      data = msg.data;
      const chatId = msg.message.chat.id;
      let result;
      function showRates(teaKind) {
         let thisTea = []
         for (let i = 0; i < state.stateRating.length; i++) {
            if (state.stateRating[i].isTea == teaKind) {
               thisTea[i] = state.stateRating[i]
            }
         }
         if (thisTea.length == 0) {
            bot.sendMessage(chatId, 'Пока что нет рейнтигов и отзывов на такие чаи.')
         } else {
            result = thisTea.map((item) =>
               `${item.name}, <strong>${item.rating}</strong>  \n\n`);
            result = result.join('');
            bot.sendMessage(chatId, `${result}`, { parse_mode: "HTML" })
         }
      }
      if (data == 'puerShuRate') {
         showRates(1)
      }
      if (data == 'puerShenRate') {
         showRates(2)
      }
      if (data == 'ulunRate') {
         showRates(3)
      }
      if (data == 'greenRate') {
         showRates(4)
      }
      if (data == 'redRate') {
         showRates(5)
      }
      function showReview(teaKind) {
         let thisTea = []
         for (let i = 0; i < state.stateRewiew.length; i++) {
            if (state.stateRewiew[i].isTea == teaKind) {
               thisTea[i] = state.stateRewiew[i]
            }
         }
         if (thisTea.length == 0) {
            bot.sendMessage(chatId, 'Пока что нет отзывов на такие чаи.')
         } else {
            result = thisTea.map((item) =>
               `${item.autorName}\n<b>${item.name}, ${item.rating}</b>\n${item.description}\n\n`);
            result = result.join('');
            bot.sendMessage(chatId, `${result}`, { parse_mode: "HTML" })
         }
      }
      if (data == 'puerShuView') {
         showReview(1)
      }
      if (data == 'puerShenView') {
         showReview(2)
      }
      if (data == 'redView') {
         showReview(5)
      }
      if (data == 'ulunView') {
         showReview(3)
      }
      if (data == 'greenView') {
         showReview(4)
      }
      for (let i = 0; i < state.users.length; i++) {
         if (msg.from.id == state.users[i].id) {
            let userIndex
            userIndex = state.users.findIndex(item => item.id == state.users[i].id);
            //console.log(userIndex);
            let teaName, description, rating;
            let flag
            if ((data == 'puerShuAdd') || (data == 'puerShenAdd') || (data == 'ulunAdd') || (data == 'redAdd') || (data == 'greenAdd')) {
               isTea = data;
               bot.sendMessage(chatId, 'Введите название чая');
               state.users[i].teaFlag = 1
               state.users[i].cou = 1
               flag = 0

               if ((state.users[i].teaFlag == 1) && (msg.from.id == state.users[i].id)) {
                  bot.on('message', async msg => {
                     flag++
                     if ((state.users[i].cou === 1) && (flag === 1) && (msg.from.id == state.users[i].id)) {
                        teaName = msg.text;
                        setname(teaName)
                        bot.sendMessage(chatId, 'Напишите описание')
                        state.users[i].cou++
                        flag += 2
                     }


                     if ((state.users[i].cou == 2) && (flag === 4) && (msg.from.id == state.users[i].id)) {

                        description = msg.text
                        setdes(description)
                        state.users[i].cou++
                        flag += 2
                     }


                     console.log(flag);
                     if ((state.users[i].cou == 3) && (flag === 6) && (msg.from.id == state.users[i].id)) {
                        bot.sendMessage(chatId, 'Поставьте рейтинг', showRateNumber);
                        state.users[i].cou = 0;
                        console.log(state.users[i].newTea);
                        flag = 0
                     }


                  })
                  flag = 0
               }
               flag = 0
               state.users[i].teaFlag = 0;

               function setname(name) {
                  state.users[i].newTea.name = name

               }
               function setdes(des) {
                  state.users[i].newTea.description = des

               }

            }
            if ((data == '1') || (data == '2') || (data == '3') || (data == '4') || (data == '5') || (data == '6') || (data == '7') || (data == '8') || (data == '9') || (data == '10')) {
               rating = +data;
               state.users[i].newTea.rating = rating;
               state.users[i].newTea.id = state.stateRewiew.length + 1;
               state.users[i].newTea.userId = msg.from.id
               if (isTea === 'puerShuAdd') {
                  state.users[i].newTea.isTea = 1
               }
               if (isTea === 'puerShenAdd') {
                  state.users[i].newTea.isTea = 2
               }
               if (isTea === 'ulunAdd') {
                  state.users[i].newTea.isTea = 3
               }
               if (isTea === 'redAdd') {
                  state.users[i].newTea.isTea = 5
               }
               if (isTea === 'greenAdd') {
                  state.users[i].newTea.isTea = 4
               }

               state.users[i].newTea.autorName = msg.from.first_name;
               if (msg.from.last_name !== undefined) {
                  state.users[i].newTea.autorName = `${msg.from.first_name} ${msg.from.last_name}`;
               } else {
                  state.users[i].newTea.autorName = msg.from.first_name;
               }

               bot.sendMessage(chatId, `${state.users[i].newTea.autorName}\n${state.users[i].newTea.name}, ${state.users[i].newTea.rating} \n${state.users[i].newTea.description}\n\n Записать чай?`, reviewAction, { parse_mode: "HTML" });
            }

            if (data == 'addTeaToState') {
               bot.sendMessage(chatId, 'Отлично! Вы добавили отзыв.')

               let clone = {};

               for (let key in state.users[i].newTea) {
                  clone[key] = state.users[i].newTea[key];
               }
               let clone2 = {
                  id: state.stateRating.id++,
                  name: state.users[i].newTea.name,
                  isTea: state.users[i].newTea.isTea,
                  rating: state.users[i].newTea.rating,
                  review_times: 1
               }
               let flag = 0;
               let rate = 0;
               for (let i = 0; i < state.stateRating.length; i++) {
                  if (state.stateRating[i].name == clone.name) {
                     state.stateRating[i].review_times++;
                     for (let j = 0; j < state.stateRewiew.length; j++) {
                        if (clone.name == state.stateRewiew[j].name) {
                           rate += state.stateRewiew[j].rating
                        }
                     }
                     state.stateRating[i].rating = (rate + clone.rating) / state.stateRating[i].review_times;
                     state.stateRating[i].rating = Math.floor(state.stateRating[i].rating * 100) / 100
                     flag++
                  }
               }
               if (flag === 0) {
                  state.stateRating.push(clone2);
               }
               state.stateRewiew.push(clone);
               state.users[i].newTea = {}

            }
         }
      }
      let deleteId;
      if (data == 'teaDelete') {
         bot.sendMessage(chatId, 'Введите номер отзыва, который хотите удалить');
         let count = 0
         bot.on('message', msg => {
            count++
            if (count === 1) {
               index = msg.text - 1
               deleteId = myReview[index].id
               deleteId = state.stateRewiew.findIndex(item => item.id == deleteId)
               state.stateRewiew.splice(deleteId, 1)
               bot.sendMessage(chatId, 'Ваш отзыв успешно удалён.')
               for (let i = 0; i < state.stateRating.length; i++) {

                  if ((state.stateRating[i].name == myReview[index].name) && (state.stateRating[i].review_times == 1)) {
                     deleteId = state.stateRating.findIndex(item => item.name == myReview[index].name)
                     state.stateRating.splice(deleteId, 1)
                  } else if ((state.stateRating[i].name == myReview[index].name) && (state.stateRating[i].review_times > 1)) {
                     let rate = 0;
                     state.stateRating[i].review_times -= 1
                     for (let j = 0; j < state.stateRewiew.length; j++) {
                        if (myReview[index].name == state.stateRewiew[j].name) {
                           rate += state.stateRewiew[j].rating
                        }
                     }
                     state.stateRating[i].rating = rate / state.stateRating[i].review_times
                     state.stateRating[i].rating = Math.floor(state.stateRating[i].rating * 100) / 100
                  }
               }

            }
         })
      }
   })
   bot.on('polling_error', (err) => console.log(err))

}

start()
