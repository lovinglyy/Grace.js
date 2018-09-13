/**
* Show a user playlist, Redis client must be connected.
* @param {string} msg - A Discord message.
* @param {object} asyncRedis Redis async promisified functions
*/
module.exports = async (msg, grace) => {
  const userPlaylist = await grace.getRedisClient().hget(`user:${msg.author.id}`, 'userPlaylist');
  if (!userPlaylist || userPlaylist.length < 1) {
    msg.reply('you don\'t have a playlist!');
    return;
  }

  let formatedSongs = '';
  const userSongs = userPlaylist.split('!SID');
  for (let i = 0; i < userSongs.length - 1; i += 1) {
    if (userSongs[i]) {
      const songTitle = userSongs[i].substring(0, userSongs[i].indexOf('!ST'));
      if (songTitle) formatedSongs += `[**${i + 1}**] ${songTitle}\n`;
    }
  }

  const embed = {
    title: `${msg.member.displayName}'s playlist:`,
    color: 11529967,
    description: formatedSongs.substring(0, 1500),
  };
  msg.channel.send('Your playlist!', { embed });
};
