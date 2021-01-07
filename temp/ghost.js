const Discord = require("discord.js");
const ms = require("ms");
var mysql = require("mysql");
var con = mysql.createConnection({host:'localhost', user:'lolFrAdmin', password:'jdSq4tuf8zR*', database:'Sanctions'});

//const Sanction = require("../models/sanction.js");

module.exports.run = async (bot, message, args) => {
  let toGhost = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]) /*|| message.member.user.tag;*/
  if(!toGhost) return message.channel.send("Tu n'as pas mentionné de personnes");

  if (!message.guild) return;
  let unmutechannel = message.guild.channels.find(value=> value.name == 'logs');
  if (!message.guild) return;
  if(!unmutechannel) return message.reply("Je ne trouve pas le channel");

    let role = message.guild.roles.find(r => r.name === "muted");
    if(!role || !toGhost.roles.has(role.id)) return unmutechannel.send("La personne n'est pas mute actuellement.");

    await toGhost.removeRole(role);

    let ghostrole = message.guild.roles.find(`name`, "ghosted");
    //start of create role
    if(!ghostrole){
      try{
        ghostrole = await message.guild.createRole({
          name: "ghosted",
          color: "#000000",
          permissions:[]
        })
        message.guild.channels.forEach(async (channel, id) => {
          await channel.overwritePermissions(ghostrole, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false
          });
        });
      }catch(e){
        console.log(e.stack);
      }
    }
    let ghosttime = args[1];
    if(!ghosttime) return message.reply("You didn't specify a time!");

    let ghostEmbed = new Discord.RichEmbed()
    .setTitle("Mute")
    .setThumbnail(toGhost.avatarURL)
    .setColor("#FF0000")
    .addField("Utilisateur mute", `<@${toGhost.id}>`)
    .addField("Mute par", `<@${message.author.id}>`)
    //.addField("Raison", reason)
    .addField("Durée du mute", `${ms(ms(ghosttime))}`)
    .setFooter("Date du mute", "https://cdn.leagueofgraphs.com/img/lolfr.jpg")
    .setTimestamp()

    let unghostEmbed = new Discord.RichEmbed()
    .setTitle("Unmute AUTOMATIQUE")
    .setThumbnail("https://cdn.leagueofgraphs.com/img/lolfr.jpg")
    .setColor("#00FF00")
    .addField("Utilisateur Unmute", `<@${toGhost.id}>`)
    .addField("Unmute après", `${ms(ms(ghosttime))}`)
  //.addField("Raison", reason)
    //.addField("Durée du mute", `${ms(ms(ghosttime))}`)
    .setFooter("Date du unmute", "https://cdn.leagueofgraphs.com/img/lolfr.jpg")
    .setTimestamp()


    //FAIRE UN EMBED POUR LE UNMUTE AUTOMATIQUE ET LE UNMUTE MANUEL COULEUR DU TRAIT VERT
    if (!message.guild) return;
    let mutechannel = message.guild.channels.find(value=> value.name == 'logs')
    if(!mutechannel) return message.reply("Je ne trouve pas le channel");
    if (!message.guild) return;

    //AJOUT DU ROLE MUTE

    await(toGhost.addRole(ghostrole.id));

    setTimeout(function(){
      toGhost.removeRole(ghostrole.id);
        if(!toGhost.roles.has(ghostrole.id)) return;
      mutechannel.send(unghostEmbed);
    }, ms(ghosttime));

    if(!toGhost.hasPermission("MANAGE_MESSAGES"))
    try{
        await mutechannel.send(ghostEmbed);
        // await toGhost.createDM().then(channel => {
        //     return channel.send("Un mute vient de t'être appliqué. Voici les informations concernant ton warn :", muteEmbed) //AWAIT pour envoyer d'abord un DM avant l'action du ban
        //await message.guild.member(toGhost).ban(reason);

    }catch(e){
        console.log(e.stack);
    }
}

module.exports.help = {
    name: "ghost"
}
