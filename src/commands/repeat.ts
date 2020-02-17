import { Client, Message } from "discord.js";
import { send_to_channel, send_checkup } from "../send";

// Repeats the message back to you.

function cmd_repeat(message: Message) {
    var toSend: string = message.content.substring(8);
    console.log(toSend);
    if (toSend.length >= 1) {
        send_checkup(message, "Here", toSend);
        message.channel.send(toSend);
    }
}

export { cmd_repeat };