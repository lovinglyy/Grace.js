const libs = require('./../../libs/');

const starboardCooldown = new Map();

module.exports = (msg, grace) => {
  if (!msg.member.hasPermission('MANAGE_CHANNELS')) return;

  if (!libs.util.checkCooldown(msg.guild.id, starboardCooldown)) {
    msg.reply('the starboard channel for this guild was set recently, please wait a while. o-o');
    return;
  }

  libs.util.setCooldown(starboardCooldown, msg.guild.id, 180);
  grace.getRedisClient().hset(`guild: ${msg.guild}`, 'starboardChannel', `${msg.channel.id}`);
  msg.channel.send(`Your cool guild starboard will be in **${msg.channel}** channel!!`);
};
