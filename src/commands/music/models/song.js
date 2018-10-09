const ytdl = require('ytdl-core');
const { MessageEmbed } = require('discord.js');
const GuildQueues = require('./guildQueues');

module.exports = class {
  constructor(options) {
    this.id = options.id;
    this.title = options.title;
    this.guild = options.guild;
    this.channel = options.channel;
  }

  sendSongEmbed() {
    const embed = new MessageEmbed()
      .setTitle(this.title)
      .setURL(`https://www.youtube.com/watch?v=${this.id}`)
      .setColor(11529967)
      .setThumbnail(`https://img.youtube.com/vi/${this.id}/hqdefault.jpg`)
      .setAuthor('Song playing now');
    this.channel.send(embed).catch(() => {});
  }

  /**
   * Will play the song from youtube.
   * @param {string} songID The youtube song id.
   * @param {VoiceConnection} guild The guild where the song will be played.
   */
  play() {
    if (!this.guild.voiceConnection) return false;
    const stream = ytdl(`https://www.youtube.com/watch?v=${this.id}`, { filter: 'audioonly' });
    if (!stream) return false;
    this.sendSongEmbed();
    const dispatcher = this.guild.voiceConnection.play(stream, { type: 'webm/opus' });
    dispatcher.once('end', () => {
      this.findNextSong();
    });
    return true;
  }

  /**
   * Find the next song in the guild queue.
   */
  findNextSong() {
    if (!this.guild.voiceConnection) return;

    const guildQueue = GuildQueues.getQueue(this.guild.id);

    if (!guildQueue || guildQueue.length === 0) {
      this.guild.voiceConnection.disconnect();
      this.guild.me.voice.channel.leave();
      return;
    }

    const vcMembers = this.guild.voiceConnection.channel.members.filter(
      member => !member.user.bot && !member.voice.deaf,
    );

    if (!vcMembers || vcMembers.size === 0) {
      this.guild.voiceConnection.disconnect();
      this.guild.me.voice.channel.leave();
      GuildQueues.clearQueue(this.guild.id);
      return;
    }

    const nextSongInfo = guildQueue.pop();
    this.title = nextSongInfo.substring(11);
    this.id = nextSongInfo.substring(0, 12);
    this.play();
  }
};
