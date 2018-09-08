const libs = require('./../../libs/');

const setWelcomeCooldown = new Map();

module.exports = (msg, grace) => {
  if (!msg.member.hasPermission('ADMINISTRATOR')) return;
  const redisClient = grace.getRedisClient();
  const singleArgument = libs.discordUtil.getSingleArg(msg);

  if (!libs.util.checkCooldown(msg.guild.id, setWelcomeCooldown)) {
    msg.reply('this guild has a cooldown for this command :c - please wait a while.');
    return;
  }

  if (!singleArgument) {
    msg.reply('please tell me the new welcome message owo');
    return;
  }

  if (singleArgument.length > 146) {
    msg.reply('that welcome message is too long!! Please write something with around ~140 characters(a bit more is okay!).');
    return;
  }

  libs.util.setCooldown(setWelcomeCooldown, msg.guild.id, 300);
  redisClient.hset(`guild: ${msg.guild}`, 'welcome', `${singleArgument}`);
  redisClient.hset(`guild: ${msg.guild}`, 'welcomeChannel', `${msg.channel.id}`);
  msg.channel.send(`This guild now has a neat welcome message in **${msg.channel.name}**! 🌺`);
};
