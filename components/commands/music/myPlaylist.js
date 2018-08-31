const { promisify } = require('util');

module.exports = {
  /**
	* Show a user playlist, Redis client must be connected.
	* @param {string} msg - A Discord message.
	* @param redisClient A connected and ready to use Redis client.
	*/
  async cmd(msg, redisClient) {
    if (!redisClient) return;

    const hgetAsync = promisify(redisClient.hget).bind(redisClient);
    const userPlaylist = await hgetAsync(msg.author.id, 'userPlaylist');
    if (!userPlaylist || userPlaylist.length < 1) return msg.reply('you don\'t have a playlist!');

    let formatedSongs = '';
    const userSongs = userPlaylist.split('!SID');
    for (let i = 0; i < userSongs.length - 1; i++) {
      if (!userSongs[i]) continue;
      const songTitle = userSongs[i].substring(0, userSongs[i].indexOf('!ST'));
      if (songTitle) formatedSongs += `[**${i + 1}**] ${songTitle}\n`;
    }

    const embed = {
      title: `${msg.member.displayName}'s playlist:`,
      color: 11529967,
      description: formatedSongs.substring(0, 1500),
    };
    msg.channel.send('Your playlist!', { embed });
  },
};
