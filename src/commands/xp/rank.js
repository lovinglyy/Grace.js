const { MessageEmbed } = require('discord.js');
const DiscordUtil = require('./../../util/DiscordUtil');

/**
* Show the rank of a member
* @param {string} msg - A Discord message
* @param {object} asyncRedis Async redis methods
*/
module.exports = async (msg, grace, asyncRedis) => {
  let memberRank = '';
  const member = (msg.content.indexOf(' ') !== -1) ? DiscordUtil.findOneMember(msg, grace) : msg.member;
  if (!member) return;

  const memberInfo = await Promise.all([
    asyncRedis.zscore(`guildxp:${msg.guild.id}`, `member:${member.id}`),
    asyncRedis.zrevrank(`guildxp:${msg.guild.id}`, `member:${member.id}`),
  ])
    .catch(() => null);

  if (!memberInfo) {
    msg.reply('you\'re not in the guild xp rank!');
    return;
  }

  const [score, rank] = memberInfo;

  if (member.id === msg.member.id) {
    memberRank = `Your rank position is **${rank}**, ${member.displayName}, with **${score}**xp.\nKeep being active to get server xp.`;
  } else {
    memberRank = `${member.displayName} rank position is **${rank}**, with **${score}**xp.\n`;
  }

  const embed = new MessageEmbed()
    .setColor(11529967)
    .setDescription(memberRank)
    .setFooter('The rank position is refreshed periodically.');

  msg.channel.send('🌸 ~', { embed });
};
