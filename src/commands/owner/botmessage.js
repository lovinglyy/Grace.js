const { MessageEmbed } = require('discord.js');
const DiscordUtil = require('./../../util/DiscordUtil');

module.exports = (msg, grace) => {
  if (msg.author.id !== grace.getConfig().botOwner
    || msg.guild.ownerID !== grace.getConfig().botOwner) return;

  const singleArgument = DiscordUtil.getSingleArg(msg);
  if (!singleArgument) {
    msg.reply('please type the title and the message content, using " around the title :p. Ex: "title" bla bla bla.')
      .catch(() => {});
    return;
  }

  const quotMarkIndex = singleArgument.indexOf('"');
  const anotherQuotMarkIndex = singleArgument.indexOf('"', quotMarkIndex + 1);

  if (quotMarkIndex === -1 || anotherQuotMarkIndex === -1) {
    msg.reply('please type the title around quotation marks.').catch(() => {});
    return;
  }

  const title = singleArgument.substring(quotMarkIndex + 1, anotherQuotMarkIndex);
  if (!title) {
    msg.reply('please type the title and the message content, using " around the title :p. Ex: "title" bla bla bla.')
      .catch(() => {});
    return;
  }

  const msgContent = singleArgument.substring(singleArgument.indexOf(title) + title.length + 2);
  if (!msgContent) {
    msg.reply('please type the title and the message content, using " around the title :p. Ex: "title" bla bla bla.')
      .catch(() => {});
    return;
  }

  const embed = new MessageEmbed()
    .setTitle(`**${title}**`)
    .setDescription(msgContent)
    .setColor(11529967);
  msg.channel.send({ embed }).catch(() => {});
  if (msg.guild.me.hasPermission('MANAGE_MESSAGES')) msg.delete();
};
