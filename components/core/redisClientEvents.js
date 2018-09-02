module.exports = {
  init(grace) {
    const redisClient = grace.getRedisClient();

    redisClient.on('ready', () => {
      console.log('Redis client connection established.');
    });
    redisClient.on('reconnecting', () => {
      console.log('Connection to Redis lost, trying to reconnect...');
    });
  },
};
