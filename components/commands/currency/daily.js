const libs = require('./../../libs/');

const dailyCD = new Map();

module.exports = async (msg, grace, asyncRedis) => {
  if (!libs.util.checkCooldown(msg.author.id, dailyCD)) {
    msg.reply('you already got your dailies today, huh!');
    return;
  }

  const tomorrow = new Date(Date.now());
  const rndBlossoms = libs.util.getRandomIntInclusive(6, 17);
  tomorrow.setDate(tomorrow.getDate() + 1);
  dailyCD.set(msg.author.id, tomorrow.getTime());

  let userBlossoms = await asyncRedis.hget(msg.author.id, 'userBlossoms');
  userBlossoms = (userBlossoms) ? Number(userBlossoms) : 0;

  const newTotal = (userBlossoms + rndBlossoms).toString();
  grace.getRedisClient().hset(msg.author.id, 'userBlossoms', newTotal);
  msg.reply(`you got **${rndBlossoms}** 🌼 ^^`);
};
