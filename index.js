const config = require("./config/bot.json");
const Discord = require("discord.js");
const fs = require("fs");
const mysql = require('mysql');
const colors = require('colors/safe');
const SteamID = require('steamid');
const steam = require('steamidconvert')();


// Console stuff

console.log('');
console.log(colors.magenta('----------------------------------------'));
console.log(colors.magenta('          Surftimer Bot by Ace          '));
console.log(colors.magenta('----------------------------------------'));
console.log('');




const bot = new Discord.Client();
bot.commands = new Discord.Collection();

// Config Stuff

if (!config) throw new Error('The config-file is empty!');
if (!config.token || config.token == 'DISCORD-BOT-TOKEN') throw new Error('Please set a bot token in the config file!');
if (!config.prefix) throw new Error('Please set a prefix in the config file!');
if (!config.database) throw new Error('Please set the database settings in the config file!');
if (!config.database.host) throw new Error('Please set a database host in the config file!');
if (!config.database.user) throw new Error('Please set a database user in the config file!');
if (!config.database.password) throw new Error('Please set a database password in the config file!');
if (!config.database.database) throw new Error('Please set a database in the config file!');
if (!config.steam['api-key'] || config.steam['api-key'] == 'STEAM-API-KEY') throw new Error('Please set a steam-api key in the config file!');


var db_config = config.database;

fs.readdir("./commands/", (err, file) => { // gets content of /commands folder
    if (err) console.log(err); // err handling

    let jsfile = file.filter(f => f.split(".").pop() === "js"); // checks for .js files
    if (jsfile.length <= 0) { // checks if no file exist
        console.log(colors.yellow("Couldn't find any commands!")); // no file err
        return; // leave
    }
    jsfile.forEach((f, i) => { // gets all files
        let props = require(`./commands/${f}`); // from /commands folder
        console.log(colors.grey(`[Module] ${f} loaded!`)); // console log print form module
        bot.commands.set(props.help.name, props); // set files as command
    });
});


bot.on('ready', () => {
    console.log(colors.green('[Discord] Connected!'));
    console.log(colors.grey(`[Discord] ${bot.user.tag} started!`));
});


bot.on('error', () => {
    console.log(colors.red.bold('[Discord] Error!'));
});



bot.on('message', message => {

    if (message.author.id === bot.user.id) return;
    if (message.author.bot) return;
    if (message.channel.type === "dm") return message.channel.send("I don't anwser in this chat!");
    if (!message.channel.name.includes('bot')) return;

    let prefix = config.prefix;

    let botid = bot.user.id;

    let mbot = message.guild.members.get(botid);

    let messageArray = message.content.split(" ");
    let cmd = messageArray[0].toLowerCase();
    let args = messageArray.slice(1);
    
    if (!message.content.startsWith(prefix)) return;
    
    let commandFile = bot.commands.get(cmd.slice(prefix.length));
    
    if (commandFile) commandFile.run(bot, message, args, prefix, db, clientsteam);

});


var db;

function dbErrorHandler() {
    db = mysql.createConnection(db_config);


    db.connect(function (err) {
        if (err) {
            console.log('[DB] error when connecting:', err);
            setTimeout(dbErrorHandler, 2000);
        }
        else {
            console.log(colors.green('[DB] Connected!'));
        }
    });

    db.on('error', function (err) {
        console.log('[DB] db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            dbErrorHandler();
        } else {
            throw err;
        }
    });
}
dbErrorHandler();


bot.login(config.token);