const { google } = require('googleapis');
const { MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core');
const { promisify } = require('util');

const guildQueues = [];

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
    const vcMembers = members.filter(member => member.user.bot === false
      && member.voice.deaf === false);
    if (vcMembers && vcMembers.size > 0) {
      return true;
    }
    return false;
  }

  /**
   * Add a song to a guild queue.
   * @param {string} song A youtube song id(11 characters length).
   * @param {string} songTitle The song title, to display.
   * @param {Message} msg A Discord message, from the user that requested this.
   */
  static async addSongToQueue(song, songTitle, msg) {
    if (guildQueues[msg.guild.id]) {
      if (guildQueues[msg.guild.id].length >= 15) return msg.reply('the guild playlist is full!');
      guildQueues[msg.guild.id].push(`${song}${songTitle}`);
    } else {
      guildQueues[msg.guild.id] = [`${song}${songTitle}`];
    }
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


  static async getSong(singleArgument, msg, asyncRedis, ytAPI) {
    let songToSearch;
    const ytLinkPos = msg.content.indexOf('youtube.com/watch?v=');
    if (ytLinkPos !== -1) songToSearch = msg.content.substring(ytLinkPos + 20, ytLinkPos + 31);
    if (!Number(singleArgument)) songToSearch = singleArgument;

    if (songToSearch) {
      const searchResults = await this.searchYoutubeSong(msg, ytAPI, songToSearch);
      if (!searchResults) {
        msg.reply('no results found, did you try searching the song by name? :p');
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

  /**
   * Used to play songs from youtube.
   * @param {string} songID The youtube song id.
   * @param {VoiceConnection} guild The guild where the song will be played.
   */
  static async ytdlAndPlay(songID, guild) {
    if (!guild.voiceConnection) return false;
    const stream = ytdl(`https://www.youtube.com/watch?v=${songID}`, { filter: 'audioonly' });
    const dispatcher = guild.voiceConnection.play(stream, { type: 'webm/opus' });
    return dispatcher;
  }

  /**
   * Get the next song in a guild queue and play it.
   * @param {Snowflake} guildID The guild that we'll get the queue,
   * it accepts only the guild as it resolves this value.
   * @param {TextChannel} channel The channel to notify that the song will be played.
   * @param {Discord Client} client Grace client, that will be used to resolve the guid.
   */
  static async playNextQueueSong(guildID, channel, client) {
    const guild = client.guilds.resolve(guildID);
    if (!guild || !guild.voiceConnection) return;

    if (!this.checkForSomeoneInVC(guild.voiceConnection.channel.members)) {
      guild.voiceConnection.disconnect();
      guild.me.voice.channel.leave();
      guildQueues[guildID].length = 0;
      return;
    }

    if (!guildQueues[guildID] || guildQueues[guildID].length === 0) {
      guild.voiceConnection.disconnect();
      guild.me.voice.channel.leave();
      return;
    }

    let nextSong = guildQueues[guildID].pop();
    const newSongTitle = nextSong.substring(11);
    nextSong = nextSong.substring(0, 12);
    const dispatcher = await this.ytdlAndPlay(nextSong, guild);
    if (!dispatcher) return;
    dispatcher.once('end', () => {
      this.playNextQueueSong(guildID, channel, client);
    });
    const embed = new MessageEmbed()
      .setTitle(newSongTitle)
      .setURL(`https://www.youtube.com/watch?v=${nextSong}`)
      .setColor(11529967)
      .setThumbnail(`https://img.youtube.com/vi/${nextSong}/hqdefault.jpg`)
      .setAuthor('Song playing now');

    channel.send({ embed });
  }

  /**
   * Get a guild queue.
   * @param {string} guildID ID of the guild to get the queue.
   */
  static getQueue(guildID) {
    if (!guildQueues[guildID]) return false;
    return guildQueues[guildID];
  }

  /**
   * Clear a guild queue.
   * @param {string} guildID ID of the guild that will be cleared.
   */
  static clearQueue(guildID) {
    if (!guildQueues[guildID]) return false;
    guildQueues[guildID].length = 0;
    return true;
  }
}

module.exports = Music;
