const { promisify } = require('util');
const ytdl = require('ytdl-core');

const streamOptions = { seek: 0, volume: 1 };
const opus = require('node-opus');
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
    const memberVoiceChannelID = msg.member.voiceChannelID;
    const memberVC = msg.member.voiceChannel;
    const graceVC = msg.guild.me.voiceChannelID;
    const graceVCInGuild = msg.guild.voiceConnection;

    if (!memberVoiceChannelID) return msg.reply('you need to be in a voice channel :p');
    if (!singleArgument) return msg.reply('you need to tell me a song, with a name, youtube link or from your playlist.');
    if (graceVC && msg.guild.me.speaking && memberVoiceChannelID !== graceVC) return msg.reply('I\'m busy! owo');
    if (memberVoiceChannelID !== graceVC && (memberVC.joinable === false && memberVC.speakable === false && memberVC.full === true)) {
      return msg.reply(`please check my permissions for that voice chat or if it is full! I need to be able to speak and join that
        voice channel, huh.`);
    }

    const hgetAsync = promisify(redisClient.hget).bind(redisClient);
    const youtubeLinkPos = msg.content.indexOf('youtube.com/watch?v=');
    let songTitle;
    let songId;

    if (youtubeLinkPos !== -1) {
      const idFromLink = msg.content.substring(youtubeLinkPos + 20, youtubeLinkPos + 31);
      const searchResults = await libs.music.searchYoutubeSong(msg, youtubeAPI, idFromLink);
      if (!searchResults) return msg.reply('no results found :p');
      [songId, songTitle] = searchResults;
    } else if (isNaN(Number(singleArgument))) {
      const searchResults = await libs.music.searchYoutubeSong(msg, youtubeAPI, singleArgument);
      if (!searchResults) return msg.reply('no results found :p');
      [songId, songTitle] = searchResults;
    } else {
      const songNumber = Number(singleArgument) << 0;
      if (songNumber < 1 || songNumber > 15) return msg.reply('the song number doesn\'t look valid.');

      const userPlaylist = await hgetAsync(msg.author.id, 'userPlaylist');
      if (!userPlaylist) return msg.reply('that song number isn\'t in your playlist.');
      const song = libs.music.findSongByIndex(userPlaylist, songNumber);
      if (!song) return msg.reply('that song number isn\'t in your playlist.');
      const songTitlePos = song.indexOf('!SongTitle');
      songTitle = song.substring(0, songTitlePos);
      songId = song.substring(songTitlePos + 10);
    }

    if (!songTitle || !songId) return msg.reply('couldn\'t get the song title or id.');
    const stream = ytdl(`https://www.youtube.com/watch?v=${songId}`, { filter: 'audioonly' });

    let dispatcher;
    if (!graceVCInGuild) {
      const joinVC = memberVC.join();
      dispatcher = await joinVC.then((connection) => {
        const dispatcher = connection.playStream(stream, streamOptions);
        return dispatcher;
      });
    } else if (!(msg.guild.voiceConnection.dispatcher) && msg.guild.me.speaking === false) {
      dispatcher = graceVCInGuild.playStream(stream, streamOptions);
    } else {
      libs.music.addSongToQueue(msg.guild.id, songId, songTitle, redisClient, msg);
      return;
    }

    function dispatcherOnEnd(dispatcher) {
      dispatcher.on('end', async (reason) => {
        msg.guild.voiceConnection.speaking = false;
        if (libs.music.checkForSomeoneInVC(msg.guild.voiceConnection.channel.members) === false) {
          msg.guild.voiceConnection.disconnect();
          msg.guild.me.voiceChannel.leave();
          redisClient.hset(msg.guild.id, 'guildPlaylist', '');
        } else {
          const hgetAsync = promisify(redisClient.hget).bind(redisClient);
          const guildPlaylist = await hgetAsync(msg.guild.id, 'guildPlaylist');
          if (!guildPlaylist || guildPlaylist.length === 0) {
            msg.guild.voiceConnection.disconnect();
            msg.guild.me.voiceChannel.leave();
            return;
          }

          redisClient.hset(msg.guild.id, 'guildPlaylist', guildPlaylist.substring(11));
          const nextSong = guildPlaylist.substring(0, 11);

          let songTitle;
          const searchResults = await libs.music.searchYoutubeSong(msg, youtubeAPI, nextSong);
          [_, songTitle] = searchResults;

          const newStream = ytdl(`https://www.youtube.com/watch?v=${nextSong}`, { filter: 'audioonly' });
          const newDispatcher = msg.guild.voiceConnection.playStream(newStream, streamOptions);
          msg.channel.send({
            embed: {
              title: songTitle,
              url: `https://www.youtube.com/watch?v=${nextSong}`,
              color: 11529967,
              thumbnail: {
                url: `https://img.youtube.com/vi/${nextSong}/hqdefault.jpg`,
              },
              author: {
                name: 'Song playing now',
              },
            },
          });
          dispatcherOnEnd(newDispatcher);
        }
      });
    }
    dispatcherOnEnd(dispatcher);
    msg.channel.send({
      embed: {
        title: songTitle,
        url: `https://www.youtube.com/watch?v=${songId}`,
        color: 11529967,
        thumbnail: {
          url: `https://img.youtube.com/vi/${songId}/hqdefault.jpg`,
        },
        author: {
          name: 'Song playing now',
        },
      },
    });
  }
};
