const fs = require("fs");
const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Tu n'as pas les permissions pour unmute la personne !")

        let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]) /*|| message.member.user.tag;*/
        if(!toMute) return message.channel.send("Tu n'as pas mentionné de personnes");

        let role = message.guild.roles.find(r => r.name === "muted");
        if (!message.guild) return;
        let unmutechannel = message.guild.channels.find(value=> value.name == 'logs');
        if (!message.guild) return;
        if(!unmutechannel) return message.reply("Je ne trouve pas le channel");

        if(!role || !toMute.roles.has(role.id)) return unmutechannel.send("La personne n'est pas mute actuellement.");

        let unmuteEmbed = new Discord.RichEmbed()
        .setTitle("Unmute")
        .setThumbnail("https://cdn.leagueofgraphs.com/img/lolfr.jpg")
        .setColor("#00FF00")
        .addField("Utilisateur Unmute", `<@${toMute.id}>`)
        .addField("Unmute par", `<@${message.author.id}>`)
      //.addField("Raison", reason)
        //.addField("Durée du mute", `${ms(ms(mutetime))}`)
        .setFooter("Date du unmute", "https://cdn.leagueofgraphs.com/img/lolfr.jpg")
        .setTimestamp()

        await toMute.removeRole(role);

        unmutechannel.send(unmuteEmbed);


}

module.exports.help = {
    name: "unmute"
}
