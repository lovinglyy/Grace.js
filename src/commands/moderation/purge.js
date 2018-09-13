const DiscordUtil = require('./../../util/DiscordUtil');

module.exports = async (msg) => {
  if (!msg.member.hasPermission('MANAGE_MESSAGES')) return;
  if (!msg.guild.me.hasPermission('MANAGE_MESSAGES')) {
    msg.reply('I don\'t have permissions, I need at least the manage messages permission to delete messages :c');
    return;
  }

  const singleArgument = DiscordUtil.getSingleArg(msg);
  if (!singleArgument) {
    msg.reply('please type the number of messages that you want to purge! :3');
    return;
  }

  let amount = ~~(Number(singleArgument));
  if (!amount || Number.isNaN(amount)) {
    msg.reply('please tell a valid amount of messages to purge.');
    return;
  }

  if (amount < 1) {
    msg.reply('you need to purge a positive number or the universe will collapse.');
    return;
  }

  if (amount > 50) amount = 50;

  const fetchMsgs = await msg.channel.messages.fetch({ limit: amount })
    .catch(() => null);

  if (!fetchMsgs || fetchMsgs.length === 0) {
    msg.reply('I couldn\'t get any message to delete!');
    return;
  }

  msg.channel.bulkDelete(fetchMsgs, true)
    .then((deletedMessages) => {
      msg.channel.send(`Some messages got deleted! =^._.^= ∫\n*by: ${msg.author}* - *deleted quantity: ${deletedMessages.size}*`);
    })
    .catch(() => msg.reply('somehow I couldn\'t delete the messages.'));
};
