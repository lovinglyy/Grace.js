const { MessageEmbed } = require('discord.js');

/**
* Display a guild info.
* @param {string} msg - Discord message
*/
module.exports = (msg) => {
  const embed = new MessageEmbed()
    .setTitle(`${msg.guild.name} *by ${msg.guild.owner.displayName}*`)
    .setDescription(`🍂 The guild was created at ${msg.guild.createdAt}, there are **${msg.guild.memberCount} members**, **${msg.guild.channels.size} channels/categories** and **${msg.guild.roles.size} roles**.
  It also has **${msg.guild.emojis.size} emojis**, and is "located" in **${msg.guild.region}**.`)
    .setColor(11529967)
    .setThumbnail(msg.guild.iconURL({ size: 256 }));
  msg.channel.send(embed);
};
