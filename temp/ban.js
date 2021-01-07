const Discord = require("discord.js");
const fs = module.require("fs");
var mysql = require("mysql");
var con = mysql.createConnection({host:'localhost', user:'lolFrAdmin', password:'jdSq4tuf8zR*', database:'Sanctions'});
// const Sanction = require("../models/sanction.js");

module.exports.run = async (bot, message, args) => {

      let sUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0])); //Récupération de la mention
      let reason = args.slice(1).join(" "); //Récupération de la raison du ban
      if(!sUser) return message.channel.send("Veuillez indiquez un utilisateur valide!"); //Message d'erreur si personne non trouvé
      if(!reason) return message.channel.send("Veuillez indiquez la raison du ban après avoir mentionné la personne à ban") //message d'erreur si pas de raison
      if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.channel.send("Tu n'as pas les permissions de ban quelqu'un"); //Message d'erreur en cas de non permissions ou return (à voir avec admin)
      if(sUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Cette personne ne peut pas être bannie");
      if (!message.guild) return; //Message d'erreur si la personne ciblé est un admin

      // Sanction.findOne({
      //   userID: sUser.id
      //   //username: sUser.user.username,
      //   //reason: reason,
      //   //time: message.createdAt
      // }, (err, sanction) => {
      //   if(err) console.log(err);
      //   if(!sanction){
      //     const newSanction = new Sanction({
      //       userID: sUser.id,
      //       username: sUser.user.username,
      //       raison_ban: reason,
      //       //raison_mute: " ",
      //       time: message.createdAt
      //     })
      //
      //     newSanction.save().catch(err => console.log(err));
      //   } else {
      //     sanction.raison_ban.push(reason);
      //     sanction.save().catch(err => console.log(err));
      //   }
      //
      // });

      var sql = `INSERT INTO ban(id, raison) VALUES (${sUser.id}, "${reason}")`;

      con.connect(function(err) {
      if (err) throw err;
      con.query(sql, function (err, result) {
        if (err) throw err;
      });
    });

      let banEmbed = new Discord.RichEmbed()
      .setTitle("Ban")
      .setThumbnail(user.avatarURL)
      .setColor("#000000")
      .addField("Utilisateur banni", `${sUser} with ID ${sUser.id}`)
      .addField("Banni par", `<@${message.author.id}>`) // Bloc embed pour channel de log
      .addField("Raison", reason)
      .setFooter("Heure du ban", "https://cdn.leagueofgraphs.com/img/lolfr.jpg")
      .setTimestamp()

      let banUserEmbed = new Discord.RichEmbed()
      .setTitle("Ban")
      .setThumbnail(user.avatarURL)
      .setColor("#000000")
      .addField("Utilisateur banni", `${sUser}`)
    //  .addField("Banni par", `<@${message.author.id}>`) // Bloc embed pour channel de log
      .addField("Raison", reason)
      .setFooter("Date du ban", "https://cdn.leagueofgraphs.com/img/lolfr.jpg")
      .setTimestamp()



      if (!message.guild) return;

      let banchannel = message.guild.channels.find(value=> value.name == 'logs')
      if(!banchannel) return message.reply("Je ne trouve pas le channel")
      if (!message.guild) return;
      //let incidentchannel = message.guild.channels.find(`name`, "incidents");   // recherche du channel incidents pour envoyer le embed dedans (à faire)
      //if(!incidentchannel) return message.channel.send("Can't find incidents channel."); // Message d'erreur si le channel n'existe pas

      if(!sUser.hasPermission("MANAGE_MESSAGES"))
      try{
          await message.channel.send(banEmbed);
          await sUser.createDM().then(channel => {
              return channel.send(`Bonjour, vous avez été ban du serveur LoLFr. Pour toute demande de deban contacter la page : https://www.facebook.com/messages/t/pagelolfr. \nVoici la raison de ton ban : `, banUserEmbed) //AWAIT pour envoyer d'abord un DM avant l'action du ban
          });
          await message.guild.member(sUser).ban(reason);

      }catch(e){
          console.log(e.stack);
      }
 }
      //message.guild.member(sUser).ban(reason);
      //incidentchannel.send(banEmbed);

module.exports.help = {
    name: "ban"
}
