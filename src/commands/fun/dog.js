const fetch = require('node-fetch');
const { cuteDogMessages } = require('./../../util/Constants');

module.exports = async (msg) => {
  const search = await fetch('https://dog.ceo/api/breeds/image/random', { method: 'GET' })
    .catch(() => null);
  if (!search) {
    msg.reply('a problem occurred in the doggo factory.')
      .catch(() => {});
    return;
  }
  const searchJson = await search.json();
  if (!searchJson || !searchJson.message) {
    msg.reply('a problem occurred in the doggo factory.')
      .catch(() => {});
    return;
  }
  msg.reply(`${cuteDogMessages[(Math.random() * (cuteDogMessages.length)) << 0]}\n${searchJson.message}`)
    .catch(() => {});
};
