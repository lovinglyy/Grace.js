const fetch = require('node-fetch');
const { cuteBunnyMessages } = require('./../../util/Constants');

module.exports = async (msg) => {
  const search = await fetch('https://api.bunnies.io/v2/loop/random/?media=gif', { method: 'GET' })
    .catch(() => null);
  if (!search) {
    msg.reply('a problem occurred in the bunny factory.')
      .catch(() => {});
    return;
  }
  const searchJson = await search.json();
  if (!searchJson || !searchJson.media) {
    msg.reply('a problem occurred in the bunny factory.')
      .catch(() => {});
    return;
  }
  msg.reply(`${cuteBunnyMessages[(Math.random() * (cuteBunnyMessages.length)) << 0]}\n${searchJson.media.gif}`)
    .catch(() => {});
};
