const Cooldown = require('../../structures/Cooldown');
const DiscordUtil = require('../../util/DiscordUtil');

module.exports = async (msg, grace) => {
  if (!msg.member.hasPermission('MANAGE_ROLES')) return;
  const redisClient = grace.getRedisClient();
  const singleArgument = DiscordUtil.getSingleArg(msg);
  const rankRewardCD = new Cooldown({ key: msg.guild.id, obj: 'rankReward' });

  if (rankRewardCD.exists()) {
    msg.reply('wait a moment to set up/remove another rank role reward, or clear the list.');
    return;
  }

  if (!singleArgument) {
    msg.reply(`please specify a level and a role if you want to add a new rank reward,
level and remove, if you want to remove a rank reward or clear to remove all.`);
    return;
  }

  if (singleArgument.indexOf('clear') !== -1) {
    const deleted = await redisClient.del(`guildrankrewards:${msg.guild.id}`);
    const removeMsg = (deleted !== 1) ? 'this guild has no rank rewards.' : 'all role rewards on level up deleted!';
    msg.reply(removeMsg);
    rankRewardCD.set(1, 5);
    return;
  }

  const rankRewardCount = await redisClient.hlen(`guildrankrewards:${msg.guild.id}`);
  if (rankRewardCount > 15) {
    msg.reply('you can only have up to 15 rank rewards in your server!');
    return;
  }

  const level = singleArgument.substring(0, singleArgument.indexOf(' '));
  const lvNumber = Number(level);
  if (!level || Number.isNaN(lvNumber) || lvNumber < 1 || lvNumber > 50) {
    msg.reply('please specify a valid level, between 1 and 50.');
    return;
  }

  if (singleArgument.indexOf('remove') !== -1) {
    const deleted = await redisClient.hdel(`guildrankrewards:${msg.guild.id}`, level);
    const removeMsg = (deleted !== 1) ? 'couldn\'t delete that role.'
      : `removed the role that was at **Lv. ${level}** from the rank reward list!`;
    msg.reply(removeMsg);
    rankRewardCD.set(1, 5);
    return;
  }

  const role = msg.mentions.roles.first()
    || msg.guild.roles.find(r => r.name === singleArgument.substring(singleArgument.indexOf(' ') + 1));

  if (!role || !role.editable) {
    msg.reply('I couldn\'t find the specified role, or I don\'t have access to that role.');
    return;
  }

  rankRewardCD.set(1, 3);
  redisClient.hset(`guildrankrewards:${msg.guild.id}`, level, role.id);
  msg.channel.send(`Role **${role.name}** set as a reward for members that reach the **lv${level}** 🌺`);
};
