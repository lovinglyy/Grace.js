const { MessageEmbed } = require('discord.js');
const Cooldown = require('../../structures/Cooldown');

module.exports = async (msg, grace) => {
  const redisClient = grace.getRedisClient();
  const rankRewardListCD = new Cooldown({ key: msg.guild.id, obj: 'rankRewardList' });
  let showList = '';
  let getRole;

  if (rankRewardListCD.exists()) {
    showList = rankRewardListCD.get();
  }

  if (!showList) {
    const rewardList = await redisClient.hgetall(`guildrankrewards:${msg.guild.id}`);
    if (!rewardList || Object.keys(rewardList).length === 0) {
      msg.reply('this guild has no rank rewards.');
      return;
    }

    const rewardListEntries = Object.entries(rewardList);
    for (let i = 0; i < rewardListEntries.length; i += 1) {
      getRole = msg.guild.roles.resolve(rewardListEntries[i][1]);
      if (getRole) showList += `**Level ${rewardListEntries[i][0]}:** ${getRole.name}\n`;
    }
    if (showList.length > 1500) showList = `${showList.substring(1500)}...`;
    rankRewardListCD.set(showList, 8);
  }

  const embed = new MessageEmbed()
    .setDescription(showList)
    .setColor(11529967)
    .setFooter('The list is refreshed periodically.');
  msg.channel.send('Showing the rank reward list.', { embed });
};
