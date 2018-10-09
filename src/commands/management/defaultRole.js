const Cooldown = require('../../structures/Cooldown');
const DiscordUtil = require('../../util/DiscordUtil');

module.exports = async (msg, grace) => {
  if (!msg.member.hasPermission('MANAGE_ROLES')) return;
  const redisClient = grace.getRedisClient();
  const singleArgument = DiscordUtil.getSingleArg(msg);
  const defaultRoleCD = new Cooldown({ key: msg.guild.id, obj: 'defaultRole' });

  if (defaultRoleCD.exists()) {
    msg.reply('you need to wait a while to set the default role again!')
      .catch(() => {});
    return;
  }

  if (!singleArgument) {
    msg.reply('please specify a new default role, by name or a mention.')
      .catch(() => {});
    return;
  }

  if (singleArgument === 'remove') {
    const deleted = await redisClient.hdel(`guild:${msg.guild.id}`, 'defaultRole');
    if (deleted !== 1) {
      msg.reply('this guild has no default role.').catch(() => {});
    } else {
      msg.reply('members will no longer receive a default role!').catch(() => {});
    }
    defaultRoleCD.set(1, 60);
    return;
  }

  let role = msg.mentions.roles.first();
  if (!role) role = msg.guild.roles.find(r => r.name === singleArgument.substring(singleArgument.indexOf(' ') + 1));

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

  defaultRoleCD.set(1, 300);
  if (role.name === '@here' || role.name === '@everyone') {
    msg.reply('that role can\'t be set as a default role.')
      .catch(() => {});
    return;
  }

  redisClient.hset(`guild:${msg.guild.id}`, 'defaultRole', role.id);
  msg.channel.send('This guild now has a default role for new users! 🌺')
    .catch(() => {});
};
