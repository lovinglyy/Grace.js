module.exports = (msg) => {
  if (msg.content.length < 10) {
    msg.reply('you need to ask me something!');
    return;
  }
  if (Math.random() > 0.48) {
    msg.reply('I say yes!');
  } else {
    msg.reply('No!');
  }
};
