const { promisify } = require('util');
const libs = require('./../../libs/');

module.exports = {
  async cmd(msg, currencyCD, redisClient, argSeparator) {
    if (!redisClient) return;
    const authorID = msg.author.id;
    let elemIndex = -1;
    const searchUser = currencyCD.find((element) => {
      elemIndex += 1;
      return (authorID === element[0]);
    });
    if (searchUser) {
      if (Date.now() >= searchUser[1]) {
        currencyCD.splice(elemIndex, 1);
      } else {
        msg.reply('currency commands in cooldown!! :3');
        return;
      }
    }

    const singleArgument = msg.content.substring(argSeparator);
    if (!singleArgument) {
      msg.reply('you need to specify a bet amount.');
      return;
    }
    const bet = Number(singleArgument) << 0;
    if (Number.isNaN(bet) || bet < 10 || bet > 50) {
      msg.reply('please specify a bet amount from 10 up to 50 blossoms.');
      return;
    }

    const cdTime = new Date(Date.now());
    cdTime.setSeconds(cdTime.getSeconds() + 7);
    currencyCD.push([authorID, cdTime.getTime()]);

    const rouletteRnd = libs.util.getRandomIntInclusive(1, 10);
    let winAmount = 0;
    if (rouletteRnd > 5 && rouletteRnd < 9) winAmount = bet * 1.7;
    if (rouletteRnd === 8 || rouletteRnd === 9) winAmount = bet * 1.8;
    if (rouletteRnd === 10) winAmount = bet * 2.4;

    const hgetAsync = promisify(redisClient.hget).bind(redisClient);
    let userBlossoms = await hgetAsync(authorID, 'userBlossoms');
    if (!userBlossoms) userBlossoms = 0;
    userBlossoms = Number(userBlossoms);
    if (userBlossoms < bet) {
      msg.reply('you don\'t have that amount to bet.');
      return;
    }

    const newBlossomAmount = ((userBlossoms - bet) + winAmount).toFixed(2);
    redisClient.hset(authorID, 'userBlossoms', newBlossomAmount);
    msg.channel.send(`${msg.author}, your roulette: **${rouletteRnd}**, you got **${winAmount}** 🌼! *Total in bank: ${newBlossomAmount}*.`);
  },
};
