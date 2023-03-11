const path = require("path");
const ytdl = require("ytdl-core");
const express = require("express");
const cors = require("cors");
const ytSearch = require("yt-search");

const server = express();
server.use(cors());
server.use(express.json());

server.all("/", (req, res) => {
  res.send("Server is running!");
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

server.listen(5000, () => {
  console.log("Server is ready.");
});
