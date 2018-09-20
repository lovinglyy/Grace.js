const Cooldown = require('../../structures/Cooldown');
const DiscordUtil = require('../../util/DiscordUtil');

module.exports = async (msg, grace) => {
  if (!msg.member.hasPermission('ADMINISTRATOR')) return;
  const redisClient = grace.getRedisClient();
  const singleArgument = DiscordUtil.getSingleArg(msg);
  const selfAssignCD = new Cooldown({ key: msg.guild.id, obj: 'selfAssign' });

  if (selfAssignCD.exists()) {
    msg.reply('this guild has a cooldown for this command :c - please wait a while.');
    return;
  }

  if (!singleArgument) {
    msg.reply('please specify a role, with a mention or with the name.');
    return;
  }


  let role = msg.mentions.roles.first();
  if (!role) role = msg.guild.roles.find(r => r.name === singleArgument);

  if (!role) {
    msg.reply('I couldn\'t find the specified role.')
      .catch(() => {});
    return;
  }

  if (!role.editable) {
    msg.reply('please make sure that I have access to that role.')
      .catch(() => {});
    return;
  }

  selfAssignCD.set(1, 5);
  if (role.name === '@here' || role.name === '@everyone') {
    msg.reply('that role can\'t be set as a self assign role.')
      .catch(() => {});
    return;
  }

  const exists = await redisClient.sismember(`guilds_selfassigns:${msg.guild.id}`, role.id);
  if (exists === 1) {
    redisClient.srem(`guilds_selfassigns:${msg.guild.id}`, role.id);
    msg.channel.send(`**${role.name}** was removed from the self assign roles. 🌺`)
      .catch(() => {});
  } else {
    redisClient.sadd(`guilds_selfassigns:${msg.guild.id}`, role.id);
    msg.channel.send(`**${role.name}** is now a self assign role! 🌺`)
      .catch(() => {});
  }
};
