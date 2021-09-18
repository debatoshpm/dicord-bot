const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  demuxProbe,
} = require("@discordjs/voice");

module.exports = {
  name: "play",
  description: "",
  async execute(message, args) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.channel.send(
        "You need to be in channel to use that command"
      );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK"))
      return message.channel.send("I do not have the right permissions");

    if (!args.length)
      return message.channel.send("You need to mention the second argument!");

    const videoFinder = async (query) => {
      const videoResult = await ytSearch(query);
      return videoResult.videos.length > 1 ? videoResult.videos[0] : null;
    };

    const video = await videoFinder(args.join(" "));

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    if (video) {
      const stream = ytdl(video.url, {
        filter: "audioonly",
        opusEncoded: true,
        bitrate: 320,
        quality: "highestaudio",
        liveBuffer: 40000,
      });
      let resource = createAudioResource(stream);
      const player = createAudioPlayer();
      player.play(resource);
      connection.subscribe(player);

      await message.reply(`:thumbsup: Now Playing ***${video.title}***`);
    } else {
      message.channel.send("No video results found");
    }
  },
};
