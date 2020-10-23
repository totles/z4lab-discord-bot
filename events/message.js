const sql = require("../util/db/sql");
const permissionLevel = require('../util/permissionLvl');


global.bot.on('message', async message => {

	var fChannelId = global.bot.config.main.channels[0];

	if (message.author.id === global.bot.user.id) return;
	if (message.author.bot) return;
	if (message.channel.type === "dm") return message.channel.send(`Please use our <#${fChannelId}> channel`);

	if (!global.bot.config.main.channels.includes(message.channel.id)) return;

	message.author.permissionLvl = permissionLevel.getUserLevel(message.member);

	var prefix = global.bot.config.main.prefix;

	var messageArray = message.content.split(" ");
	var cmd = messageArray[0].toLowerCase();
	var args = messageArray.slice(1);

	if (!message.content.startsWith(prefix)) return;

	if (!global.bot.commands.get(cmd)) cmd = await sql.alias.check(global.bot, cmd.slice(prefix.length));
	
	var commandFile = global.bot.commands.get(cmd);

	if (commandFile && commandFile.help.permissionLvl > 2 && !global.bot.config.main.adminChannels.includes(message.channel.id)) return message.reply("you may not use this command in this channel!");
	else if (commandFile && message.author.permissionLvl >= commandFile.help.permissionLvl) commandFile.run(global.bot, message, args);	
	else if (commandFile && message.author.permissionLvl < commandFile.help.permissionLvl) return message.reply("you don't have enough permission to use this command!");
	else return;

});