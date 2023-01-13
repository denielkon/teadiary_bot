
function checkLengthAndSendMessages(bot, input, chatId, option) {  
   if (input.length < 4070) return bot.sendMessage(chatId, input, option);
   let checkResult = [];
   let resultToMesage;
   input = input.split('\n\n');
   for (let i = 0; i < input.length; i++) {
      resultToMesage = checkResult.join('\n\n');
      if ((i !== input.length - 1) && (resultToMesage.length + input[i + 1].length > 4000)) {
         bot.sendMessage(chatId, resultToMesage, option.parse_mode ? option : {});
         checkResult.length = 0;
      }
      checkResult.push(input[i]);
   }
   function sendLastMessage(){ bot.sendMessage(chatId, resultToMesage, option) }
   if (checkResult.length < 4000) setTimeout(sendLastMessage, 15);
}

function translateTeaKindToText(isTea) {
   if (isTea == 1) return 'Шу Пуэр';
   if (isTea == 2) return 'Шен Пуэр';
   if (isTea == 3) return 'Улун';
   if (isTea == 4) return 'Зелёный чай';
   if (isTea == 5) return 'Красный чай';
   if (isTea == 6) return 'Белый чай';
}

module.exports = {checkLengthAndSendMessages, translateTeaKindToText}