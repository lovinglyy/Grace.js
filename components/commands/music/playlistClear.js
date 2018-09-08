/**
* Clear the user playlist. Redis client must be connected.
* @param {string} msg A Discord message.
* @param {object} grace Grace object from the class.
*/
module.exports = async (msg, grace) => {
  const redisClient = grace.getRedisClient();
  redisClient.del(msg.author.id, 'userPlaylist');
  msg.channel.send('I did clear your playlist! :o');
};
