const { google } = require('googleapis');
const { MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core');
const { promisify } = require('util');
const Grace = require('./../../');

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
   * Used to check if someone is on the voice channel, excluding bots and deaf members.
   * @param {Collection} members A collection of members in the voice channel.
   */
  static checkForSomeoneInVC(members) {
    function memberCheck(member) {
      return member.user.bot === false && member.deaf === false;
    }
    const filteredMembers = members.filter(memberCheck);
    if (filteredMembers && filteredMembers.size > 0) {
      return true;
    }
    return false;
  }

  /**
   * Add a song to a guild queue.
   * @param {Snowflake} guildID The Guild ID that the song will be added.
   * @param {string} song A youtube song id(11 characters length).
   * @param {string} songTitle The song title, to display.
   * @param {RedisClient} redisClient A Redis client ready to use, to store the song.
   * @param {Message} msg A Discord message, from the user that requested this.
   */
  static async addSongToQueue(guildID, song, songTitle, redisClient, msg) {
    const llenAsync = promisify(redisClient.llen).bind(redisClient);
    const guildPlaylistLength = await llenAsync(`${guildID}_queue`);
    if (guildPlaylistLength >= 15) return msg.reply('the guild playlist is full!');
    redisClient.rpush(`${guildID}_queue`, `${song}${songTitle}`);
    msg.channel.send(`Song **${songTitle}** added to the song queue!`);
    return true;
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

  /*
  * Return a song by the index that is show in the
  * user song playlist.
  */
  static findSongByIndex(playlist, songIndex) {
    const songs = playlist.split('!SID');
    songs.pop();
    return songs[songIndex - 1];
  }

  /**
   * Used to play songs from youtube.
   * @param {string} songID The youtube song id.
   * @param {VoiceConnection} voiceConnection The VoiceConnection of a guild.
   */
  static async ytdlAndPlay(songID, voiceConnection) {
    const stream = ytdl(`https://www.youtube.com/watch?v=${songID}`, { filter: 'audioonly' });
    const dispatcher = voiceConnection.play(stream, { type: 'webm/opus' });
    return dispatcher;
  }

  /**
   * Get the next song in a guild queue and play it.
   * @param {Snowflake} guildID The guild that we'll get the queue,
   * it accepts only the guild as it resolves this value.
   * @param {TextChannel} channel The channel to notify that the song will be played.
   * @param {RedisClient} redisClient A Redis client.
   */
  static async playNextQueueSong(guildID, channel, redisClient) {
    const guild = Grace.grace.getClient().guilds.resolve(guildID);
    if (!guild || !guild.voiceConnection) return;

    if (!this.checkForSomeoneInVC(guild.voiceConnection.channel.members)) {
      guild.voiceConnection.disconnect();
      guild.me.voice.channel.leave();
      redisClient.del(`${guild.id}_queue`);
      return;
    }
    const lpopAsync = promisify(redisClient.lpop).bind(redisClient);
    let nextSong = await lpopAsync(`${guild.id}_queue`);
    if (!nextSong) {
      guild.voiceConnection.disconnect();
      guild.me.voice.channel.leave();
      return;
    }
    const newSongTitle = nextSong.substring(11);
    nextSong = nextSong.substring(0, 12);
    const dispatcher = this.ytdlAndPlay(nextSong, guild.voiceConnection);
    dispatcher.once('end', () => {
      this.playNextQueueSong(guildID, channel, redisClient);
    });

    const embed = new MessageEmbed()
      .setTitle(newSongTitle)
      .setURL(`https://www.youtube.com/watch?v=${nextSong}`)
      .setColor(11529967)
      .setThumbnail(`https://img.youtube.com/vi/${nextSong}/hqdefault.jpg`)
      .setAuthor('Song playing now');

    channel.send({ embed });
  }
}

module.exports = Music;
