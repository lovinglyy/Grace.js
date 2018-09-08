const { MessageEmbed } = require('discord.js');
const libs = require('./../../libs/');

/**
* Show the guild song queue.
* @param {string} msg - A Discord message.
*/
module.exports = async (msg) => {
  const guildQueue = libs.music.getQueue(msg.guild.id);
  const singleArgument = libs.discordUtil.getSingleArg(msg);

  if (!guildQueue) {
    msg.reply('the guild playlist is empty!! owo');
    return;
  }

  if (singleArgument && singleArgument === 'clear' && msg.member.hasPermission('MANAGE_MESSAGES')) {
    libs.music.clearQueue(msg.guild.id);
    msg.reply('the guild queue is now empty! :3');
    return;
  }

  let formatedSongs = '';
  for (let i = 0; i < guildQueue.length; i += 1) {
    const songTitle = guildQueue[i].substring(11);
    if (songTitle) formatedSongs += `**[${i + 1}]** ${songTitle}\n`;
  }

  const embed = new MessageEmbed()
    .setTitle(`${msg.guild.name}'s song queue:`)
    .setDescription(formatedSongs.substring(0, 1500))
    .setColor(11529967)
    .setThumbnail(msg.guild.iconURL({ size: 64 }));
  msg.channel.send({ embed });
};
