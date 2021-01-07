const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var mysql = require("mysql");
var con = mysql.createConnection({host:'localhost', user:'age', password:'thomb1997', database:'age'});
// const Sanction = require("../models/sanction.js");

module.exports = {
  name: "adminage",
  aliases: ["aa"],
  category: "utilitaire",
  description: "Permet de set l'âge de quelqu'un",
  usage: "!age + <age>",
  run : async (bot, message, args) => {

  //!warn @daeshan <reason>
  if(!message.member.hasPermission("MANAGE_MESSAGES")) return;
  var user = message.mentions.users.first();
  if(!user) return message.reply("Je ne trouve pas l'utilisateur"); //return dans le channel où la commande est faites


  let age = args.slice(1).join(" ");
  if (!age) return message.channel.send("Quelle est l'âge de la personne ?");

  var sql = `INSERT INTO age(id_user, age, user) VALUES ("${user.id}", "${age}", "${user.username}")`;

  con.query(sql, function (err, result) {
    if (err) throw err;
  });
  message.channel.send(`L'âge de ${user.tag} a bien été enregistré à ${age}`)

  // if(warns[user.id].warns == 2){
  //   let muterole = message.guild.roles.find(`name`, "muted");
  //   if(!muterole) return message.reply("You should create that role dude.");
  //
  //   let mutetime = "10s";
  //   await(user.addRole(muterole.id));
  //   message.channel.send(`<@${user.id}> has been temporarily muted`);
  //
  //   setTimeout(function(){
  //     user.removeRole(muterole.id)
  //     message.reply(`<@${user.id}> has been unmuted.`)
  //   }, ms(mutetime))
  // }
  // if(warns[user.id].warns == 3){
  //   message.guild.member(user).ban(reason);
  //   message.reply(`<@${user.id}> has been banned.`)
  // }
  // if(!user.hasPermission("MANAGE_MESSAGES"))
  // try{
  //     await warnchannel.send(warnEmbed);
  //     await user.createDM().then(channel => {
  //         return channel.send("Un warn vient de t'être appliqué. Voici les informations concernant ton mute :", warnEmbed) //AWAIT pour envoyer d'abord un DM avant l'action du ban
  //     });
  //     //await message.guild.member(user).ban(reason);
  //
  // }catch(e){
  //     console.log(e.stack);
  //   }
  }
}
