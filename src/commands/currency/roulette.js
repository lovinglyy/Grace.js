const DiscordUtil = require('./../../util/DiscordUtil');
const Cooldown = require('../../structures/Cooldown');

module.exports = async (msg, grace) => {
  const redisClient = grace.getRedisClient();
  const currencyCD = new Cooldown({ key: msg.author.id, obj: 'currency' });

  if (currencyCD.exists()) {
    msg.reply('currency commands in cooldown!! :3');
    return;
  }

  const singleArgument = DiscordUtil.getSingleArg(msg);
  if (!singleArgument) {
    msg.reply('you need to specify a bet amount.');
    return;
  }

  const bet = Number(singleArgument) << 0;
  if (Number.isNaN(bet) || bet < 10 || bet > 50) {
    msg.reply('please specify a bet amount from 10 up to 50 blossoms.');
    return;
  }

  currencyCD.set(1, 7);

  const rouletteRnd = Math.floor(Math.random() * 6) + 1;
  let winAmount = 0;
  if (rouletteRnd > 5 && rouletteRnd < 9) winAmount = bet * 1.3;
  if (rouletteRnd === 8 || rouletteRnd === 9) winAmount = bet * 1.8;
  if (rouletteRnd === 10) winAmount = bet * 2.4;

  let userBlossoms = await redisClient.hget(`user:${msg.author.id}`, 'userBlossoms');
  userBlossoms = (userBlossoms) ? Number(userBlossoms) : 0;

  if (userBlossoms < bet) {
    msg.reply('you don\'t have that amount to bet.');
    return;
  }

  const newBlossomAmount = (userBlossoms + winAmount) << 0;
  redisClient.hincrby(`user:${msg.author.id}`, 'userBlossoms', Math.floor(winAmount));
  msg.channel.send(`${msg.author}, your roulette: **${rouletteRnd}**, you got **${winAmount << 0}** 🌼! *Total in bank: ${newBlossomAmount}*.`);
};
