import { Client, Guild, Message, TextChannel, RichEmbed, ReactionEmoji, MessageReaction, User } from "discord.js";
let server_info = require("../server_info.json");

/* Build an embed from the given information, intended to use as a check
*  before sending a message.
*/
function build_embed(msg: string, dest: string) {
  return new RichEmbed()
    .setColor("#4AC55E")
    .attachFile("./resources/acm-logo-thicc.png")
    .setTitle("Just a quick double-check.")
    .setAuthor("Super Intelligent Gnome")
    .addField("Message:", msg)
    .addField("Destination:", dest)
    .setTimestamp()
    .setFooter("If you have any questions, talk to Gavin Lewis.", "attachment://acm-logo-thicc.png");
}

/* Sends a quick and dirty double check message, need a check in the main loop to see
*  if the embed gets the proper react to send
*/
export async function send_checkup(discord_message: Message, targets: string, message: string)  { 
  // Should only ever be a Message, not a Message array because we only send one message
  const checkupMsg: Message | Message[] = await discord_message.channel.send(build_embed(message, targets));
  
  const filter = (reaction: MessageReaction, user: User) => {
    return ['👌'].includes(reaction.emoji.name) && user.id === discord_message.author.id;
  }
  if (checkupMsg instanceof Message) {
    checkupMsg.awaitReactions(filter).then(collected => {
      const reaction: MessageReaction = collected.first();

      if (reaction.emoji.name === '👌') {
        checkupMsg.reply("Thumbs up");
      } else {
        checkupMsg.reply("That is not a thumbs up");
      }

    })
  } else {
    checkupMsg[0].awaitReactions(filter);
  }
  
}

/*  Will send the contents of an approved embed to the intended destination
*/
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
      filteredTargets = ["GEN", "SEC", "WEB", "GAME", "COMP", "W", "HACK", "DATA"];
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