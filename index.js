const Discord = require("discord.js");
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
// const ytdl = require("ytdl-core");
const fs = require("fs");
require("dotenv").config();

const PREFIX = "$";

// var servers = {};
client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./commands/")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on("ready", () => {
  console.log("Bot is online!!");
  client.user.setActivity("Try Harding......", { type: "CUSTOM" });
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

      // case "play": {
      //   function play(connection, message) {
      //     var server = servers[message.guild.id];
      //     server.dispatcher = connection.playStream(
      //       ytdl(server.queue[0], { filter: "audioonly" })
      //     );

      //     server.queue.shift();

      //     server.diuspatcher.on("end", function () {
      //       if (server.queue[0]) {
      //         play(connection, message);
      //       } else {
      //         connection.disconnect();
      //       }
      //     });
      //   }

      //   if (!args[1]) {
      //     message.channel.send("you need to enter the link");
      //     return;
      //   }
      //   if (!message.member.voice) {
      //     message.channel.send("You need to be in a channel to play music!");
      //     return;
      //   }

      //   if (!servers[message.guild.id])
      //     servers[message.guild.id] = { queue: [] };

      //   var server = servers[message.guild.id];

      //   server.queue.push(args[1]);

      //   //depreciation not handled
      //   if (!message.guild.voiceStates)
      //     message.member.voice.setChannel().then(function (connection) {
      //       play(connection, message);
      //     });
      // }
    }
  }
});

client.login(process.env.TOKEN);
