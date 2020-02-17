import { Message, RichEmbed } from 'discord.js';

let help_message: RichEmbed = new RichEmbed()
    .setColor("#4AC55E")
    .attachFile("./resources/acm-logo-thicc.png")
    .setTitle("Help Message")
    .setAuthor("Super Intelligent Gnome")
    .setDescription("I am here to help unite the communities and let them know of events going on around ACM!")
    .setThumbnail("attachment://acm-logo-thicc.png")

    .addField("?help", "Display a list of commands.")
    
    .addField("?remind", "Use to create reminders for yourself or others.")
    .addField("Example usage", "?remind $Title$ |Location| 12/24/2020 08:42-12/25/2020 13:45", true)
    .addField("?remind -p n |SEC|GEN|", "Send reminder n to the Security and General servers.", true)

    .addField("?scream", "Spread your word across every Discord.")
    .addField("Example usage", "?scream Welcome to ACM!", true)

    .addField("?repeat", "I repeat what you say back to you.")
    .addField("Examle usage:", "?repeat Does this emoji work?")

    .setTimestamp()
    .setFooter("If you have any questions, talk to Gavin Lewis.", "attachment://acm-logo-thicc.png");

function cmd_help(message: Message) {
    message.channel.send(help_message);
}

export { cmd_help };