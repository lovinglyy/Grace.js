const { MessageEmbed } = require('discord.js');
const libs = require('./../../libs/');

/**
* Play a song by searching a song title in youtube, by a youtube url, or
* by a number in the user playlist(more will be added in relation to this).
* @param {string} msg - A Discord message.
* @param {object} grace Object with client, configs, etc.
*/
module.exports = async (msg, grace, asyncRedis) => {
  const { youtubeAPI } = grace.getConfig();
  if (!youtubeAPI) return;
  const singleArgument = libs.discordUtil.getSingleArg(msg);
  const memberVC = msg.member.voice.channel;

  if (!msg.member.voice.channelID) {
    msg.reply('you need to be in a voice channel :p');
    return;
  }
  if (!singleArgument) {
    msg.reply('you need to tell me a song, with a name, youtube link or from your playlist.');
    return;
  }
  if (msg.guild.voiceConnection
    && msg.guild.voiceConnection.dispatcher
    && msg.member.voice.channelID !== msg.guild.me.voice.channelID) {
    msg.reply('I\'m busy! owo');
    return;
  }
  if (msg.member.voice.channelID !== msg.guild.me.voice.channelID
    && (memberVC.joinable === false || memberVC.speakable === false
    || memberVC.full === true)) {
    msg.reply(`please check my permissions for that voice chat or if it is full! I need to be able to speak and join that
      voice channel, huh.`);
    return;
  }

  const songSearching = await libs.music.getSong(singleArgument, msg, asyncRedis, youtubeAPI);
  if (!songSearching) return;

  const [songId, songTitle] = songSearching;
  if (!songTitle || !songId) {
    msg.reply('couldn\'t get the song title or id.');
    return;
  }

  let dispatcher;
  if (!msg.guild.voiceConnection) {
    dispatcher = await memberVC.join().then(() => libs.music.ytdlAndPlay(songId, msg.guild));
    dispatcher.once('end', () => {
      libs.music.playNextQueueSong(msg.guild.id, msg.channel, grace.getClient());
    });
  } else {
    libs.music.addSongToQueue(songId, songTitle, msg);
    return;
  }
  if (!dispatcher) return;
  const embed = new MessageEmbed()
    .setTitle(songTitle)
    .setURL(`https://www.youtube.com/watch?v=${songId}`)
    .setColor(11529967)
    .setThumbnail(`https://img.youtube.com/vi/${songId}/hqdefault.jpg`)
    .setAuthor('Song playing now');
  msg.channel.send({ embed });
};
