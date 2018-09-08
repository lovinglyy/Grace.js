const libs = require('./../../libs/');

module.exports = async (msg, grace, asyncRedis) => {
  const redisClient = grace.getRedisClient();
  const currencyCD = grace.getCooldown('currency');

  if (!libs.util.checkCooldown(msg.author.id, currencyCD)) {
    msg.reply('currency commands in cooldown!! :3');
    return;
  }

  const singleArgument = libs.discordUtil.getSingleArg(msg);
  if (!singleArgument) {
    msg.reply('you need to specify a bet amount.');
    return;
  }

  const bet = Number(singleArgument) << 0;
  if (Number.isNaN(bet) || bet < 10 || bet > 50) {
    msg.reply('please specify a bet amount from 10 up to 50 blossoms.');
    return;
  }

  libs.util.setCooldown(currencyCD, msg.author.id, 7);

  const rouletteRnd = libs.util.getRandomIntInclusive(1, 10);
  let winAmount = 0;
  if (rouletteRnd > 5 && rouletteRnd < 9) winAmount = bet * 1.7;
  if (rouletteRnd === 8 || rouletteRnd === 9) winAmount = bet * 1.8;
  if (rouletteRnd === 10) winAmount = bet * 2.4;

  let userBlossoms = await asyncRedis.hget(msg.author.id, 'userBlossoms');
  userBlossoms = (userBlossoms) ? Number(userBlossoms) : 0;

  if (userBlossoms < bet) {
    msg.reply('you don\'t have that amount to bet.');
    return;
  }

  const newBlossomAmount = ((userBlossoms - bet) + winAmount).toFixed(2);
  redisClient.hset(msg.author.id, 'userBlossoms', newBlossomAmount);
  msg.channel.send(`${msg.author}, your roulette: **${rouletteRnd}**, you got **${winAmount}** 🌼! *Total in bank: ${newBlossomAmount}*.`);
};
