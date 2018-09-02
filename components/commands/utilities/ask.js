/*
* Basic command to "ask" Grace something.
*/

module.exports = {
  cmd(msg) {
    if (Math.random() > 0.48) {
      msg.reply('I say yes!');
    } else {
      msg.reply('No!');
    }
  },
};
