import { Reminder, ReminderLoader } from "./reminder";

import * as Discord from 'discord.js';

import fs = require('fs');

// Info on changing user's nick names
//https://stackoverflow.com/questions/41247353/change-user-nickname-with-discord-js
// setInterval() might be able to be used to delay a timed message
// Could also just add a command only officers could use to push the events

interface DISCORD_DATA {
  guild: string,
  channel: string
};

interface DISCORD_INFO {
  ACMGeneral: DISCORD_DATA,
  CDT: DISCORD_DATA
};
// Info on seperating out the commands, kind of works but feels a bit wonk
// Maybe just because im tired
//https://discordjs.guide/command-handling/adding-features.html#a-dynamic-help-command


interface CONFIG {
  prefix: string,
  token: string
}

//let secrets: { discord: string } = require("../secrets.json");
let client = new Discord.Client();
const config: CONFIG = require("../config.json");
let server_info = require("../server_info.json");


// const DISCORD_INFO: ACMGuilds = {
//   ACMGeneral: {
//     guild: "276873078703783948",
//     channel: ""
//   },
//   CDT: {
//     guild: "277576792334925834",
//     channel: "511977781207367680"
//   }
// };

function send_to_channel(targets: string, message: string): void {
  // targets: A string that looks like |sec|web|
  // message: The exact string you want sent

  let filteredTargets: string[] = [];

  if (targets.indexOf("EVERYONE") === -1) {
    let targetDiscords: string[] = targets.toLocaleUpperCase().split("|").map(item => item.trim());
  
    targetDiscords.filter((item: string, index: number) => {
    if (targetDiscords.indexOf(item) === index)
      filteredTargets.push(item);
    });
  } else {
    // Add all communities to the targets if everyone was there or no one was
    filteredTargets = ["GEN", "SEC", "WEB", "GAME", "COMP", "W", "HACK", "DATA", "CDT"];
  }
  
  // TODO: Add a check back to the user in an embed to make sure all info is correct before sending

  console.log(filteredTargets);

  filteredTargets.forEach( function(community: string) {
    if (community) {
      try {
        let guild: Discord.Guild = client.guilds.find(guild => guild.name === server_info[community].guild);
        if (guild) {
          let channel: Discord.TextChannel = guild.channels.find(channel => channel.name === server_info[community].channel) as Discord.TextChannel;
          if (channel) {
            console.log("Simulate sending")
            console.log(message);
            //channel.send(message);
          } else {
            console.log("Channel: " + server_info[community].channel + " not found");
          }
        } else {
          console.log("Guild: " + server_info[community].guild + " not found");
        }
      }
      catch (err) {
        console.log("Error sending the message.");
        throw err;
      }
    }
  })
};


client.on('ready', () => {
  console.log('Logged in as ' + client.user.tag);
  
  // Example for sending messages at a set time.
  //let interval = setInterval(function() { console.log("Hello"); }, 150);
  let guilds = client.guilds;

  // Send test announcement to the CDT Discord  
  // send_to_channel("CDT", "This is a test");
});

client.on('message', msg => {

  // ignore bots and self, and messages that dont start with prefix
  if (msg.author.bot) return;

  var args:string[] = msg.content.split(' ', 4);
  var cmdSwitch:string = args[0].charAt(0);

  console.log(args);

  if (msg.content === 'ping') {
    msg.channel.send('pong');
    //msg.reply('pong');
  }

  if (msg.content === '?tada') {
    msg.channel.send('Its not party time. ')
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
        // ?remind -p [all|n] |everyone|web|sec|w|game|comp|data|hack|
        //let reminderNum: number = 0;  // The reminder number in the list [0+]
        let toSend: string = "";          // The string to send to the discords, determined by reminder
        
        let reminderLoader: ReminderLoader = new ReminderLoader();    // Used to load reminders from storage
        let reminder: Reminder;           // The Reminder object to send

        let sendMsg: boolean = true;      // Goes false if there is not a specified reminder to push
        
        // Right now checks that coms are like |sec|web|
        // Need opening and closing pipes
        let patt_communities: RegExp = /\|(\w+\|){1,7}/i;
        let communitiesArr: RegExpMatchArray = msg.content.match(patt_communities);

        // Determines which reminder to push
        if (args[2] === "all") {
          // Push all the reminders
          // Probably shouldn't do this one
          console.log("This will be implemented later.");
        } else if (typeof args[2] === "string" && !isNaN(Number(args[2]))) {
          // That line checks to make sure what was passed is a number
          // Push just the number given
          if (reminderLoader.valid_num(Number(args[2]))) {
            // Make sure we have a valid number first
            reminder = reminderLoader.get_reminderByNum(Number(args[2]));
            console.log(typeof (reminder));
            toSend = reminder.get_string();
            console.log("Going to toSend");
          } else {
            // Bad number
            console.log("not a number");
            console.log(args[2]);
            sendMsg = false;
          }
        } else {
          console.log("No idea which reminder to grab");
          sendMsg = false;
        }

        // Make sure user picked a valid reminder
        if (sendMsg) {
          send_to_channel(communitiesArr[0].trim(), toSend);
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
          console.log(startdate);
          console.log(enddate);
          msg.channel.send("Date was not valid. ex) 01/12/2019 12:00-01/12/2019 12:50");
          validConfig = false;
        }
        

        if (validConfig) {
          // Got a valid data message, send it to the db
          let newReminder = new Reminder(msg.author.toString(), name, location, startdate, enddate);
          newReminder.save();

          msg.channel.send("Valid data message.");
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


client.login(config.token);
