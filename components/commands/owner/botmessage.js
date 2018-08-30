module.exports = {
  cmd(msg, argSeparator) {
    const singleArgument = msg.content.substring(argSeparator);

    const quotMarkIndex = singleArgument.indexOf('"');
    const anotherQuotMarkIndex = singleArgument.indexOf('"', quotMarkIndex + 1);

    if (quotMarkIndex === -1 || anotherQuotMarkIndex === -1) return msg.reply('please type the title around quotation marks.');

    const title = singleArgument.substring(quotMarkIndex + 1, anotherQuotMarkIndex);
    if (!title) return msg.reply('please type the title and the message content, using " around the title :p. Ex: "title" bla bla bla.');

    const msgContent = singleArgument.substring(singleArgument.indexOf(title) + title.length + 2);
    if (!msgContent) return msg.reply('please type the title and the message content, using " around the title :p. Ex: "title" bla bla bla.');

    msg.channel.send({
      embed: {
        title: `**${title}**`,
        description: msgContent,
        color: 11529967,
      },
    });
    if (msg.guild.me.hasPermission('MANAGE_MESSAGES')) return msg.delete();
  },
};
