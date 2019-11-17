import { Reminder } from "./reminder";
import * as Discord from 'discord.js';

let secrets = require("../secrets.json");

//const Discord = require('discord.js');
const client = new Discord.Client();



client.on('ready', () => {
  console.log('Logged in as $(client.user.tag)!');
});

client.on('message', msg => {

  // ignore bots and self
  if (msg.author.bot) return;

  var args:string[] = msg.content.split(' ', 4);
  var cmdSwitch:string = args[0].charAt(0);

  console.log(args);

  if (msg.content === 'ping') {
    msg.channel.send('pong');
    //msg.reply('pong');
  }

  if (cmdSwitch === '?') {

    if (args[0] === "?help") {
      // Help function
      msg.channel.send("Here to help, I will soon have commands for you.");
    }

    else if (args[0] === "?remind") {
      if (args[1] === "-h") {
        msg.channel.send("?remind [startTime-endTime] [location] [title]");
      } else {
        let validConfig: boolean = true;

        let name: string;
        let location: string;
        let startdate: Date;
        let enddate: Date;

        let nameArr: RegExpMatchArray;
        let locationArr: RegExpMatchArray;
        let datetimeArr: RegExpMatchArray;
      
        const patt_name: RegExp = /\*(.{1,32})\*/i;
        const patt_location: RegExp = /\|(.{1,32})\|/i;
        const patt_datetime: RegExp = /((0[1-9]|1[0-2])\/([0-2][1-9]|3[0-1])\/(20[0-9][0-9]) (0[1-9]|1[0-2]):([0-5][0-9]))-((0[1-9]|1[0-2])\/([0-2][1-9]|3[0-1])\/(20[0-9][0-9]) (0[1-9]|1[0-2]):([0-5][0-9]))/i;
        
        nameArr = msg.content.match(patt_name);
        locationArr = msg.content.match(patt_location);
        datetimeArr = msg.content.match(patt_datetime);

        if (nameArr) {
          name = nameArr[1];
        } else {
          msg.channel.send("Name was not valid. Needs to be between 1 and 32 characters, in between **.");
          validConfig = false;
        }

        if (locationArr) {
          location = locationArr[1];
        } else {
          msg.channel.send("Location was not valid. Needs to be between 1 and 32 characters, in between ||.")
          validConfig = false;
        }
        
        if (datetimeArr) {
          // If datetime was found, pull them from the array
          startdate = new Date(datetimeArr[1]);
          enddate = new Date(datetimeArr[7]);

          //msg.channel.send(startdate.toLocaleString());
          //msg.channel.send(enddate.toLocaleString());
        } else {
          msg.channel.send("Date was not valid. ex) 01/12/2019 12:00-01/12/2019 12:50");
          validConfig = false;
        }
        

        if (validConfig) {
          msg.channel.send("Valid data message.")
          console.log("Valid data message.");
        } else {
          msg.channel.send("Try again dumbfuck");
          msg.channel.send("?remind *Title* |Location| 01/12/2019 12:00-01/12/2019 12:50");
        }


        //console.log(datetime);
        // var indexBracket = 0;
        // var indexHyphen = 0;
        // indexBracket = msg.content.indexOf('[');
        // indexHyphen = msg.content.indexOf('-');

        
      }

      //let newReminder = new Reminder("Get this done", "CS 327", "Now", "Later");

      //console.log(newReminder);
    }

    else {
      msg.channel.send("I'm not sure what you mean.");

    }

  }

});


client.login(secrets.discord);
