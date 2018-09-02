const libs = require('./../../libs/');

module.exports = {
/**
* Display the Discord profile picture of a member.
* @param {string} msg - A str that need to be a Discord message.
* @param {number} argSeparator The index where the message is separated
* by a blank space.
*/
  cmd(msg, argSeparator) {
    const anotherMember = libs.discordUtil.findOneMember(msg, argSeparator);
    if (!anotherMember) return;
    msg.channel.send(`There is!! **${anotherMember.displayName}'s** Discord profile picture:\n
${anotherMember.user.displayAvatarURL({ size: 2048 })}`);
  },
};
