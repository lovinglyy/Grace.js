const { google } = require('googleapis');
const { promisify } = require('util');

async function searchYoutubeSong(msg, youtubeAPI, search) {
  const youtube = google.youtube({ version: 'v3', auth: youtubeAPI });
  const song = await youtube.search.list({
    part: 'id,snippet',
    q: search,
    maxResults: 1,
  })
    .then(res => res.data)
    .catch((error) => {
      throw new Error(`Something ocurred with the searchYoutubeSong function. Error: ${error}`);
    });

  if (!song) return msg.reply('something failed when trying to connect to youtube!');
  if (song.items && song.items.length > 0) {
    return [song.items[0].id.videoId, song.items[0].snippet.title];
  }
  return false;
}

async function getUserPlaylist(userID, redisClient) {
  const hgetAsync = promisify(redisClient.hget).bind(redisClient);
  let userPlaylist = await hgetAsync(userID, 'userPlaylist');
  if (!userPlaylist) userPlaylist = '';
  return userPlaylist;
}

function checkForSomeoneInVC(members) {
  function memberCheck(member) {
    return member.user.bot === false && member.deaf === false;
  }
  const filteredMembers = members.filter(memberCheck);
  if (filteredMembers && filteredMembers.size > 0) {
    return true;
  }
  return false;
}

async function addSongToQueue(guildID, song, songTitle, redisClient, msg) {
  const llenAsync = promisify(redisClient.llen).bind(redisClient);
  const guildPlaylistLength = await llenAsync(`${guildID}_queue`);
  if (guildPlaylistLength >= 15) return msg.reply('the guild playlist is full!');
  redisClient.rpush(`${guildID}_queue`, `${song}${songTitle}`);
  msg.channel.send(`Song **${songTitle}** added to the song queue!`);
}

/**
 * Return the song count in a playlist. By some local tests, this is faster
 * than splitting an array and getting the length.
 * @param {string} playlist - String with a playlist.
 * @returns {number} Number of songs in the playlist.
 */
function getPlaylistLength(playlist) {
  let songCount = 0;
  let playlistSongPos = playlist.indexOf('!SongID');
  while (playlistSongPos !== -1) {
    songCount++;
    playlistSongPos = playlist.indexOf('!SongID', playlistSongPos + 1);
  }
  return songCount;
}

/*
* Return a song by the index that is show in the
* user song playlist.
*/
function findSongByIndex(playlist, songIndex) {
  const songs = playlist.split('!SongID');
  songs.pop();
  return songs[songIndex - 1];
}

module.exports = {
  searchYoutubeSong, findSongByIndex, getUserPlaylist, checkForSomeoneInVC, addSongToQueue, getPlaylistLength,
};
