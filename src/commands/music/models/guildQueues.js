const guildQueues = [];

module.exports = class {
  /**
   * Get a guild queue.
   * @param {string} guildID ID of the guild to get the queue.
   */
  static getQueue(guildID) {
    if (!guildQueues[guildID]) return false;
    return guildQueues[guildID];
  }

  /**
   * Add a song to a guild queue.
   * @param {string} song A youtube song id(11 characters length).
   * @param {string} songTitle The song title, to display.
   * @param {Message} msg A Discord message, from the user that requested this.
   */
  static addSongToQueue(song, songTitle, msg) {
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
   * Clear a guild queue.
   * @param {string} guildID ID of the guild that will be cleared.
   */
  static clearQueue(guildID) {
    if (!guildQueues[guildID]) return false;
    guildQueues[guildID].length = 0;
    return true;
  }
};
