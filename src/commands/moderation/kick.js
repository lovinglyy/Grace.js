const DiscordUtil = require('./../../util/DiscordUtil');

module.exports = (msg) => {
  if (!msg.member.hasPermission('KICK_MEMBERS')) return;
  if (msg.guild.me.hasPermission('KICK_MEMBERS') === false) {
    msg.reply('I need the kick members permission for that command.').catch(() => {});
    return;
  }

  const singleArgument = DiscordUtil.getSingleArg(msg);
  const mentionedUser = msg.mentions.members.first();

  if (!mentionedUser) {
    msg.reply('you need to mention the user that will be kicked.').catch(() => {});
    return;
  }
  if (mentionedUser.kickable === false) {
    msg.reply('I can\'t kick that user! o-o').catch(() => {});
    return;
  }

  let kickReason = 'Unspecified reason.';
  if (singleArgument.indexOf(' ') !== -1) kickReason = singleArgument.substring(singleArgument.indexOf(' ') + 1);

  mentionedUser.kick({ reason: kickReason })
    .then(() => msg.channel.send(`${msg.author} kicked ${mentionedUser} from the server! \n**Reason:** *${kickReason}*.`)
      .catch(() => {}))
    .catch(() => msg.reply('I couldn\'t kick that user!').catch(() => {}));
};
