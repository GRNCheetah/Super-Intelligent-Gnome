import { Client, Message } from "discord.js";
import { send_to_channel } from "../send";

// Yell at everyone on every server. This will definitely make friends.

const SERVERS: string = "EVERYONE"; 

function cmd_scream(message: Message, client: Client) {
    var toSend: string = message.content.substring(8);
    console.log(toSend);
    if (toSend.length >= 1) {
        send_to_channel(SERVERS, toSend, client);
    }
}

export { cmd_scream };