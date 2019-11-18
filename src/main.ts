import { Reminder, ReminderLoader } from "./reminder";
//import * as server_info from '../server_info.json'
import * as Discord from 'discord.js';
import { fstat } from "fs";

// Info on changing user's nick names
//https://stackoverflow.com/questions/41247353/change-user-nickname-with-discord-js
// setInterval() might be able to be used to delay a timed message
// Could also just add a command only officers could use to push the events

interface DISCORD_INFO {
  ACMGeneral: {
    guild: string;
    channel: string;
  };
  CDT: {
    guild: string;
    channel: string;
  };
};

let secrets: { discord: string } = require("../secrets.json");
let server_info = require("../server_info.json");

const client = new Discord.Client();



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

function send_to_channel(destination: string, message: string): void {
  try {
    let guild: Discord.Guild = client.guilds.find(guild => guild.name === server_info[destination].guild);
    if (guild) {
      let channel: Discord.TextChannel = guild.channels.find(channel => channel.name === server_info[destination].channel) as Discord.TextChannel;
      if (channel) {
        channel.send(message);
      } else {
        console.log("Channel: " + server_info[destination].channel + " not found");
      }
    } else {
      console.log("Guild: " + server_info[destination].guild + " not found");
    }
  }
  catch (err) {
    console.log("Error sending the message.");
    throw err;
  }
  
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
        // ?remind -p [all|n] |everyone|web|sec|w|game|comp|data|hack|
        //let reminderNum: number = 0;  // The reminder number in the list [0+]
        let toSend: string = "";          // The string to send to the discords, determined by reminder
        
        let reminderLoader: ReminderLoader = new ReminderLoader();    // Used to load reminders from storage
        let reminder: Reminder;           // The Reminder object to send

        let sendMsg: boolean = true;      // Goes false if there is not a specified reminder to push
        let singleSends: boolean = true;  // Goes false if everyone is in the 'to send' part of the message
        
        // Right now checks that coms are like |sec|web|
        // Need opening and closing pipes
        let patt_communities: RegExp = /\|(\w+\|){1,7}/i;
        let communitiesArr: RegExpMatchArray = msg.content.match(patt_communities);

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

        // Make sure user picked a valid reminder
        if (sendMsg) {
          // Split on |, make Uppercase bc that's what is in server_info.json
          // The map part trims whitespace of individual parts, so 'sec |sec' won't double send
          let targetDiscords: string[] = communitiesArr[0].toLocaleUpperCase().split("|").map(item => item.trim());
          let filteredTargets: string[] = [];
          targetDiscords.filter((item: string, index: number) => {
            if (targetDiscords.indexOf(item) === index)
              filteredTargets.push(item);
          });
          console.log(filteredTargets);
          // Parse what server to send the reminder to
          if (filteredTargets.indexOf('EVERYONE') > -1) {
            // Send to all discords
            singleSends = false;    // Don't doouble send to individual stuff
          }

          if (singleSends) {
            //console.log(setTarDiscords)
            filteredTargets.forEach( function(community: string) {
              // If input is '|sec|web|', the array will contain ['', 'SEC', 'WEB'],
              // b/c .split('|') still matches the first '|'. Make sure the item we
              // are sending to is not an empty string.
              // This will still attempt to send to communities that do not exist,
              // but we can just let the user know what communities we have sent to.
              if (community) {
                //send_to_channel(community.trim(), toSend);
                console.log("Simulate sending");
              }
            });
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
