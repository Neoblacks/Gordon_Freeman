const setting = require("./indexsetting.json");
const Discord = require("discord.js");
const fs = require("fs");
const DiscordAntiSpam = require("discord-anti-spam");
var mysql = require("mysql");
// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connecté à la base de données");
// });

//keyv.on('error', err => console.log('Connection Error', err));

const prefix = setting.prefix;

const bot = new Discord.Client({
  disableEveryone: true
});
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

bot.categories = fs.readdirSync("./commands/")

bot.mutes = require("./mutes.json");


/*fs.readdir("./cmds/", (err, files) => {
if(err) console.error(err);

let jsfiles = files.filter(f => f.split(".").pop() === "js");
if(jsfiles.lenght <= 0){
console.log("Pas de commande charger");
return;
}

console.log(`Chargement de ${jsfiles.length} commandes !`);

jsfiles.forEach((f, i) => {
let props = require(`./cmds/${f}`);
console.log(`${i + 1}: ${f} chargé !`);
bot.commands.set(props.help.name, props);

});
});*/

["command"].forEach(handler => {
  require(`./handlers/${handler}`)(bot);
});

bot.on ("ready", async () => {
  console.log("Connecté au Temple")
  bot.user.setPresence({ game: { name: 'bwip bwoup' }, status: 'idle' });
  //bot.user.setPresence({ game: { name: `${bot.users.size} utilisateurs`, type: 0} });


});

bot.on("message", async message => {

  //Configuration pour éviter de faire planter le bot
  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.content.startsWith(prefix)) return;


  // If message.member is uncached, cache it.
  if (!message.member) message.member = await message.guild.fetchMember(message);

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;

  // Get the command
  let command = bot.commands.get(cmd);
  // If none is found, try to find it by alias
  if (!command) command = bot.commands.get(bot.aliases.get(cmd));

  // If a command is finally found, run the command
  if (command)
  command.run(bot, message, args);


});


// bot.on('voiceStateUpdate', (oldMember, newMember) => {
//   let newUserChannel = newMember.voiceChannel
//   let oldUserChannel = oldMember.voiceChannel
//
//
//   let joinChannel = newMember.guild.channels.find(value=> value.name == 'channel-logs')
//   if(!joinChannel) return message.reply("Je ne trouve pas le channel");
//
//   let joinEmbed = new Discord.RichEmbed()
//   .setTitle("Join")
//   .setThumbnail(newMember.user.displayAvatarURL)
//   //.setThumbnail("https://cdn.leagueofgraphs.com/img/lolfr.jpg")
//   .setColor("#008000")
//   .addField("Utilisateur", `<@${newMember.id}>`, true)
//   .addField("Channel rejoins", `**<#${newMember.voiceChannelID}>**`, true)
//   .setFooter(`${newMember.id}`, "https://cdn.leagueofgraphs.com/img/lolfr.jpg")
//   .setTimestamp()
//
//   let leaveEmbed = new Discord.RichEmbed()
//   .setTitle("Leave")
//   .setThumbnail(newMember.user.displayAvatarURL)
//   .setColor("#DC143C")
//   .addField("Utilisateur", `<@${newMember.id}>`, true)
//   .addField("Channel leave", `**<#${oldMember.voiceChannelID}>**`, true)
//   .setFooter(`${newMember.id}`, "https://cdn.leagueofgraphs.com/img/lolfr.jpg")
//   .setTimestamp()
//
//   let switchEmbed = new Discord.RichEmbed()
//   .setTitle("Switch")
//   .setThumbnail(newMember.user.displayAvatarURL)
//   //.setThumbnail("https://cdn.leagueofgraphs.com/img/lolfr.jpg")
//   .setColor("#E8B116")
//   .addField("Utilisateur", `<@${newMember.id}>`, true)
//   .addField("Channel leave", `**<#${oldMember.voiceChannelID}>**`, true)
//   .addField("Pour le channel", `**<#${newMember.voiceChannelID}>**`, true)
//   .setFooter(`${newMember.id}`, "https://cdn.leagueofgraphs.com/img/lolfr.jpg")
//   .setTimestamp()
//
//
//   if(newUserChannel !== undefined && oldUserChannel === undefined ) {
//     return joinChannel.send(joinEmbed)
//
//   } else if(newUserChannel === undefined){
//
//     return joinChannel.send(leaveEmbed)
//   }
//
//   if (oldUserChannel !== undefined && newUserChannel !== undefined) {
//     return joinChannel.send(switchEmbed)
//   }
// });
// début log edit messages
// bot.on("messageUpdate", async(oldMessage, newMessage) => {
//   if(oldMessage.content === newMessage.content){
//     return;
//   }
//
//   let editEmbed = new Discord.RichEmbed()
//   .setAuthor(oldMessage.author.tag, oldMessage.author.avatarURL)
//   .setThumbnail(oldMessage.author.avatarURL)
//   .setColor("006fff")
//   .setDescription("Un message d'un utilisateur a été édité")
//   .addField("Avant", oldMessage.content, true)
//   .addField("Après", newMessage.content, true)
//   .setFooter("Date", "https://cdn.leagueofgraphs.com/img/lolfr.jpg")
//   .setTimestamp()
//
//   let logginChannel = newMessage.guild.channels.find(ch => ch.name === "logs");
//   if(!logginChannel) return;
//
//   logginChannel.send(editEmbed);
// })
//fin log edit message


//delete message log debut
// bot.on("messageDelete", async message => {
//   let deleteEmbed = new Discord.RichEmbed()
//   .setTitle("Message supprimé")
//   .setThumbnail(message.author.avatarURL)
//   .setColor("006fff")
//   .setDescription("Un message d'un utilisateur a été supprimé")
//   .addField("Supprimé par : ", message.author.tag, true)
//   .addField("Dans le channel : ", message.channel, true)
//   .addField("Message crée le : ", message.createdAt)
//   .setFooter("Date", "https://cdn.leagueofgraphs.com/img/lolfr.jpg")
//   .setTimestamp()
//
//   let deleteChannel = message.guild.channels.find(ch => ch.name === "logs");
//   if(!deleteChannel) return;
//
//   deleteChannel.send(deleteEmbed);
// });
//delete message log fin

// const AntiSpam = new DiscordAntiSpam({
//   warnThreshold: 3, // Amount of messages sent in a row that will cause a warning.
//   banThreshold: 7, // Amount of messages sent in a row that will cause a ban
//   maxInterval: 2000, // Amount of time (in ms) in which messages are cosidered spam.
//   warnMessage: "{@user}, Arrête de spam s'il te plaît.", // Message will be sent in chat upon warning.
//   banMessage: "**{user_tag}** a été banni pour spam.", // Message will be sent in chat upon banning.
//   maxDuplicatesWarning: 3, // Amount of same messages sent that will be considered as duplicates that will cause a warning.
//   maxDuplicatesBan: 10, // Amount of same messages sent that will be considered as duplicates that will cause a ban.
//   deleteMessagesAfterBanForPastDays: 1, // Amount of days in which old messages will be deleted. (1-7)
//   exemptPermissions: ["MANAGE_MESSAGES", "ADMINISTRATOR", "MANAGE_GUILD", "BAN_MEMBERS"], // Bypass users with at least one of these permissions
//   ignoreBots: true, // Ignore bot messages
//   verbose: false, // Extended Logs from module
//   ignoredUsers: [], // Array of string user IDs that are ignored
//   ignoredGuilds: [], // Array of string Guild IDs that are ignored
//   ignoredChannels: [] // Array of string channels IDs that are ignored
// });
//
//
// AntiSpam.on("warnEmit", (member) => console.log(`Attempt to warn ${member.user.tag}.`));
// AntiSpam.on("warnAdd", (member) => console.log(`${member.user.tag} a été warn.`));
// //AntiSpam.on("kickEmit", (member) => console.log(`Attempt to kick ${member.user.tag}.`));
// //AntiSpam.on("kickAdd", (member) => console.log(`${member.user.tag} a été kick.`));
// AntiSpam.on("banEmit", (member) => console.log(`Attempt to ban ${member.user.tag}.`));
// AntiSpam.on("banAdd", (member) => console.log(`${member.user.tag} a été banni.`));
// AntiSpam.on("dataReset", () => console.log("Le cache du module a été effacé."));
//
// bot.on("ready", () => console.log(`Logged in as ${bot.user.tag}.`));
//
// bot.on("message", (msg) => {
//   AntiSpam.message(msg);
// });

bot.login(setting.token);
