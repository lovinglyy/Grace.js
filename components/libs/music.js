const { google } = require('googleapis');
const { promisify } = require('util');

class Music {
  /**
   * Search Youtube using the v3 API and return a song id and title.
   * @param {Message} msg A Discord message of the user that requested this.
   * @param {*} youtubeAPI A Youtube v3 API key.
   * @param {*} search Search parameter for "q", usually a song name.
   */
  static async searchYoutubeSong(msg, youtubeAPI, search) {
    const youtube = google.youtube({ version: 'v3', auth: youtubeAPI });
    const song = await youtube.search.list({
      part: 'id,snippet',
      q: search,
      videoDimension: '2d',
      videoDuration: 'short',
      type: 'video',
      maxResults: 1,
    })
      .then(res => res.data)
      .catch(() => null);

    if (!song) return false;
    if (song.items && song.items.length > 0) {
      return [song.items[0].id.videoId, song.items[0].snippet.title];
    }
    return false;
  }

  /**
   * Get the song playlist of a user.
   * @param {string} userID ID of the user that we'll get the playlist.
   * @param {RedisClient} redisClient A redis client.
   */
  static async getUserPlaylist(userID, redisClient) {
    const hgetAsync = promisify(redisClient.hget).bind(redisClient);
    let userPlaylist = await hgetAsync(userID, 'userPlaylist');
    if (!userPlaylist) userPlaylist = '';
    return userPlaylist;
  }

  /**
  * Return the song count in a playlist. By some local tests, this is faster
  * than splitting an array and getting the length.
  * @param {string} playlist - String with a playlist.
  * @returns {number} Number of songs in the playlist.
  */
  static getPlaylistLength(playlist) {
    let songCount = 0;
    let playlistSongPos = playlist.indexOf('!SID');
    while (playlistSongPos !== -1) {
      songCount += 1;
      playlistSongPos = playlist.indexOf('!SID', playlistSongPos + 1);
    }
    return songCount;
  }

  static async getSong(singleArgument, msg, asyncRedis, ytAPI) {
    let songToSearch;
    const ytLinkPos = msg.content.indexOf('youtube.com/watch?v=');
    if (ytLinkPos !== -1) songToSearch = msg.content.substring(ytLinkPos + 20, ytLinkPos + 31);
    if (!Number(singleArgument)) songToSearch = singleArgument;

    if (songToSearch) {
      const searchResults = await this.searchYoutubeSong(msg, ytAPI, songToSearch);
      if (!searchResults) {
        msg.reply('song not found or the duration is not short.');
        return false;
      }
      return searchResults;
    }

    if (Number(singleArgument)) {
      const songNumber = Number(singleArgument) << 0;
      if (songNumber < 1 || songNumber > 15) {
        msg.reply('the song number doesn\'t look valid.');
        return false;
      }

      const userPlaylist = await asyncRedis.hget(msg.author.id, 'userPlaylist');
      if (!userPlaylist) {
        msg.reply('that song number isn\'t in your playlist.');
        return false;
      }

      const song = this.findSongByIndex(userPlaylist, songNumber);
      if (!song) {
        msg.reply('that song number isn\'t in your playlist.');
        return false;
      }

      const songTitlePos = song.indexOf('!ST');
      return [song.substring(0, songTitlePos), song.substring(songTitlePos + 3)];
    }
    return false;
  }

  /*
  * Return a song by the index that is show in the
  * user song playlist.
  */
  static findSongByIndex(playlist, songIndex) {
    const songs = playlist.split('!SID');
    songs.pop();
    return songs[songIndex - 1];
  }
}

module.exports = Music;
