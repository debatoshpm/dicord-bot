const Discord = require("discord.js");

module.exports = {
  name: "help",
  description: "",
  execute(message, args) {
    const Embed = new Discord.MessageEmbed()
      .setTitle("botKiller Discord Bot")
      .setColor(0xff0000)
      .setDescription(
        "General purpose dicord server bot with music commands made by botKiller"
      )
      .addFields({
        name: "Visit Repository",
        value: "https://github.com/debatoshpm/dicord-bot",
      })
      .addFields({
        name: "General Commands",
        value: "Added Soon",
      })
      .addFields({
        name: "Music Commands",
        value:
          "**$play**: plays a song or adds to queue\n**$skip**: skips the current song\n**$queue**: shows the current queue list\n**$pause**: pauses the audio player\n**$unpause**: unpauses the audio player\n**$stop**: stops the player or resets it.",
      })
      .setTimestamp()
      .setFooter("https://debatoshpm.github.io/");
    message.channel.send({ embeds: [Embed] });
  },
};
