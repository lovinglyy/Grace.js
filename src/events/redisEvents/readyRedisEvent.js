module.exports = class {
  constructor(redisClient) {
    this.redisClient = redisClient;
  }

  start() {
    this.redisClient.on('ready', () => {
      console.log(`Redis client connection established in ${this.redisClient.address}`);
    });
  }
};
