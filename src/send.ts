import { Client, Guild, TextChannel } from "discord.js";
let server_info = require("../server_info.json");

export function send_to_channel(targets: string, message: string, client: Client): void {
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
          let guild: Guild = client.guilds.find(guild => guild.name === server_info[community].guild);
          if (guild) {
            let channel: TextChannel = guild.channels.find(channel => channel.name === server_info[community].channel) as TextChannel;
            if (channel) {
              console.log("Simulate sending")
              console.log(message);
              channel.send(message);
            } else {
              console.log("Channel: " + server_info[community].channel + " not found");
            }
          } else {
            console.log("Guild: " + server_info[community].guild + " not found");
          }
        }
        catch (err) {
          console.log("Error sending the message.");
        }
      }
    })
  };