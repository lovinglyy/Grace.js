module.exports = {
  /**
  * Clear the user playlist. Redis client must be connected.
  * @param {string} msg A Discord message.
  * @param {object} grace Grace object from the class.
  */
  async cmd(msg, grace) {
    const redisClient = grace.getRedisClient();
    if (!redisClient) return;
    redisClient.del(msg.author.id, 'userPlaylist');
    msg.channel.send('I did clear your playlist! :o');
  },
};
