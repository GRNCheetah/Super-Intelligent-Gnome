import { Message, RichEmbed } from 'discord.js';

let help_message: RichEmbed = new RichEmbed()
    .setColor("#4AC55E")
    .setTitle("Help Message")
    .setAuthor("Gnome")
    .setDescription("I am here to help unite the communities and let them know of events going on around ACM!")
    .addField("?help", "Display a list of commands.")
    .addField("?remind", "Use to create reminders for yourself or others.")
    .addField("Example usage", "?remind $Title$ |Location| 12/24/2020 08:42-12/25/2020 13:45", true)
    .addField("?remind -p n |SEC|GEN|", "Send reminder n to the Security and General servers.",true)
    .setTimestamp()
    .setFooter("If you have any questions, talk to Gavin Lewis. ")



function cmd_help(message: Message) {
    message.channel.send(help_message);
}

export { cmd_help };