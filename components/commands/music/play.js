const { promisify } = require('util');
const { MessageEmbed } = require('discord.js');
const libs = require('./../../libs/');

module.exports = {
  /**
  * Play a song by searching a song title in youtube, by a youtube url, or
  * by a number in the user playlist(more will be added in relation to this).
  * @param {string} msg - A Discord message.
  * @param {number} argSeparator The index where the message is separated.
  * @param redisClient A connected and ready to use Redis client.
  * @param {string} youtubeAPI The YoutubeAPI key, used to search songs.
  */
  async cmd(msg, argSeparator, redisClient, youtubeAPI) {
    if (!redisClient || !youtubeAPI) return;
    const singleArgument = msg.content.substring(argSeparator);
    const memberVoiceChannelID = msg.member.voice.channelID;
    const memberVC = msg.member.voice.channel;
    const graceVC = msg.guild.me.voice.channelID;

    if (!memberVoiceChannelID) {
      msg.reply('you need to be in a voice channel :p');
      return;
    } if (!singleArgument) {
      msg.reply('you need to tell me a song, with a name, youtube link or from your playlist.');
      return;
    } if (msg.guild.voiceConnection
      && msg.guild.voiceConnection.dispatcher
      && memberVoiceChannelID !== graceVC) {
      msg.reply('I\'m busy! owo');
      return;
    } if (memberVoiceChannelID !== graceVC
      && (memberVC.joinable === false || memberVC.speakable === false
      || memberVC.full === true)) {
      msg.reply(`please check my permissions for that voice chat or if it is full! I need to be able to speak and join that
        voice channel, huh.`);
      return;
    }

    const hgetAsync = promisify(redisClient.hget).bind(redisClient);
    const ytLinkPos = msg.content.indexOf('youtube.com/watch?v=');
    let songTitle;
    let songId;
    let searchSong;

    if (Number.isNaN(Number(singleArgument))) searchSong = singleArgument;
    if (ytLinkPos !== -1) searchSong = msg.content.substring(ytLinkPos + 20, ytLinkPos + 31);
    if (searchSong) {
      const searchResults = await libs.music.searchYoutubeSong(msg, youtubeAPI, searchSong);
      if (!searchResults) {
        msg.reply('no results found, did you try searching the song by name? :p');
        return;
      }
      [songId, songTitle] = searchResults;
    } else {
      const songNumber = Number(singleArgument) << 0;
      if (songNumber < 1 || songNumber > 15) {
        msg.reply('the song number doesn\'t look valid.');
        return;
      }

      const userPlaylist = await hgetAsync(msg.author.id, 'userPlaylist');
      if (!userPlaylist) {
        msg.reply('that song number isn\'t in your playlist.');
        return;
      }
      const song = libs.music.findSongByIndex(userPlaylist, songNumber);
      if (!song) {
        msg.reply('that song number isn\'t in your playlist.');
        return;
      }
      const songTitlePos = song.indexOf('!ST');
      songTitle = song.substring(0, songTitlePos);
      songId = song.substring(songTitlePos + 3);
    }

    if (!songTitle || !songId) {
      msg.reply('couldn\'t get the song title or id.');
      return;
    }

    let dispatcher;
    if (!msg.guild.voiceConnection) {
      dispatcher = await memberVC.join().then(
        connection => libs.music.ytdlAndPlay(songId, connection),
      );
    } else if (msg.guild.voiceConnection && !(msg.guild.voiceConnection.dispatcher)) {
      dispatcher = libs.music.ytdlAndPlay(songId, msg.guild.voiceConnection);
    } else {
      libs.music.addSongToQueue(msg.guild.id, songId, songTitle, redisClient, msg);
      return;
    }

    dispatcher.once('end', () => {
      libs.music.playNextQueueSong(msg.guild.id, msg.channel, redisClient);
    });
    const embed = new MessageEmbed()
      .setTitle(songTitle)
      .setURL(`https://www.youtube.com/watch?v=${songId}`)
      .setColor(11529967)
      .setThumbnail(`https://img.youtube.com/vi/${songId}/hqdefault.jpg`)
      .setAuthor('Song playing now');
    msg.channel.send({ embed });
  },
};
