const DiscordUtil = require('./../../util/DiscordUtil');

module.exports = (msg) => {
  if (!msg.member.hasPermission('BAN_MEMBERS')) return;
  if (msg.guild.me.hasPermission('BAN_MEMBERS') === false) {
    msg.reply('I need the ban members permission for that command.')
      .catch(() => {});
    return;
  }

  const singleArgument = DiscordUtil.getSingleArg(msg);
  const mentionedUser = msg.mentions.members.first();

  if (!mentionedUser) {
    msg.reply('you need to mention the user that will be banned.').catch(() => {});
    return;
  }

  if (mentionedUser.bannable === false) {
    msg.reply('I can\'t ban that user! o-o').catch(() => {});
    return;
  }

  let banReason = 'Unspecified reason.';
  let daysToDelete = 0;

  const splitedSingleArg = singleArgument.split(' ');
  if (splitedSingleArg[1]) daysToDelete = ~~(splitedSingleArg[1]);

  const quotMarkIndex = singleArgument.indexOf('"');
  const anotherQuotMarkIndex = singleArgument.indexOf('"', quotMarkIndex + 1);
  if (quotMarkIndex !== -1 && anotherQuotMarkIndex !== -1) {
    banReason = singleArgument.substring(quotMarkIndex + 1, anotherQuotMarkIndex);
  }

  if (Number.isNaN(daysToDelete)) {
    msg.reply('the number of days doesn\'t look valid!').catch(() => {});
    return;
  }

  mentionedUser.ban({ days: daysToDelete, reason: banReason })
    .then(() => msg.channel.send(`${msg.author} banned ${mentionedUser} from the server! \n**Reason:** *${banReason}*.`)
      .catch(() => {}))
    .catch(() => msg.reply('I couldn\'t ban that user!').catch(() => {}));
};
