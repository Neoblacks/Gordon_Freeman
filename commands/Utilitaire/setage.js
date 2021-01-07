const Discord = require("discord.js");
const fs = module.require("fs");
var mysql = require("mysql");
var con = mysql.createConnection({host:'localhost', user:'age', password:'thomb1997', database:'age'});

module.exports = {
  name: "setage",
  aliases: [""],
  category: "utilitaire",
  description: "Permet de modifier ton âge",
  usage: "<N° log + nouvel âge>",
  run : async (bot, message, args) => {

  if(!message.member.hasPermission("MANAGE_MESSAGES")) return;
  let id_user = message.author;

  let newAge = args.slice(0).join(" ");
  if (!newAge) return message.channel.send("Quel est ton âge ?");

  con.query(`UPDATE age SET age ='${newAge}' WHERE id_user = '${id_user.id}';`, function (err, result, fields) {
      if (err) throw err;
  });

  message.channel.send(`Ton âge a été modifié à ${newAge}`)


  }
}
