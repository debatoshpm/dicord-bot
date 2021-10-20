const mongoose = require("mongoose");
const ytdl = require("ytdl-core");
const express = require("express");
const cors = require("cors");
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

server.all("/", (req, res) => {
  res.send("Bot is running!");
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
  for (let i = 0; i < songs.length; i++) {
    const songInfo = await ytdl.getInfo(songs[i]);
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

server.listen(3000);

function keepAlive() {
  server.listen(3000, () => {
    console.log("Server is ready.");
  });
}

module.exports = keepAlive;
