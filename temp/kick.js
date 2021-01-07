const Discord = require("discord.js");
const fs = module.require("fs");
var mysql = require("mysql");
var con = mysql.createConnection({host:'localhost', user:'lolFrAdmin', password:'jdSq4tuf8zR*', database:'Sanctions'});
//const Sanction = require("../models/sanction.js");

module.exports.run = async (bot, message, args) => {


     let sUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
     let reason = args.slice(1).join(" ");
     if(!sUser) return message.channel.send("Veuillez indiquez un utilisateur valide!");
     if(!reason) return message.channel.send("Veuillez indiquez la raison du kick après avoir mentionné la personne à kick")
     if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Désolé je suis dans l'incapacité de faire ça");
     if(sUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("La personne ne peut pas être kické car elle fait partie du staff");

     var sql = `INSERT INTO kick(id, raison) VALUES (${sUser.id}, "${reason}")`;

     con.connect(function(err) {
     if (err) throw err;
     con.query(sql, function (err, result) {
       if (err) throw err;
     });
   });

     let kickEmbed = new Discord.RichEmbed()
     .setTitle("Kick")
     .setThumbnail(user.avatarURL)
     .setColor("#000000")
     .addField("Utilisateur Kick", `${sUser} avec comme ID ${sUser.id}`)
     .addField("Kické par", `<@${message.author.id}>`)
     .addField("Raison", reason)
     .setFooter("Date du kick", "https://cdn.leagueofgraphs.com/img/lolfr.jpg")
     .setTimestamp()


     if (!message.guild) return;
     let kickchannel = message.guild.channels.find(value=> value.name == 'logs')
     if(!kickchannel) return message.reply("Je ne trouve pas le channel");
     if (!message.guild) return;

     if(!sUser.hasPermission("MANAGE_MESSAGES"))
        try{
            await message.channel.send(kickEmbed);
            await sUser.createDM().then(channel => {
                return channel.send(`Bonjour, vous avez été kické par <@${message.author.id}> pour la raison suivante : ${reason}` )
            });
            await message.guild.member(sUser).kick(reason);

        }catch(e){
            console.log(e.stack);
        }
   }
   module.exports.help = {
    name: "kick"
}


//même principe que le ban avec le mot kick ;)
