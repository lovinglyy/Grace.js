const { promisify } = require('util');
const libs = require('./../../libs/');

module.exports = {
  /**
	* Remove a song from the user playlist by it's number.
	* '+7' numbers in the strings manipulations are representing the
	* amount of chars in '!SongID', indexOf has an awesome performance
	* and it try to get the most of it.
	* @param {string} msg - A Discord message.
	* @param redisClient A connected and ready to use Redis client.
	*/
  async cmd(msg, argSeparator, redisClient) {
    if (!redisClient) return;

    const removeIndex = ~~(msg.content.substring(argSeparator));
    if (!removeIndex || Number.isNaN(removeIndex)) return msg.reply('type only the song number!');
    if (removeIndex < 1 || removeIndex > 15) return msg.reply('tell me a valid song number!');

    const hgetAsync = promisify(redisClient.hget).bind(redisClient);
    const userPlaylist = await hgetAsync(msg.author.id, 'userPlaylist');
    if (!userPlaylist) return msg.reply('you don\'t have a playlist!');

    if (userPlaylist.split('!SongID').length - 1 < removeIndex) return msg.reply('invalid song number specified.');

    const song = libs.music.findSongByIndex(userPlaylist, removeIndex);
    if (!song) return msg.reply('that song number isn\'t in your playlist.');

    const newPlaylist = userPlaylist.replace(`${song}!SongID`, '');
    redisClient.hset(msg.author.id, 'userPlaylist', newPlaylist);
    msg.channel.send('Song removed from the playlist!');
  },
};
