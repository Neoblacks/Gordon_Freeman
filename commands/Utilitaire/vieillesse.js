const Discord = require("discord.js");
const fs = module.require("fs");
var mysql = require("mysql");
const { stripIndents } = require("common-tags");
const { getMember, formatDate } = require("../../functions.js");
var con = mysql.createConnection({host:'localhost', user:'SETUSER', password:'SETPSWD', database:'SETDATABASE'});

module.exports = {
  name: "vieillesse",
  aliases: ["age"],
  category: "utilitaire",
  description: "Permet d'afficher la liste des bwi",
  usage: "!vieillesse",
  run : async (bot, message, args) => {

    var liste_age = ["Aucun age rentré"]; var age=0;

  con.query(`SELECT age, user FROM age ORDER BY user;`, function (err, result, fields) {
      if (err) throw err;
      if (result.length > 0) {
        for (var i = 0; i < result.length; i++) {
          liste_age.push(result[i].user + " : " + result[i].age);
          if (age == 0){
            liste_age.shift();
            age ++;
          }

        }
      }
      let ageEmbed = new Discord.RichEmbed()

      //.setTitle("**> L'âge des bwi**")
      .setThumbnail("https://image.noelshack.com/fichiers/2021/53/6/1609625336-patoche.png")
      .setColor("#DA004E")
      .setFooter("Date", "https://image.noelshack.com/fichiers/2021/53/6/1609625336-patoche.png")
      .setTimestamp()
      .addField("**> L'âge des bwi**",`${liste_age.join("\n")}`, false)
      message.channel.send(ageEmbed);
  });

  }
}
