const fetch = require('node-fetch');

const cuteCatMessages = [
  'a cute kitty for you!',
  'so cuteeeeeee!!!!',
  'a ~~bunny~~ cat for u!',
  'it\'s so cute, don\'t you think?',
  'ALL HUMANS SHOULD OBEY THE CAT LORD... ugh, what happened?',
  'one, two, three cute cats!',
  'here kittennn',
  'I love cats!',
  'I already told you that I love cats?',
  'nobody is ever tired of cute cat gifs',
];

module.exports = async (msg) => {
  const search = await fetch('https://api.thecatapi.com/v1/images/search?format=src&mime_types=image/gif', {
    method: 'GET',
  });
  if (!search || !search.url) {
    msg.reply('a problem occurred in the cat factory.');
    return;
  }
  msg.reply(`${cuteCatMessages[~~(Math.random() * (cuteCatMessages.length))]} uwu\n${search.url}`);
};
