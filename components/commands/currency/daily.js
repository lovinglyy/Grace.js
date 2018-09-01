const libs = require('./../../libs/');
const { promisify } = require('util');

module.exports = {
  async cmd(msg, dailyCD, redisClient) {
    if (!redisClient) return;
    const authorID = msg.author.id;
    let elemIndex = -1;
    const searchUser = dailyCD.find((element) => {
      elemIndex += 1;
      return (authorID === element[0]);
    });
    if (searchUser) {
      if (Date.now() >= searchUser[1]) {
        dailyCD.splice(elemIndex, 1);
      } else {
        msg.reply('you already got your dailies today, huh!');
        return;
      }
    }

    const tomorrow = new Date(Date.now());
    tomorrow.setDate(tomorrow.getDate() + 1);
    dailyCD.push([authorID, tomorrow.getTime()]);

    const hgetAsync = promisify(redisClient.hget).bind(redisClient);
    const dailyBlossoms = libs.util.getRandomIntInclusive(8, 32);
    let userBlossoms = await hgetAsync(authorID, 'userBlossoms');
    if (!userBlossoms) userBlossoms = 0;
    userBlossoms = Number(userBlossoms);
    redisClient.hset(authorID, 'userBlossoms', userBlossoms + dailyBlossoms);
    msg.reply(`you got **${dailyBlossoms}** 🌼 ^^`);
  },
};
