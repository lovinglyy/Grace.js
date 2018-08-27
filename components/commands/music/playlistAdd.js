const { promisify } = require('util');
const { google } = require('googleapis');
const libs = require('./../../libs/');

module.exports = {
  /**
	* Add a youtube song to a user playlist. Redis client must be connected.
	* This function only make use of the Youtube API to search videos.
	* @param {string} msg - A Discord message.
	* @param {number} argSeparator The index where the message is separated
	* @param redisClient A connected and ready to use Redis client
	* @param {string} youtubeAPI The YoutubeAPI key, used to search songs.
	*/
  async cmd(msg, argSeparator, redisClient, youtubeAPI) {
    if (!redisClient || !youtubeAPI) return;

    const singleArgument = msg.content.substring(argSeparator);
    if (!singleArgument) return msg.reply('please tell me a valid youtube link or song name! *grrr*');
    const youtubeLinkPos = msg.content.indexOf('youtube.com/watch?v=');

    const search = (youtubeLinkPos === -1) ? singleArgument : msg.content.substring(youtubeLinkPos + 20, youtubeLinkPos + 31);
    if (!search) return msg.reply('please tell me a valid youtube link or song name! *grrr*');

    let songId;
    let songTitle;
    const searchResults = await libs.music.searchYoutubeSong(msg, youtubeAPI, search);
    if (!searchResults) return msg.reply('no results found :p');
    [songId, songTitle] = searchResults;

    if (songTitle.indexOf('!SongID') !== -1 || songTitle.indexOf('!SongTitle') !== -1) { return msg.reply('that song can\'t be added to the playlist.'); }

    const hgetAsync = promisify(redisClient.hget).bind(redisClient);
    let userPlaylist = await hgetAsync(msg.author.id, 'userPlaylist');

    if (userPlaylist.indexOf(songId) !== -1) return msg.reply('this song is already in your playlist! :p');
    if (!userPlaylist) userPlaylist = '';

    if (userPlaylist.length >= 420) {
      const playlistLength = libs.music.getPlaylistLength(userPlaylist);
      if (playlistLength > 14) return msg.reply('you reached the maximum amount of songs in your playlist, please remove some or clear it :3');
    }

    redisClient.hset(msg.author.id, 'userPlaylist', `${userPlaylist + songTitle}!SongTitle${songId}!SongID`);
    const songEmbed = {
      title: songTitle,
      color: 11529967,
      url: `https://www.youtube.com/watch?v=${songId}`,
      thumbnail: {
        url: `https://img.youtube.com/vi/${songId}/hqdefault.jpg`,
      },
    };
    msg.channel.send('Song added to your playlist!', { embed: songEmbed });
  },
};
