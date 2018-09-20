const { MessageEmbed } = require('discord.js');
const { gifs, reactionTexts } = require('./../../util/Constants');
const DiscordUtil = require('./../../util/DiscordUtil');

module.exports = async (msg, grace, type, mentionRequired = false) => {
  let reactionContent;
  if (!mentionRequired) reactionContent = `${msg.author} ${reactionTexts.alone[type]}`;
  const anotherMember = DiscordUtil.findOneMember(msg, grace, false);
  if (mentionRequired && !anotherMember) {
    msg.reply('you need to mention someone!!').catch(() => {});
    return;
  }
  if (anotherMember) {
    if (anotherMember.id === msg.author.id) {
      msg.reply(`don't be sad ${msg.author}, you can mention me while you don't make friends here. :3`)
        .catch(() => {});
      return;
    }
    if (type === 'idc') {
      reactionContent = `${msg.author} doesn't care about ${anotherMember}.`;
    } else if (type === 'hug') {
      reactionContent = `${msg.author} is hugging ${anotherMember} :3`;
    } else if (type === 'angry') {
      reactionContent = `${msg.author} is angry with ${anotherMember}.`;
    } else if (type === 'positive') {
      reactionContent = `${msg.author} is feeling positive with ${anotherMember}.`;
    } else if (type === 'charm') {
      reactionContent = `${msg.author} is sending their charm to ${anotherMember}! <3 <3`;
    } else if (type === 'poke') {
      reactionContent = `${msg.author} is poking ${anotherMember}! *grr*`;
    } else if (type === 'ew') {
      reactionContent = `${msg.author} ewww at ${anotherMember}.`;
    }
  }
  const embed = new MessageEmbed()
    .setDescription(reactionContent)
    .setImage(gifs[type][(Math.random() * (gifs[type].length)) << 0])
    .setColor(11529967);
  msg.channel.send({ embed }).catch(() => {});
};
