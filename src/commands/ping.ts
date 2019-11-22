import { Message } from "discord.js";

function cmd_ping(message: Message) {
    message.channel.send('pong');
}

export { cmd_ping };