const Discord = require("discord.js");
const client = new Discord.Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"],
  partials: [],
});
const fs = require("fs");
require("dotenv").config();

const PREFIX = "$";
let queue = [];

client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./commands/")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once("ready", () => {
  console.log("Bot is online!!");
  client.user.setActivity("Try Harding...");
});

client.on("messageCreate", (message) => {
  let args = message.content.substring(PREFIX.length).split(" ");
  if (message.author.bot) return;
  if (message.content.startsWith(PREFIX)) {
    switch (args[0]) {
      case "ping":
        client.commands.get("ping").execute(message, args);
        break;

      case "websites":
        client.commands.get("websites").execute(message, args);
        break;

      case "embed":
        client.commands.get("embed").execute(message, args);
        break;

      case "attachment":
        client.commands.get("attachment").execute(message, args);
        break;

      case "help":
        client.commands.get("help").execute(message, args);
        break;

      case "play":
        client.commands.get("music").execute(message, args, "play");
        break;

      case "skip":
        client.commands.get("music").execute(message, args, "skip");

      case "queue":
        client.commands.get("music").execute(message, args, "queue");
        break;

      case "pause":
        client.commands.get("music").execute(message, args, "pause");
        break;

      case "unpause":
        client.commands.get("music").execute(message, args, "unpause");
        break;

      case "leave":
        client.commands.get("music").execute(message, args, "leave");
    }
  }
});

client.login(process.env.TOKEN);
