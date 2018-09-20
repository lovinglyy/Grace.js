const Cooldown = require('../../structures/Cooldown');
const DiscordUtil = require('../../util/DiscordUtil');

module.exports = async (msg, grace) => {
  const redisClient = grace.getRedisClient();
  const singleArgument = DiscordUtil.getSingleArg(msg);
  const selfCD = new Cooldown({ key: msg.author.id, obj: 'self' });

  if (selfCD.exists()) {
    msg.reply('you need to wait a moment to do that again.').catch(() => {});
    return;
  }

  if (!singleArgument) {
    const assignRoles = await redisClient.smembers(`guilds_selfassigns:${msg.guild.id}`);
    if (!assignRoles || assignRoles.length === 0) {
      msg.reply('this guild has no self assign roles.').catch(() => {});
      return;
    }
    let assignRoleList = '';
    let roleGet;
    for (let i = 0; i < assignRoles.length; i += 1) {
      roleGet = msg.guild.roles.get(assignRoles[i]);
      if (roleGet) assignRoleList += `, **${roleGet.name}**`;
    }
    msg.reply(`these roles can be self assigned: ${assignRoleList.substring(2)}.`)
      .catch(() => {});
    selfCD.set(1, 5);
    return;
  }

  let role = msg.mentions.roles.first();
  if (!role) role = msg.guild.roles.find(r => r.name === singleArgument);

  if (!role) {
    msg.reply('I couldn\'t find the specified role.').catch(() => {});
    return;
  }

  if (!role.editable) {
    msg.reply('I can\'t give you that role. Please check if I have access to it.')
      .catch(() => {});
    return;
  }

  selfCD.set(1, 5);
  const exists = await redisClient.sismember(`guilds_selfassigns:${msg.guild.id}`, role.id);
  if (exists === 1) {
    if (msg.member.roles.get(role.id)) {
      msg.member.roles.remove(role, 'removed self assign role');
      msg.channel.send(`Removed the role **${role.name}** from you.`)
        .catch(() => {});
    } else {
      msg.member.roles.add(role, 'from self assign roles');
      msg.channel.send(`You got the role **${role.name}**.`)
        .catch(() => {});
    }
  } else {
    msg.channel.send(`**${role.name}** is not a self assign role.`)
      .catch(() => {});
  }
};
