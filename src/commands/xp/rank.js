const { MessageEmbed } = require('discord.js');
const DiscordUtil = require('./../../util/DiscordUtil');
const Util = require('./../../util/Util');

/**
* Show the rank of a member
* @param {string} msg - A Discord message
* @param {object} asyncRedis Async redis methods
*/
module.exports = async (msg, grace) => {
  let memberRank = '';
  const redisClient = grace.getRedisClient();
  const member = (msg.content.indexOf(' ') !== -1) ? DiscordUtil.findOneMember(msg, grace) : msg.member;
  if (!member) return;

  const memberInfo = await Promise.all([
    redisClient.zscore(`guildxp:${msg.guild.id}`, `member:${member.id}`),
    redisClient.zrevrank(`guildxp:${msg.guild.id}`, `member:${member.id}`),
  ])
    .catch(() => null);

  if (!memberInfo) {
    msg.reply('you\'re not in the guild xp rank!');
    return;
  }

  const [score, rank] = memberInfo;

  if (member.id === msg.member.id) {
    memberRank = `Your rank position is **${rank}**, ${member.displayName}, in **level ${Util.getXpInLv(score)}** (**${score}**xp).\nKeep being active to get server xp.`;
  } else {
    memberRank = `${member.displayName} rank position is **${rank}**, in **level ${Util.getXpInLv(score)}** (**${score}**xp).`;
  }

  const embed = new MessageEmbed()
    .setColor(11529967)
    .setDescription(memberRank);

  msg.channel.send('🌸 ~', { embed });
};
