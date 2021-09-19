const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {
  name: "leave",
  descriiption: "",
  async execute(message, args, queue) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.channel.send(
        "You need to be in a voice channel to stop the music!!"
      );
    const connection = getVoiceConnection(voiceChannel.guild.id);
    const player = connection.state.subscription.player;
    queue = [];
    if (player.state.status == "playing" || player.state.status == "idle") {
      await player.stop();
    }
    await connection.destroy();
    await message.channel.send("Leaving channel :smiling_face_with_tear:");
  },
};
