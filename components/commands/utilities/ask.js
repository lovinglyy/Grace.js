/*
* Basic command to "ask" Grace something.
*/

module.exports = {
  cmd(msg) {
    const rand = Math.random();
    if (rand > 0.48) {
      msg.reply('I say yes!');
    } else {
      msg.reply('No!');
    }
  },
};
