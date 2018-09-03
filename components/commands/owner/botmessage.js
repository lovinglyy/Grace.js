const { MessageEmbed } = require('discord.js');
const libs = require('./../../libs/');

module.exports = {
  cmd(msg, grace) {
    if (msg.author.id !== grace.getConfig().botOwner
    || msg.guild.ownerID !== grace.getConfig().botOwner) return false;

    const singleArgument = libs.discordUtil.getSingleArg(msg);
    if (!singleArgument) {
      msg.reply('please type the title and the message content, using " around the title :p. Ex: "title" bla bla bla.');
      return false;
    }

    const quotMarkIndex = singleArgument.indexOf('"');
    const anotherQuotMarkIndex = singleArgument.indexOf('"', quotMarkIndex + 1);

    if (quotMarkIndex === -1 || anotherQuotMarkIndex === -1) return msg.reply('please type the title around quotation marks.');

    const title = singleArgument.substring(quotMarkIndex + 1, anotherQuotMarkIndex);
    if (!title) return msg.reply('please type the title and the message content, using " around the title :p. Ex: "title" bla bla bla.');

    const msgContent = singleArgument.substring(singleArgument.indexOf(title) + title.length + 2);
    if (!msgContent) return msg.reply('please type the title and the message content, using " around the title :p. Ex: "title" bla bla bla.');

    const embed = new MessageEmbed()
      .setTitle(`**${title}**`)
      .setDescription(msgContent)
      .setColor(11529967);
    msg.channel.send({ embed });
    if (msg.guild.me.hasPermission('MANAGE_MESSAGES')) msg.delete();
    return true;
  },
};
