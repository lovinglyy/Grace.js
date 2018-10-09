const { MessageEmbed } = require('discord.js');
const DiscordUtil = require('./../../util/DiscordUtil');

module.exports = (msg, grace) => {
  if (msg.author.id !== grace.getConfig().botOwner) return;

  const singleArgument = DiscordUtil.getSingleArg(msg);
  if (Number.isNaN(singleArgument)) return;

  grace.getRedisClient().zadd(`guildxp:${msg.member.guild.id}`, singleArgument, `member:${msg.member.id}`);

  const embed = new MessageEmbed()
    .setTitle('Set XP')
    .setDescription(`${msg.member.displayName}'s xp is now ${singleArgument}.`)
    .setColor(11529967);
  msg.channel.send({ embed }).catch(() => {});
};
