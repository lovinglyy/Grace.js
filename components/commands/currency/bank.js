const { promisify } = require('util');

module.exports = {
  async cmd(msg, redisClient) {
    if (!redisClient) return;
    const hgetAsync = promisify(redisClient.hget).bind(redisClient);
    let userBlossoms = await hgetAsync(msg.author.id, 'userBlossoms');
    if (!userBlossoms) userBlossoms = 0;
    msg.reply(`you have **${userBlossoms}** 🌼 in your bank.`);
  }
};
