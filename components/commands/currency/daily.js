const { promisify } = require('util');
const libs = require('./../../libs/');

module.exports = {
  async cmd(msg, grace) {
    const redisClient = grace.getRedisClient();
    const dailyCD = grace.getCooldown('daily');
    if (!redisClient) return;

    if (!libs.util.checkCooldown(msg.author.id, dailyCD)) {
      msg.reply('you already got your dailies today, huh!');
      return;
    }

    const tomorrow = new Date(Date.now());
    tomorrow.setDate(tomorrow.getDate() + 1);
    dailyCD.set(msg.author.id, tomorrow.getTime());

    const hgetAsync = promisify(redisClient.hget).bind(redisClient);
    const dailyBlossoms = libs.util.getRandomIntInclusive(8, 32);
    let userBlossoms = await hgetAsync(msg.author.id, 'userBlossoms');
    if (!userBlossoms) userBlossoms = 0;
    userBlossoms = Number(userBlossoms);
    redisClient.hset(msg.author.id, 'userBlossoms', userBlossoms + dailyBlossoms);
    msg.reply(`you got **${dailyBlossoms}** 🌼 ^^`);
  },
};
