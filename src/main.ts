import * as Discord from 'discord.js';
// npm run dev

// Import commands from the commands/ folder
import { cmd_ping } from "./commands/ping";
import { cmd_help } from "./commands/help";
import { cmd_remind } from "./commands/remind";
import { cmd_scream } from "./commands/scream";
import { cmd_repeat } from "./commands/repeat";


// Info on changing user's nick names
//https://stackoverflow.com/questions/41247353/change-user-nickname-with-discord-js
// setInterval() might be able to be used to delay a timed message
// Could also just add a command only officers could use to push the events

// Info on seperating out the commands, kind of works but feels a bit wonk
// Maybe just because im tired
//https://discordjs.guide/command-handling/adding-features.html#a-dynamic-help-command


interface CONFIG {
  prefix: string,
  token: string
}

let client = new Discord.Client();
const config: CONFIG = require("../config.json");
let server_info = require("../server_info.json");

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

  // Keep for testing
  if (msg.content === 'ping') {
    cmd_ping(msg);
  }
  //console.log(msg.member.roles);
  if (cmdSwitch === '?' && msg.member.roles.find(role => role.name === "Officers") && msg.member.guild.name === "ACM General") {
    
    if (args[0] === "?help") {
      cmd_help(msg);
    } else if (args[0] === "?remind") {
      cmd_remind(msg, args, client);
    } else if (args[0] === "?scream") {
      cmd_scream(msg, client);
    } else if (args[0] === "?repeat") {
      cmd_repeat(msg);  
    } else {
      msg.channel.send(`Unkown command: ${args[0]}`);
    }
  }
});


client.login(config.token);
