const fetch = require('node-fetch');
const { cuteCatMessages } = require('./../../util/Constants');

module.exports = async (msg) => {
  const search = await fetch('https://api.thecatapi.com/v1/images/search?format=src&mime_types=image/gif', {
    method: 'GET',
  })
    .catch(() => null);
  if (!search || !search.url) {
    msg.reply('a problem occurred in the cat factory.');
    return;
  }
  msg.reply(`${cuteCatMessages[(Math.random() * (cuteCatMessages.length)) << 0]} uwu\n${search.url}`);
};
