/*
  Purge a x amount of messages in the current channel.
*/
const libs = require('./../../libs/');

module.exports = {
  cmd(msg) {
    if (!msg.member.hasPermission('MANAGE_MESSAGES')) return false;
    if (msg.guild.me.hasPermission('MANAGE_MESSAGES') === false) {
      return msg.reply('I don\'t have permissions, I need at least the manage messages permission to delete messages :c');
    }

    const singleArgument = libs.discordUtil.getSingleArg(msg);
    if (!singleArgument) return msg.reply('please type the number of messages that you want to purge! :3');
    let amount = ~~(Number(singleArgument));
    if (!amount || Number.isNaN(amount)) return msg.reply('please tell a valid amount of messages to purge.');
    if (amount < 1) return msg.reply('you need to purge a positive number or the universe will collapse.');
    if (amount > 50) amount = 50;

    return msg.channel.messages.fetch({ limit: amount })
      .then((messages) => {
        if (!messages || messages.length === 0) return;
        msg.channel.bulkDelete(messages)
          .then((deletedMessages) => {
            msg.channel.send(`Some messages got deleted! =^._.^= ∫\n*by: ${msg.author}* - *deleted quantity: ${deletedMessages.size}*`);
          })
          .catch(console.error);
      })
      .catch(console.error);
  },
};
