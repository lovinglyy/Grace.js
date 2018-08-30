module.exports = {
  /**
	* Clear the user playlist. Redis client must be connected.
	* @param {string} msg A Discord message.
	* @param redisClient The bot redis Client
	*/
  async cmd(msg, redisClient) {
    if (!redisClient) return;
    redisClient.del(msg.author.id, 'userPlaylist');
    msg.channel.send('I did clear your playlist! :o');
  },
};
