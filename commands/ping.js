module.exports = {
  name: "ping",
  description: "command to reply with pong",
  execute(message, args) {
    message
      .reply("pong")
      .then(() => console.log("replied with pong"))
      .catch(console.error());
  },
};
