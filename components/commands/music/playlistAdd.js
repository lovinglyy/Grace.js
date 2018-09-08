const { MessageEmbed } = require('discord.js');
const libs = require('./../../libs/');

/**
* Add a youtube song to a user playlist. Redis client must be connected.
* This function only make use of the Youtube API to search videos.
* @param {string} msg - A Discord message.
* @param {object} grace Grace object from the class.
*/
module.exports = async (msg, grace, asyncRedis) => {
  const { youtubeAPI } = grace.getConfig();
  if (!youtubeAPI) return;

  const singleArgument = libs.discordUtil.getSingleArg(msg);
  const youtubeLinkPos = msg.content.indexOf('youtube.com/watch?v=');

  const search = (youtubeLinkPos === -1)
    ? singleArgument : msg.content.substring(youtubeLinkPos + 20, youtubeLinkPos + 31);
  if (!search || search.length < 5 || search.length > 75) {
    msg.reply('please tell me a valid youtube link or song name! *grrr*');
    return;
  }

  const searchResults = await libs.music.searchYoutubeSong(msg, youtubeAPI, search);
  if (!searchResults) {
    msg.reply('no results found, did you try searching the song by name? :p');
    return;
  }

  const [songId, songTitle] = searchResults;

  if (songTitle.indexOf('!ST') !== -1 || songTitle.indexOf('!SID') !== -1) {
    msg.reply('that song can\'t be added to the playlist.');
    return;
  }

  let userPlaylist = await asyncRedis.hget(msg.author.id, 'userPlaylist');
  if (!userPlaylist) userPlaylist = '';
  if (userPlaylist.indexOf(songId) !== -1) {
    msg.reply('this song is already in your playlist! :p');
    return;
  }

  if (userPlaylist.length >= 270) {
    const playlistLength = libs.music.getPlaylistLength(userPlaylist);
    if (playlistLength > 14) {
      msg.reply('you reached the maximum amount of songs in your playlist, please remove some or clear it :3');
      return;
    }
  }

  grace.getRedisClient().hset(msg.author.id, 'userPlaylist', `${userPlaylist + songTitle}!ST${songId}!SID`);

  const embed = new MessageEmbed()
    .setTitle(songTitle)
    .setURL(`https://www.youtube.com/watch?v=${songId}`)
    .setColor(11529967)
    .setThumbnail(`https://img.youtube.com/vi/${songId}/hqdefault.jpg`)
    .setAuthor('Song playing now');
  msg.channel.send('Song added to your playlist!', { embed });
};
