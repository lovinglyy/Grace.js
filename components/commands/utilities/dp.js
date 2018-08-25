const libs = require('./../../libs/');

module.exports = {
/**
* Display the Discord profile picture of a member.
* @param {string} msg - A str that need to be a Discord message.
* @param {number} argSeparator The index where the message is separated
* by a blank space
* @returns {promise|void} It will either return a promise from the message sent, with the user
* Discord profile picture or a return without value.
*/
  cmd(msg, argSeparator) {
    const anotherMember = libs.util.findOneMember(msg, argSeparator);
    if (!anotherMember) return;
    return msg.channel.send(`${anotherMember.displayName}'s Discord profile picture:`,
      { files: [anotherMember.user.displayAvatarURL.replace('?size=2048', '')], name: 'profile.png' });
  },
};
