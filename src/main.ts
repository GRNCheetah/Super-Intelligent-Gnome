import { Reminder, ReminderLoader } from "./reminder";
import * as Discord from 'discord.js';
import { fstat } from "fs";

// Info on changing user's nick names
//https://stackoverflow.com/questions/41247353/change-user-nickname-with-discord-js
// setInterval() might be able to be used to delay a timed message
// Could also just add a command only officers could use to push the events


let secrets = require("../secrets.json");

//const Discord = require('discord.js');
const client = new Discord.Client();

// Create data on Guilds connected to
// Lets the bot know where the anouncements channel is for each 
/* 
{
  "guilds": {
    "general": {
      "id":
    },
    "sec": {
      "id"
    }
  }

}
*/

function update_guild_info() {
  // Save anouncement channel information
  // client is global so we gucci
  let guild_ACMGeneral: Discord.Guild = client.guilds.find(guild => guild.name === "ACM General");


}

client.on('ready', () => {
  console.log('Logged in as ' + client.user.tag);
  
  //let interval = setInterval(function() { console.log("Hello"); }, 150);
  let guilds = client.guilds;
  //console.log(guilds);
  //console.log(client.guilds.find(guild => guild.name === "ACM General"));
  //update_guild_info();
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
      } else if (args[1] === "-p") {
        // This is for pushing reminders to the masses
        // Set some flags so code isn't repeated
        // ?remind -p [all|n] [everyone|web|sec|w|game|comp|data|hack]
        //let reminderNum: number = 0;  // The reminder number in the list [0+]
        let toSend: string = "";      // The string to send to the discords
        let reminderLoader: ReminderLoader = new ReminderLoader();
        let reminder: Reminder;           // The Reminder object to send
        let sendMsg: boolean = true;      // Goes false if there is not a specified reminder to push
        let singleSends: boolean = true;  // Goes false if everyone is in the 'to send' part of the message

        // Determines which reminder to push
        if (args[2] === "all") {
          // Push all the reminders
          // Probably shouldn't do this one
        } else if (typeof args[2] === "string" && !isNaN(Number(args[2]))) {
          // Push just the number given
          reminder = reminderLoader.get_reminderByNum(Number(args[2]));
          console.log(reminder);
        } else {
          console.log("No idea which reminder to grab");
          sendMsg = false;
        }

        if (sendMsg) {
          let targetDiscords: Array<string> = args[3].split("|");
          if (targetDiscords.indexOf('everyone') > -1) {
            // Send to all discords
            singleSends = false;    // Don't doouble send to individual stuff

          }

          if (singleSends) {
            if (targetDiscords.indexOf('web')) {

            }
            if (targetDiscords.indexOf('sec')) {

            }
            if (targetDiscords.indexOf('w')) {

            }
            if (targetDiscords.indexOf('comp')) {

            }
            if (targetDiscords.indexOf('hack')) {

            }
            if (targetDiscords.indexOf('data')) {

            }
            if (targetDiscords.indexOf('game')) {

            }
          }
          
        }


      } else if (args[1] === "-l") {
        // List all reminders

      } else {
        // If there is no flag, then this is a new reminder
        // Might change so it needs a -n flag?
        let validConfig: boolean = true;

        // Vars to pass to the Reminder Object
        let name: string;
        let location: string;
        let startdate: Date;
        let enddate: Date;

        // What to populate after regex matches
        let nameArr: RegExpMatchArray;
        let locationArr: RegExpMatchArray;
        let datetimeArr: RegExpMatchArray;
      
        const patt_name: RegExp = /\$(.{1,32})\$/i;
        const patt_location: RegExp = /\|(.{1,32})\|/i;
        const patt_datetime: RegExp = /((0[1-9]|1[0-2])\/([0-2][1-9]|3[0-1])\/(20[0-9][0-9]) (0[1-9]|1[0-2]):([0-5][0-9]))-((0[1-9]|1[0-2])\/([0-2][1-9]|3[0-1])\/(20[0-9][0-9]) (0[1-9]|1[0-2]):([0-5][0-9]))/i;
        
        // Dissect the user message
        nameArr = msg.content.match(patt_name);
        locationArr = msg.content.match(patt_location);
        datetimeArr = msg.content.match(patt_datetime);

        if (nameArr) {
          name = nameArr[1];
        } else {
          msg.channel.send("Name was not valid. Needs to be between 1 and 32 characters, in between $$.");
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
          let currdate = new Date();
          startdate = new Date(datetimeArr[1]);
          enddate = new Date(datetimeArr[7]);

          // First check that start datetime is after current datetime
          // Then check that end datetime is after start datetime

          if (startdate.getTime() < currdate.getTime() || enddate.getTime() < startdate.getTime()) {
            msg.channel.send("Date was not valid. Your times are in the past.");
            validConfig = false;
          }
          
        } else {
          msg.channel.send("Date was not valid. ex) 01/12/2019 12:00-01/12/2019 12:50");
          validConfig = false;
        }
        

        if (validConfig) {
          // Got a valid data message, send it to the db
          let newReminder = new Reminder(name, location, startdate, enddate);
          newReminder.save();

          msg.channel.send("Valid data message.")
          console.log("Valid data message.");
        } else {
          msg.channel.send("That wasn't quite right, follow the format below.");
          msg.channel.send("?remind $Title$ |Location| 01/12/2019 12:00-01/12/2019 12:50");
        }
      }
    }

    else {
      msg.channel.send("I'm not sure what you mean. This doesn't appear to be a command.");
    }
  }
});


client.login(secrets.discord);
