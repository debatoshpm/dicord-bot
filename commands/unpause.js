const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  getVoiceConnection,
  VoiceConnectionStatus,
} = require("@discordjs/voice");

module.exports = {
  name: "unpause",
  description: "",
  execute(message, args) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.channel.send(
        "You need to be in a voice channel to stop the music!!"
      );
    const connection = getVoiceConnection(voiceChannel.guild.id);
    const player = connection.state.subscription.player;
    if (player.state.status == "paused") {
      player.unpause();
      message.channel.send("Audio player unpaused");
    }
  },
};