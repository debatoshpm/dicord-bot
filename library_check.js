const { generateDependencyReport } = require("@discordjs/voice");
var pathToFfmpeg = require("ffmpeg-static");
console.log(pathToFfmpeg);

console.log(generateDependencyReport());
