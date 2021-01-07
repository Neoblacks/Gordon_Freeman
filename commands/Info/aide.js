const Discord = require("discord.js");
const fs = require("fs");
const { stripIndents } = require("common-tags");
module.exports = {
  name: "aide",
  aliases: ["ai"],
  category: "info",
  description: "Retourne les informations de toutes les commandes, ou d'une commande spécifique.",
  usage: "[command | alias]",
  run: async (bot, message, args) => {
      if (args[0]){
        return getCMD(bot, message, args[0]);
      } else {
          return getAll(bot, message);
      }
  }
}

function getAll(bot, message) {
  const embed = new Discord.RichEmbed()
  .setColor("#DA004E")

  // Map all the commands
  // with the specific category
  const commands = (category) => {
    return bot.commands



    .filter(cmd => cmd.category === category)
    .map(cmd => ` - \`${cmd.name}\``)
    .join("\n");
  }

  // Map all the categories
  const info = bot.categories
  .map(cat => stripIndents`**\n${cat[0].toUpperCase() + cat.slice(1)}\n** \n${commands(cat.toLowerCase())}`)
  .reduce((string, category) => string + "\n" + category);
      //console.log(bot.categories);
      //console.log(bot.commands)
  return message.channel.send(embed.setDescription(info));
}

function getCMD(bot, message, input) {
    const embed = new Discord.RichEmbed()

    // Get the cmd by the name or alias
    const cmd = bot.commands.get(input.toLowerCase()) || bot.commands.get(bot.aliases.get(input.toLowerCase()));

    let info = `Aucune information de trouvé pour la commande :  **${input.toLowerCase()}**`;

    // If no cmd is found, send not found embed
    if (!cmd) {
        return message.channel.send(embed.setColor("RED").setDescription(info));
    }

    // Add all cmd info to the embed
    if (cmd.name) info = `**Nom de la commande**: ${cmd.name}`;
    if (cmd.aliases) info += `\n**Alias**: ${cmd.aliases.map(a => `\`${a}\``).join(", ")}`;
    if (cmd.description) info += `\n**Description**: ${cmd.description}`;
    if (cmd.usage) {
        info += `\n**Utilisation**: ${cmd.usage}`;
        embed.setFooter(`Syntax: <> = requis, [] = Optionnel, | = ou`);
    }

    return message.channel.send(embed.setColor("#DA004E").setDescription(info));
}
