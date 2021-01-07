const Discord = require("discord.js");
const ms = require("ms");
var mysql = require("mysql");
var con = mysql.createConnection({host:'localhost', user:'lolFrAdmin', password:'jdSq4tuf8zR*', database:'Sanctions'});

//const Sanction = require("../models/sanction.js");

module.exports.run = async (bot, message, args) => {

  //!tempmute @user 1s/m/h/d

  let sUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if(!sUser) return message.reply("Je ne trouve pas l'utilisateur");
  if(sUser.hasPermission("MANAGE_MESSAGES")) return;
  let muterole = message.guild.roles.find(`name`, "muted");
  //start of create role
  if(!muterole){
    try{
      muterole = await message.guild.createRole({
        name: "muted",
        color: "#000000",
        permissions:[]
      })
      message.guild.channels.forEach(async (channel, id) => {
        await channel.overwritePermissions(muterole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
    }catch(e){
      console.log(e.stack);
    }
  }
  //end of create role

  let reason = args.slice(2).join(" ");
  if (!reason) return message.channel.send("Quelle est la raison ?");

  let mutetime = args[1];
  if(!mutetime) return message.reply("You didn't specify a time!");


  //MISE DE LA RAISON DANS LA DB
  var sql = `INSERT INTO mute(id, raison) VALUES (${sUser.id}, "${reason}")`;

  con.connect(function(err) {
  if (err) throw err;
  con.query(sql, function (err, result) {
    if (err) throw err;
  });
});

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
  //       //raison_warn: reason,
  //       raison_mute: reason,
  //       time: message.createdAt
  //     })
  //
  //     newSanction.save().catch(err => console.log(err));
  //   } else {
  //     sanction.raison_mute.push(reason);
  //     sanction.save().catch(err => console.log(err));
  //   }
  // });


// EMBED MUTE
  let muteEmbed = new Discord.RichEmbed()
  .setTitle("Mute")
  .setThumbnail(sUser.avatarURL)
  .setColor("#FF0000")
  .addField("Utilisateur mute", `<@${sUser.id}>`)
  .addField("Mute par", `<@${message.author.id}>`)
  .addField("Raison", reason)
  .addField("Durée du mute", `${ms(ms(mutetime))}`)
  .setFooter("Date du mute", "https://cdn.leagueofgraphs.com/img/lolfr.jpg")
  .setTimestamp()

  let unmuteEmbed = new Discord.RichEmbed()
  .setTitle("Unmute AUTOMATIQUE")
  .setThumbnail("https://cdn.leagueofgraphs.com/img/lolfr.jpg")
  .setColor("#00FF00")
  .addField("Utilisateur Unmute", `<@${sUser.id}>`)
  .addField("Unmute après", `${ms(ms(mutetime))}`)
//.addField("Raison", reason)
  //.addField("Durée du mute", `${ms(ms(mutetime))}`)
  .setFooter("Date du unmute", "https://cdn.leagueofgraphs.com/img/lolfr.jpg")
  .setTimestamp()


  //FAIRE UN EMBED POUR LE UNMUTE AUTOMATIQUE ET LE UNMUTE MANUEL COULEUR DU TRAIT VERT
  if (!message.guild) return;
  let mutechannel = message.guild.channels.find(value=> value.name == 'logs')
  if(!mutechannel) return message.reply("Je ne trouve pas le channel");
  if (!message.guild) return;

  //AJOUT DU ROLE MUTE

  await(sUser.addRole(muterole.id));

  setTimeout(function(){
    sUser.removeRole(muterole.id);
      if(!sUser.roles.has(muterole.id)) return;
    mutechannel.send(unmuteEmbed);
  }, ms(mutetime));

//Envoi du message privé
  if(!sUser.hasPermission("MANAGE_MESSAGES"))
  try{
      await mutechannel.send(muteEmbed);
      await sUser.createDM().then(channel => {
          return channel.send("Un mute vient de t'être appliqué. Voici les informations concernant ton warn :", muteEmbed) //AWAIT pour envoyer d'abord un DM avant l'action du ban
      });
      //await message.guild.member(sUser).ban(reason);

  }catch(e){
      console.log(e.stack);
  }


//end of module
}

module.exports.help = {
  name: "mute"
}
