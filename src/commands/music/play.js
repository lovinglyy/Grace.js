const DiscordUtil = require('./../../util/DiscordUtil');
const Music = require('./../../util/Music');
const GuildQueues = require('./models/guildQueues');
const Song = require('./models/song');

/**
* Play a song by searching a song title in youtube, by a youtube url, or
* by a number in the user playlist(more will be added in relation to this).
* @param {string} msg - A Discord message.
* @param {object} grace Object with client, configs, etc.
*/
module.exports = async (msg, grace) => {
  const { youtubeAPI } = grace.getConfig();
  if (!youtubeAPI) return;
  const singleArgument = DiscordUtil.getSingleArg(msg);
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
    && (!memberVC.joinable || !memberVC.speakable || memberVC.full)) {
    msg.reply(`please check my permissions for that voice chat or if it is full! I need to be able to speak and join that
      voice channel, huh.`);
    return;
  }

  const songSearching = await Music.getSong(singleArgument, msg, grace.getRedisClient(), youtubeAPI);
  if (!songSearching) return;

  const [songId, songTitle] = songSearching;
  if (!songTitle || !songId) {
    msg.reply('couldn\'t get the song title or id.');
    return;
  }

  const song = new Song({
    id: songId, title: songTitle, guild: msg.guild, channel: msg.channel,
  });

  if (!msg.guild.voiceConnection) {
    await memberVC.join().then(() => song.play())
      .catch(() => msg.reply('couldn\'t join the voice channel!'));
  } else {
    GuildQueues.addSongToQueue(songId, songTitle, msg);
  }
};
