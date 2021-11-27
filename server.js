const path = require("path");
const mongoose = require("mongoose");
const ytdl = require("ytdl-core");
const express = require("express");
const cors = require("cors");
const ytSearch = require("yt-search");
require("dotenv").config();

const server = express();
server.use(cors());
server.use(express.json());

const uri = process.env.URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("DB connected");
});

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  songs: {
    type: String,
    required: true,
  },
});

const Playlist = mongoose.model("Playlist", playlistSchema);

server.set("view engine", "ejs");
server.set("views", path.join(__dirname, "views"));

server.all("/", (req, res) => {
  res.send("Bot is running!");
});

server.post("/getVideoData", async (req, res) => {
  const data = req.body.data;
  if (ytdl.validateURL(data)) {
    const songInfo = await ytdl.getInfo(data);
    const video = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
    };
    const videoData = JSON.stringify(video);
    res.send(videoData);
  } else {
    const videoResult = await ytSearch(data.join(" "));
    const videoRaw =
      videoResult.videos.length > 1 ? videoResult.videos[0] : null;
    const video = {
      title: videoRaw.title,
      url: videoRaw.url,
    };
    const videoData = JSON.stringify(video);
    res.send(videoData);
  }
});

server.get("/getplaylist/:name", (req, res) => {
  Playlist.find({ name: req.params.name })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

server.post("/addsongs", async (req, res) => {
  let name = req.body.name;
  let songs = req.body.songs.split(",");
  let songsConverted = [];
  for (let _song of songs) {
    const songInfo = await ytdl.getInfo(_song);
    let song = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
    };
    songsConverted.push(song);
  }
  const stringSongs = JSON.stringify(songsConverted);
  console.log(stringSongs);
  const newData = new Playlist({
    name,
    songs: stringSongs,
  });
  newData
    .save()
    .then(() => res.send("Songs Added from URLS"))
    .catch((err) => res.status(400).send(err));
});

server.get("/home", (req, res) => {
  res.render("home");
});

server.listen(3000);

function keepAlive() {
  server.listen(3000, () => {
    console.log("Server is ready.");
  });
}

module.exports = keepAlive;
