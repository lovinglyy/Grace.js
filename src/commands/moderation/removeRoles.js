const DiscordUtil = require('./../../util/DiscordUtil');

module.exports = (msg, grace) => {
  if (!msg.member.hasPermission('MANAGE_ROLES')) return;
  if (!msg.guild.me.hasPermission('MANAGE_ROLES')) return;
  const anotherMember = DiscordUtil.findOneMember(msg, grace);
  if (!anotherMember) return;

  let removeRoles = anotherMember.roles;
  const previousRoles = removeRoles.size;
  if (removeRoles.size === 1) {
    msg.reply('that user has no roles!!');
    return;
  }

  removeRoles = removeRoles.filter(role => role.editable && role.name !== '@everyone');
  if (removeRoles.size < 1) {
    msg.reply('there\'s no role that I can remove!');
    return;
  }

  anotherMember.roles.remove(removeRoles)
    .then((member) => {
      msg.reply(`Cleared ${previousRoles - member.roles.size} role(s) from ${anotherMember.displayName}!! I hope they don't be sad.`);
    });
};
