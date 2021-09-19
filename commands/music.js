const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
} = require("@discordjs/voice");

const queue = new Map();

module.exports = {
  name: "music",
  aliases: ["skip", "queue", "pause", "unpause", "stop"],
  description: "music bot",
  async execute(message, args, cmd) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.channel.send(
        "You need to be in a channel to execute this command!"
      );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
      return message.channel.send("You do not have the right permissions");

    const serverQueue = queue.get(message.guild.id);
    if (cmd === "play") {
      if (!args.length)
        return message.channel.send("You need to send the second parameter!");
      let songs = {};

      if (ytdl.validateURL(args[0])) {
        const songInfo = await ytdl.getInfo(args[0]);
        song = {
          title: song_info.videoDetails.title,
          url: song_info.videoDetails.video_url,
        };
      } else {
        const videoFinder = async (query) => {
          const videoResult = await ytSearch(query);
          return videoResult.videos.length > 1 ? videoResult.videos[0] : null;
        };

        const video = await videoFinder(args.join(" "));
        if (video) {
          song = { title: video.title, url: video.url };
        } else {
          message.channel.send("No search results");
        }
      }
      if (!serverQueue) {
        const queueConstructor = {
          voiceChannel: voiceChannel,
          textChannel: message.channel,
          connection: null,
          player: null,
          songs: [],
        };
        queue.set(message.guild.id, queueConstructor);
        queueConstructor.songs.push(song);

        try {
          const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
          });
          const player = createAudioPlayer();
          queueConstructor.connection = connection;
          queueConstructor.player = player;
          videoPlayer(message.guild, queueConstructor.songs[0]);
        } catch (err) {
          queue.delete(message.guild.id);
          message.channel.send("There was an error connecting");
          throw err;
        }
      } else {
        serverQueue.songs.push(song);
        return message.channel.send(
          `:thumbsup: Added to queue ***${song.title}***`
        );
      }
    } else if (cmd === "skip") skipSong(message, serverQueue);
    else if (cmd === "queue") queueInfo(message, serverQueue);
    else if (cmd === "pause") pauseSong(message, serverQueue);
    else if (cmd === "unpause") unpauseSong(message, serverQueue);
    else if (cmd === "stop") stopSong(message, serverQueue);
  },
};

const videoPlayer = async (guild, song) => {
  const songQueue = queue.get(guild.id);

  if (!song) {
    if (songQueue.connection) {
      songQueue.player.stop();
      songQueue.connection.destroy();
    }
    if (queue.has(message.guild.id)) queue.delete(guild.id);
    return;
  }

  const stream = ytdl(song.url, {
    filter: "audioonly",
    opusEncoded: true,
    quality: "highestaudio",
  });
  let resource = createAudioResource(stream);
  songQueue.player.play(resource);
  songQueue.connection.subscribe(songQueue.player);
  songQueue.player.on(AudioPlayerStatus.Idle, () => {
    songQueue.songs.shift();
    videoPlayer(guild, songQueue.songs[0]);
  });
  await songQueue.textChannel.send(
    `:thumbsup: Now Playing ***${song.title}***`
  );
};

const skipSong = (message, serverQueue) => {
  if (!serverQueue)
    return message.channel.send("There are no songs in the queue");
  serverQueue.songs.shift();
  videoPlayer(message.guild, serverQueue.songs[0]);
};

const queueInfo = (message, serverQueue) => {
  if (!serverQueue)
    return message.channel.send("There are no songs in the queue");
  if (!serverQueue.songs)
    return message.channel.send("There are no songs in the queue");
  title = [];
  serverQueue.songs.forEach((element) => {
    title.push(element.title);
  });
  message.channel.send("Queue:\n-" + title.join("\n-"));
};

const pauseSong = (message, serverQueue) => {
  serverQueue.player.pause();
  message.channel.send("Audio player paused");
};

const unpauseSong = (message, serverQueue) => {
  serverQueue.player.unpause();
  message.channel.send("Audio player unpaused");
};

const stopSong = (message, serverQueue) => {
  if (queue.has(message.guild.id)) queue.delete(message.guild.id);
  if (serverQueue.connection) {
    serverQueue.player.stop();
    serverQueue.connection.destroy();
    message.channel.send("Leaving channel :smiling_face_with_tear:");
  }
};
