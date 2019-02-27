const { bot, config, db_arena, db_beginner, db_pro, db_whitelist } = require('../index');
const colors = require('colors/safe');
const alias = require('../util/alias');


bot.on('message', message => {

    if (message.author.id === bot.user.id) return;
    if (message.author.bot) return;
    if (message.channel.type === "dm") return message.channel.send("Please use our #z4lab-bot channel");

    if (config.channel.type == 'id/name' && !message.channel.name.includes('bot')) return;
    if (!config.channel.name && !config.channel.id && !message.channel.name.includes('bot')) return;
    if (config.channel.type == 'name' && !config.channel.id && message.channel.name != config.channel.name) return;
    if (config.channel.type == 'id' && message.channel.id != config.channel.id) return;
    if (config.channel.type == 'name' && config.channel.id && config.channel.name && message.channel.id != config.channel.id) return;

    var prefix = config.prefix;

    var botid = bot.user.id;

    var mbot = message.guild.members.get(botid);

    var messageArray = message.content.split(" ");
    var cmd = messageArray[0].toLowerCase();
    var args = messageArray.slice(1);

    if (!message.content.startsWith(prefix)) return;

    cmd = alias(cmd.slice(prefix.length));
    
    var commandFile = bot.commands.get(cmd);
    
    if (commandFile) commandFile.run(bot, message, args, prefix, db_beginner, db_pro, db_arena, db_whitelist);    
    

});