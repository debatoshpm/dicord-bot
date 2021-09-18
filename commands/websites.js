module.exports = {
  name: "websites",
  description: "command to reply with websites",
  execute(message, args) {
    message
      .reply("debatoshpm.github.io")
      .then(() => console.log("replied with websites"))
      .catch(console.error());
  },
};
