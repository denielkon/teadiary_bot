const TelegramApi = require('node-telegram-bot-api')



require('dotenv').config()
const opt = { polling: true }
const bot = new TelegramApi(process.env.BOT_TOKEN, opt)


const stateRewiew = {
   puer: [
      { id: 1, userId: 775038143, autorName: 'Иван Зинин', name: 'Мэнхайский пломбир', isTea: 1, rating: 8, description: 'some description' },
      { id: 2, userId: 775038132423, autorName: 'Алан Боб', name: 'ШашаньЭвэй', isTea: 1, rating: 7, description: 'some description lorem sspdpadgcc, aasdfasdvvvevesdf.' },
      { id: 3, userId: 775038169, autorName: 'Danil Okhonko', name: 'Первый', isTea: 1, rating: 9, description: 'lakdsjfjadfdf, asdfasdfasdf. Fdfjidajfjdavas, hdasdadj jdfs sdj asdfjsdf, asdhfasdjf' },
      { id: 4, userId: 775038169, autorName: 'Danil Okhonko', name: 'Второй', isTea: 1, rating: 4, description: 'lakdsjfjadfdf, asd' },
      { id: 5, userId: 775038169, autorName: 'Danil Okhonko', name: 'Третий', isTea: 1, rating: 5, description: 'lakdsjfjadfdf, asdfasdfasdf. Fdfjidajfjdavas' },
      { id: 6, userId: 775038169, autorName: 'Danil Okhonko', name: 'Второй', isTea: 1, rating: 3, description: 'lakdsjfjadfdf, asd' },
   ],
   puerShen: [
      { id: 1, autorName: 'Дмитрий Бутрин', name: 'Шен первый', isTea: 2, rating: 3, description: 'Lorem ipsum sdfasevppppd, asdf, asdfasd,a dsfasdghrr.' },
      { id: 2, autorName: 'Павел Осколков', name: 'Шен второй', isTea: 2, rating: 4, description: 'asdwwrtpfjfngjgi. jasdjfajsdf.' },
      { id: 3, userId: 775038169, autorName: 'Danil Okhonko', isTea: 2, name: 'Шен третий', rating: 2, description: 'lakdsjfjadfdf, asd' },
   ],
   ulun: [
      { id: 1, autorName: 'Иван Зинин', name: 'Да хон Пао', isTea: 3, rating: 9, description: 'Lorem ipsum sdfasevppppd, asdf, asdfasd,a dsfasdghrr.' },
      { id: 2, autorName: 'Алан Боб', name: 'Те Гуань Инь', isTea: 3, rating: 8, description: 'asdwwrtpfjfngjgi. jasdjfajsdf, asdfj asdf asdf e faef wdfdf dfasdf sfe wefeager.' },
      { id: 3, userId: 775038169, autorName: 'Danil Okhonko', isTea: 3, name: 'Улунчик', rating: 6, description: 'Улулуша фывчик' },
   ],
   red: [
      //  { id: 1, autorName: 'Дмитрий', name: 'Гуйчжоу Ван', isTea: 4, rating: 7, description: 'Lorem ipsum sdfasevppppd, asdf, asdfasd,a dsfasdghrr.' },
      //  { id: 2, autorName: 'Павел', name: 'Да Цзинь Я', isTea: 4, rating: 8, description: 'asdwwrtpfjfngjgi. jasdjfajsdf.' },
   ],
   green: [
      { id: 1, autorName: 'Дмитрий Бутрин', name: 'Зеленый 1', isTea: 5, rating: 7, description: 'Lorem ipsum sdfasevppppd, asdf, asdfasd,a dsfasdghrr.' },
      { id: 2, autorName: 'Павел Осколков', name: 'Зеленый 2', isTea: 5, rating: 8, description: 'asdwwrtpfjfngjgi. jasdjfajsdf.' },
      { id: 3, userId: 775038169, autorName: 'Danil Okhonko', isTea: 5, name: 'Зелененький', rating: 7, description: 'Зеленее чем трава в огороде' },
   ]

}
const stateRating = {
   puer: [
      { id: 1, review_times: 1, name: 'Мэнхайский пломбир', rating: 8 },
      { id: 2, review_times: 1, name: 'ШашаньЭвэй', rating: 7 },
      { id: 3, review_times: 1, name: 'Первый', rating: 9 },
      { id: 4, review_times: 2, name: 'Второй', rating: 3.5 },
      { id: 5, review_times: 1, name: 'Третий', rating: 5 },
   ],
   puerShen: [
      { id: 1, review_times: 1, name: 'Шен первый', rating: 3 },
      { id: 2, review_times: 1, name: 'Шен второй', rating: 4 },
      { id: 3, review_times: 1, name: 'Шен третий', rating: 2 },
   ],
   ulun: [
      { id: 1, review_times: 1, name: 'Да хон Пао', rating: 9 },
      { id: 2, review_times: 1, name: 'Те Гуань Инь', rating: 8 },
      { id: 3, review_times: 1, name: 'Улунчик', rating: 6 },
   ],
   red: [
      //    { id: 1, review_times: 1, name: 'Гуйчжоу Ван', rating: 7 },
      //   { id: 2, review_times: 1, name: 'Да Цзинь Я', rating: 8 },
   ],
   green: [
      { id: 1, review_times: 1, name: 'Зеленый 1', rating: 7 },
      { id: 2, review_times: 1, name: 'Зеленый 2', rating: 8 },
      { id: 3, review_times: 1, name: 'Зелененький', rating: 7 },
   ]
}
let isTea;
let index;
let newTea = {};
let myReview = [];
let myReview1 = [];
let myReview2 = [];
let myReview3 = [];
let myReview4 = [];
let myReview5 = [];
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
         myReview1.length = 0;
         myReview2.length = 0
         myReview3.length = 0
         myReview4.length = 0
         myReview5.length = 0

         for (let i = 0; i < stateRewiew.puer.length; i++) {
            if (msg.from.id === stateRewiew.puer[i].userId) {
               reviewFlag++
               myReview1[i] = stateRewiew.puer[i]
            }
         }
         for (let i = 0; i < stateRewiew.puerShen.length; i++) {
            if (msg.from.id === stateRewiew.puerShen[i].userId) {
               reviewFlag++
               myReview2[i] = stateRewiew.puerShen[i]
            }
         }
         for (let i = 0; i < stateRewiew.ulun.length; i++) {
            if (msg.from.id === stateRewiew.ulun[i].userId) {
               reviewFlag++
               myReview3[i] = stateRewiew.ulun[i]
            }
         }
         for (let i = 0; i < stateRewiew.red.length; i++) {
            if (msg.from.id === stateRewiew.red[i].userId) {
               reviewFlag++
               myReview4[i] = stateRewiew.red[i]
            }
         }
         for (let i = 0; i < stateRewiew.green.length; i++) {
            if (msg.from.id === stateRewiew.green[i].userId) {
               reviewFlag++
               myReview5[i] = stateRewiew.green[i]
            }
         }
         myReview.length = 0;
         myReview = [...myReview5, ...myReview2, ...myReview3, ...myReview4, ...myReview1]
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
   let teaName, description, rating;
   bot.on('callback_query', (msg) => {

      data = msg.data;
      const chatId = msg.message.chat.id;
      let result;
      function showRates(teaKind) {
         if (teaKind.length == 0) {
            bot.sendMessage(chatId, 'Пока что нет рейнтигов и отзывов на такие чаи.')
         } else {
            result = teaKind.map((item) =>
               `${item.name},  <strong>${item.rating}</strong>  \n\n`);
            result = result.join('');
            bot.sendMessage(chatId, `${result}`, { parse_mode: "HTML" })
         }
      }
      if (data == 'puerShuRate') {
         showRates(stateRating.puer)
      }
      if (data == 'puerShenRate') {
         showRates(stateRating.puerShen)
      }
      if (data == 'ulunRate') {
         showRates(stateRating.ulun)
      }
      if (data == 'greenRate') {
         showRates(stateRating.green)
      }
      if (data == 'redRate') {
         showRates(stateRating.red)
      }
      function showReview(teaKind) {
         if (teaKind.length == 0) {
            bot.sendMessage(chatId, 'Пока что нет отзывов на такие чаи.')
         } else {
            result = teaKind.map((item) =>
               `${item.autorName}\n<b>${item.name}, ${item.rating}</b>\n${item.description}\n\n`);
            result = result.join('');
            bot.sendMessage(chatId, `${result}`, { parse_mode: "HTML" })
         }
      }
      if (data == 'puerShuView') {
         showReview(stateRewiew.puer)
      }
      if (data == 'puerShenView') {
         showReview(stateRewiew.puerShen)
      }
      if (data == 'redView') {
         showReview(stateRewiew.red)
      }
      if (data == 'ulunView') {
         showReview(stateRewiew.ulun)
      }
      if (data == 'greenView') {
         showReview(stateRewiew.green)
      }

      if ((data == 'puerShuAdd') || (data == 'puerShenAdd') || (data == 'ulunAdd') || (data == 'redAdd') || (data == 'greenAdd')) {
         isTea = data;
         console.log(newTea);
         bot.sendMessage(chatId, 'Введите название чая');
         let cou = 0;
         bot.on('message', msg => {
            cou++
            if (cou === 1) {
               teaName = msg.text
               setname(teaName)
               cou += 2
            }
            if (cou === 4) {
               description = msg.text
               setdes(description)
               cou += 2
            }
            if (cou === 6) {
               bot.sendMessage(chatId, 'Поставьте рейтинг', showRateNumber);
            }
         })
         function setname(name) {
            newTea.name = name
            bot.sendMessage(chatId, 'Напишите описание')
         }
         function setdes(des) {
            newTea.description = des
         }

      }
      if ((data == '1') || (data == '2') || (data == '3') || (data == '4') || (data == '5') || (data == '6') || (data == '7') || (data == '8') || (data == '9') || (data == '10')) {
         rating = +data;
         newTea.rating = rating;
         if (isTea === 'puerShuAdd') {
            newTea.id = stateRewiew.puer.length + 1;
            newTea.isTea = 1
         }
         if (isTea === 'puerShenAdd') {
            newTea.id = stateRewiew.puerShen.length + 1;
            newTea.isTea = 2
         }
         if (isTea === 'ulunAdd') {
            newTea.id = stateRewiew.ulun.length + 1;
            newTea.isTea = 3
         }
         if (isTea === 'redAdd') {
            newTea.id = stateRewiew.red.length + 1;
            newTea.isTea = 4
         }
         if (isTea === 'greenAdd') {
            newTea.id = stateRewiew.green.length + 1;
            newTea.isTea = 5
         }

         newTea.autorName = msg.from.first_name;
         if (msg.from.last_name !== undefined) {
            newTea.autorName = `${msg.from.first_name} ${msg.from.last_name}`;
         } else {
            newTea.autorName = msg.from.first_name;
         }
         newTea.userId = msg.from.id;
         bot.sendMessage(chatId, `${newTea.autorName}\n${newTea.name}, ${newTea.rating} \n${newTea.description}\n\n Записать чай?`, reviewAction, { parse_mode: "HTML" });
      }
      if (isTea === 'puerShuAdd') {
         addTeaState(stateRewiew.puer, stateRating.puer)
      }
      if (isTea === 'puerShenAdd') {
         addTeaState(stateRewiew.puerShen, stateRating.puerShen)
      }
      if (isTea === 'ulunAdd') {
         addTeaState(stateRewiew.ulun, stateRating.ulun)
      }
      if (isTea === 'redAdd') {
         addTeaState(stateRewiew.red, stateRating.red)
      }
      if (isTea === 'greenAdd') {
         addTeaState(stateRewiew.green, stateRating.green)
      }
      function addTeaState(kindOfReview, kindOfRating) {
         if (data == 'addTeaToState') {
            bot.sendMessage(chatId, 'Отлично! Вы добавили отзыв.')
            let clone = {};

            for (let key in newTea) {
               clone[key] = newTea[key];
            }
            let clone2 = {
               id: kindOfRating.id++,
               name: newTea.name,
               rating: newTea.rating,
               review_times: 1
            }
            let flag = 0;
            let rate = 0;
            for (let i = 0; i < kindOfRating.length; i++) {
               if (kindOfRating[i].name == clone.name) {
                  kindOfRating[i].review_times++;
                  for (let j = 0; j < kindOfReview.length; j++) {
                     if (clone.name == kindOfReview[j].name) {
                        rate += kindOfReview[j].rating
                     }
                  }
                  kindOfRating[i].rating = (rate + clone.rating) / kindOfRating[i].review_times;
                  kindOfRating[i].rating = Math.floor(kindOfRating[i].rating * 100) / 100
                  flag++
               }
            }
            if (flag === 0) {
               kindOfRating.push(clone2);
            }
            kindOfReview.push(clone);
            newTea = {};
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
               if (myReview[index].isTea === 1) {
                  deleteTea(stateRewiew.puer, stateRating.puer)
               } else if (myReview[index].isTea === 2) {
                  deleteTea(stateRewiew.puerShen, stateRating.puerShen)
               } else if (myReview[index].isTea === 3) {
                  deleteTea(stateRewiew.ulun, stateRating.ulun)
               } else if (myReview[index].isTea === 4) {
                  deleteTea(stateRewiew.red, stateRating.red)
               } else if (myReview[index].isTea === 5) {
                  deleteTea(stateRewiew.green, stateRating.green)
               }
               function deleteTea(kindOfReview, kindOfRating) {
                  deleteId = myReview[index].id
                  deleteId = kindOfReview.findIndex(item => item.id == deleteId)
                  kindOfReview.splice(deleteId, 1)
                  bot.sendMessage(chatId, 'Ваш отзыв успешно удалён.')
                  for (let i = 0; i < kindOfRating.length; i++) {

                     if ((kindOfRating[i].name == myReview[index].name) && (kindOfRating[i].review_times == 1)) {
                        deleteId = kindOfRating.findIndex(item => item.name == myReview[index].name)
                        kindOfRating.splice(deleteId, 1)
                     } else if ((kindOfRating[i].name == myReview[index].name) && (kindOfRating[i].review_times > 1)) {
                        let rate = 0;
                        kindOfRating[i].review_times -= 1
                        for (let j = 0; j < kindOfReview.length; j++) {
                           if (myReview[index].name == kindOfReview[j].name) {
                              rate += kindOfReview[j].rating
                           }
                        }
                        kindOfRating[i].rating = rate / kindOfRating[i].review_times
                        kindOfRating[i].rating = Math.floor(kindOfRating[i].rating * 100) / 100
                     }
                  }
               }
            }
         })
      }
   })
   bot.on('polling_error', (err) => console.log(err))

}

start()
