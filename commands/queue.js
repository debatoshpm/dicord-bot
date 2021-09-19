module.exports = {
  name: "queue",
  description: "",
  execute(message, args, queue) {
    if (!queue) {
      message.channel.send("Queue is empty");
    } else {
      title = [];
      queue.forEach((element) => {
        title.push(element.title);
      });
      message.channel.send("Queue:\n-" + title.join("\n-"));
    }
  },
};
