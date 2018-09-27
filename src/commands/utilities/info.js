const { MessageEmbed } = require('discord.js');
const DiscordUtil = require('../../util/DiscordUtil')

/**
* Display a guild info.
* @param {string} msg - Discord message
*/
module.exports = (msg) => {

  const possibleMember = DiscordUtil.findOneMember(msg, false);

  if (possibleMember) {
    const memberCreatedAt = possibleMember.user.createdAt;
    const embed = new MessageEmbed()
      .setTitle(`Info about ${possibleMember.displayName}`)
      .addField("ID", possibleMember.id, true)
      .addField("Username", possibleMember.user.tag, true)
      .addField("Joined at", possibleMember.joinedAt)
      .addField("Member of Discord since", `${memberCreatedAt.getDate()}-${memberCreatedAt.getMonth()+1}-${memberCreatedAt.getFullYear()}, ${memberCreatedAt.getHours()}:${memberCreatedAt.getMinutes()}:${memberCreatedAt.getSeconds()}`, true)
      .setThumbnail(possibleMember.user.displayAvatarURL())
      .setColor(11529967)
    return msg.channel.send(embed);
  }

  // Show guild information
  const embed = new MessageEmbed()
    .setTitle(`${msg.guild.name} *by ${msg.guild.owner.displayName}*`)
    .setDescription(`🍂 The guild was created at ${msg.guild.createdAt}, there are **${msg.guild.memberCount} members**, **${msg.guild.channels.size} channels/categories** and **${msg.guild.roles.size} roles**.
  It also has **${msg.guild.emojis.size} emojis**, and is "located" in **${msg.guild.region}**.`)
    .setColor(11529967)
    .setThumbnail(msg.guild.iconURL({ size: 256 }));
  msg.channel.send(embed);
};
