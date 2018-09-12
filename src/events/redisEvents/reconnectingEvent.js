module.exports = class {
  constructor(redisClient) {
    this.redisClient = redisClient;
  }

  start() {
    this.redisClient.on('reconnecting', () => {
      console.log('Connection to Redis lost, trying to reconnect...');
    });
  }
};
