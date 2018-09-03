const { promisify } = require('util');
const libs = require('./../../libs/');

module.exports = {
  /**
  * Remove a song from the user playlist by it's number.
  * @param {string} msg - A Discord message.
  * @param {object} grace Grace object from the class.
  */
  async cmd(msg, grace) {
    const redisClient = grace.getRedisClient();
    if (!redisClient) return;

    const singleArgument = libs.discordUtil.getSingleArg(msg);
    const removeIndex = ~~(Number(singleArgument));

    if (!removeIndex || Number.isNaN(removeIndex)) {
      msg.reply('type only the song number!');
      return;
    }
    if (removeIndex < 1 || removeIndex > 15) {
      msg.reply('tell me a valid song number!');
      return;
    }

    const hgetAsync = promisify(redisClient.hget).bind(redisClient);
    const userPlaylist = await hgetAsync(msg.author.id, 'userPlaylist');
    if (!userPlaylist) {
      msg.reply('you don\'t have a playlist!');
      return;
    }

    if (userPlaylist.split('!SID').length - 1 < removeIndex) {
      msg.reply('invalid song number specified.');
      return;
    }

    const song = libs.music.findSongByIndex(userPlaylist, removeIndex);
    if (!song) {
      msg.reply('that song number isn\'t in your playlist.');
      return;
    }

    const newPlaylist = userPlaylist.replace(`${song}!SID`, '');
    redisClient.hset(msg.author.id, 'userPlaylist', newPlaylist);
    msg.channel.send('Song removed from the playlist!');
  },
};
