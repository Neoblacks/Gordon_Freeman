const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var mysql = require("mysql");
var con = mysql.createConnection({host:'localhost', user:'lolFrAdmin', password:'jdSq4tuf8zR*', database:'Sanctions'});
// const Sanction = require("../models/sanction.js");


module.exports.run = async (bot, message, args) => {

  //!warn @daeshan <reason>
  if(!message.member.hasPermission("MANAGE_MEMBERS")) return;
  let sUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]) /* || message.member.user.tag;*/
  if(!sUser) return message.reply("Je ne trouve pas l'utilisateur"); //return dans le channel où la commande est faites



  if(sUser.hasPermission("MANAGE_MESSAGES")) return message.reply("Tu ne peux pas warn cet utilisateur");



  let reason = args.slice(1).join(" ");
  if (!reason) return message.channel.send("Quelle est la raison ?");

  var sql = `INSERT INTO warn(id, raison) VALUES (${sUser.id}, "${reason}")`;

  con.connect(function(err) {
  if (err) throw err;
  con.query(sql, function (err, result) {
    if (err) throw err;
  });
});


  let warnEmbed = new Discord.RichEmbed()
  .setTitle("Warn")
//  .setDescription("~Warn~")
  .setThumbnail(sUser.avatarURL)
  .setColor("#fdee00")
  .addField("Utilisateur warn", `<@${sUser.id}>`)
  .addField("Warn par", `<@${message.author.id}>`)
  .addField("Raison", reason)
  .setFooter("Date du warn", "https://cdn.leagueofgraphs.com/img/lolfr.jpg")
  .setTimestamp()
  if (!message.guild) return;
  let warnchannel = message.guild.channels.find(value=> value.name == 'logs')
  if(!warnchannel) return message.reply("Couldn't find channel");
  if (!message.guild) return;

  // if(warns[sUser.id].warns == 2){
  //   let muterole = message.guild.roles.find(`name`, "muted");
  //   if(!muterole) return message.reply("You should create that role dude.");
  //
  //   let mutetime = "10s";
  //   await(sUser.addRole(muterole.id));
  //   message.channel.send(`<@${sUser.id}> has been temporarily muted`);
  //
  //   setTimeout(function(){
  //     sUser.removeRole(muterole.id)
  //     message.reply(`<@${sUser.id}> has been unmuted.`)
  //   }, ms(mutetime))
  // }
  // if(warns[sUser.id].warns == 3){
  //   message.guild.member(sUser).ban(reason);
  //   message.reply(`<@${sUser.id}> has been banned.`)
  // }
  if(!sUser.hasPermission("MANAGE_MESSAGES"))
  try{
      await warnchannel.send(warnEmbed);
      await sUser.createDM().then(channel => {
          return channel.send("Un warn vient de t'être appliqué. Voici les informations concernant ton mute :", warnEmbed) //AWAIT pour envoyer d'abord un DM avant l'action du ban
      });
      //await message.guild.member(sUser).ban(reason);

  }catch(e){
      console.log(e.stack);
  }

}

module.exports.help = {
  name: "warn"
}
