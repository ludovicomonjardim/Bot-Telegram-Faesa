require('dotenv/config')
const migrationsRun = require('./database/sqlite/migrations')
const sqliteConnection = require('./database/sqlite')
const TelegramBot = require('node-telegram-bot-api');
migrationsRun()

const token = process.env.token

const bot = new TelegramBot(token, {polling: true});

let foraHorario = false
const time = new Date()

async function save(email){
  const database = await sqliteConnection()

  await database.run("INSERT INTO emails (email) VALUES (?)", [email])
}



  bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    let email = msg
    let horaCorrente = time.getHours()
      
      if (foraHorario){
        save(email.text)
        bot.sendMessage(chatId, 'O seu email foi salvo. Entraremos em contato assim que possível.');
        foraHorario = false
        return
      }

      if (horaCorrente < 8 || horaCorrente > 18) {
        bot.sendMessage(chatId, 'Olá! No momento não estamos atendendo.\nPor favor, deixe o seu e-mail. Entraremos em contato assim que possível.');
        foraHorario = true        
      } else {
         bot.sendMessage(chatId, 'https://faesa.br');
      }           
      return
    }
);
