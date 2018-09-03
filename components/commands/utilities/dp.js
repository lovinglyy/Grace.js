const libs = require('./../../libs/');

module.exports = {
/**
* Display the Discord profile picture of a member.
* @param {string} msg - A str that need to be a Discord message.
* @param {object} grace Grace object from the class.
* by a blank space.
*/
  cmd(msg, grace) {
    const anotherMember = libs.discordUtil.findOneMember(msg, grace);
    if (!anotherMember) return;
    msg.channel.send(`There is!! **${anotherMember.displayName}'s** Discord profile picture:\n
${anotherMember.user.displayAvatarURL({ size: 2048 })}`);
  },
};
