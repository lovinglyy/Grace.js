const { MessageEmbed } = require('discord.js');
const DiscordUtil = require('../../util/DiscordUtil');

function formatDate(date) {
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

/**
* Display a guild or user info.
* @param {string} msg - Discord message
*/
module.exports = (msg) => {
  const possibleMember = DiscordUtil.findOneMember(msg, false);

  if (possibleMember) {
    const memberCreatedAt = possibleMember.user.createdAt;
    const embed = new MessageEmbed()
      .setTitle(`Info about ${possibleMember.displayName}`)
      .addField('ID', possibleMember.id, true)
      .addField('Username', possibleMember.user.tag, true)
      .addField('Joined at', formatDate(possibleMember.joinedAt), true)
      .addField('Member of Discord since', formatDate(memberCreatedAt), true)
      .addField('Status', possibleMember.presence.status, true)
      .addField('Highest role', possibleMember.roles.highest, true)
      .setThumbnail(possibleMember.user.displayAvatarURL())
      .setColor(possibleMember.displayColor);
    return msg.channel.send(embed);
  }

  // Show guild information
  const embed = new MessageEmbed()
    .setTitle(`${msg.guild.name} *by ${msg.guild.owner.displayName}*`)
    .setDescription(`🍂 The guild was created at ${msg.guild.createdAt}, there are **${msg.guild.memberCount} members**, **${msg.guild.channels.size} channels/categories** and **${msg.guild.roles.size} roles**.
  It also has **${msg.guild.emojis.size} emojis**, and is "located" in **${msg.guild.region}**.`)
    .setColor(11529967)
    .setThumbnail(msg.guild.iconURL({ size: 256 }));
  return msg.channel.send(embed).catch(() => {});
};
