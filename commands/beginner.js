const Discord = require("discord.js");
const colors = require('colors/safe');
const config = require("../config/bot.json");
const servers = require("../config/servers.json");
const gamedig = require('gamedig');


module.exports.run = function (bot, message, args, prefix) {

    gamedig.query(servers["beginner"],
        function (e, state) {

            var embed;

            if (!e) {
                //map
                let mapArray = state.map.split('/');
                let map = mapArray[2] || mapArray[0];

                //players
                let playerCount = state.raw.numplayers;
                let botCount = state.raw.numbots; //kp für was ich das brauch :/
                let maxPlayers = state.maxplayers;

                //connection
                let connectLink = `steam://connect/${state.query.host}:${state.query.port}`;

                embed = new Discord.RichEmbed()
                    .setTitle('z4lab Beginner Surf :')
                    .setThumbnail(bot.user.avatarURL)
                    .addField(`Current Map`, map, true)
                    .addField(`Current Player`, playerCount + '/' + maxPlayers, true)
                    .addField(`Connect-Link`, connectLink, false);

            } else {
                embed = new Discord.RichEmbed()
                    .setTitle('z4lab Beginner Surf :')
                    .setThumbnail(bot.user.avatarURL)
                    .addField(`The Server is offline!`, "Will be available soon", false);
            }

            return message.channel.send(embed);

        });



};

module.exports.help = {
    name: "beginner"
};