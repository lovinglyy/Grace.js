const libs = require('./../../libs/');
const { promisify } = require('util');

module.exports = {
  async cmd(msg, dailyCD, redisClient) {
    if (!redisClient) return;
    const authorID = msg.author.id;
    const searchUser = dailyCD.find(function(element) {
      return (authorID === element[0]);
    });
    if (searchUser) {
      if (Date.now() < searchUser[1]) return msg.reply('you already got your dailies today, huh!');
    }
    let tomorrow = new Date(Date.now());
    tomorrow.setDate(tomorrow.getDate() + 1);
    dailyCD.push([authorID, tomorrow.getTime()]);

    const hgetAsync = promisify(redisClient.hget).bind(redisClient);
    const dailyBlossoms = libs.util.getRandomIntInclusive(10, 40);
    let userBlossoms = await hgetAsync(authorID, 'userBlossoms');
    if (!userBlossoms) userBlossoms = 0;
    userBlossoms = Number(userBlossoms);
    redisClient.hset(authorID, 'userBlossoms', userBlossoms + dailyBlossoms);
    msg.reply(`you got **${dailyBlossoms}** 🌼 ^^`);
  }
};
