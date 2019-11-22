import { Message } from "discord.js";

function cmd_tada(message: Message) {
    message.channel.send("This is no time for games.");
}

export { cmd_tada };