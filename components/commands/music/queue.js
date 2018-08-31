const { promisify } = require('util');
const Discord = require('discord.js');

module.exports = {
  /**
	* Show the guild song queue.
	* @param {string} msg - A Discord message.
	* @param redisClient A connected and ready to use Redis client.
	*/
  async cmd(msg, redisClient, argSeparator) {
    if (!redisClient) return;

    const singleArgument = msg.content.substring(argSeparator);
    if (singleArgument && singleArgument === 'clear' && msg.member.hasPermission('MANAGE_MESSAGES')) {
      redisClient.del(`${msg.guild.id}_queue`);
      return msg.reply('the guild queue is now empty! :3');
    }

    const lrangeAsync = promisify(redisClient.lrange).bind(redisClient);
    const guildQueue = await lrangeAsync(`${msg.guild.id}_queue`, 0, 14);
    if (!guildQueue || guildQueue.length < 1) return msg.reply('the guild playlist is empty.');

    let formatedSongs = '';
    for (let i = 0; i < guildQueue.length; i++) {
      const songTitle = guildQueue[i].substring(11);
      if (songTitle) formatedSongs += `**[${i + 1}]** ${songTitle}\n`;
    }

    const embed = new Discord.RichEmbed()
      .setTitle(`${msg.guild.name}'s song queue:`)
      .setDescription(formatedSongs.substring(0, 1500))
      .setColor(11529967)
      .setThumbnail(msg.guild.iconURL);
    msg.channel.send({ embed });
  },
};
