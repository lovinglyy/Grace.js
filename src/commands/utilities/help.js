const { help } = require('./../../util/Constants');

/**
* Send the help embed.
* @param {string} msg - A str that need to be a Discord message.
* @param {object} grace Grace object from the class.
*/
module.exports = (msg) => {
  msg.author.send(help[0])
    .then(() => {
      msg.author.send(help[1]).catch(() => {});
      msg.react('❤').catch(() => {});
    })
    .catch(() => msg.channel.send('please allow DMs so I can send you the command list without making spam in the channel.'))
    .catch(() => {});
};
