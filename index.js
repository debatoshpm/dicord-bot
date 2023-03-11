const {
  Client,
  IntentsBitField,
  Collection,
  ActivityType,
  Events,
} = require("discord.js");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const server = express();
server.use(cors());

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

const PREFIX = "$";

client.commands = new Collection();
const commandFiles = fs
  .readdirSync("./commands/")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once(Events.ClientReady, () => {
  console.log("Bot is online!!");
  client.user.setActivity("'$help' for more details", {
    type: ActivityType.Listening,
  });
});

client.on(Events.MessageCreate, (message) => {
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
        break;

      case "queue":
        client.commands.get("music").execute(message, args, "queue");
        break;

      case "pause":
        client.commands.get("music").execute(message, args, "pause");
        break;

      case "unpause":
        client.commands.get("music").execute(message, args, "unpause");
        break;

      case "stop":
        client.commands.get("music").execute(message, args, "stop");
        break;

      case "playlist":
        client.commands.get("music").execute(message, args, "playlist");
        break;

      case "servers":
        const Guilds = client.guilds.cache.map((guild) => guild.name);
        message.channel.send("Active Servers:\n-> " + Guilds.join("\n-> "));
        break;
    }
  }
});

server.all("/", (req, res) => {
  res.send("Bot is running!");
});

server.listen(3000, () => {
  console.log("Bot is ready.");
});

client.login(process.env.TOKEN);
