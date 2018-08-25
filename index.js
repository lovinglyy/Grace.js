const Discord = require('discord.js');
const redis = require('redis');
const components = require('./components/');
const config = require('./config');

class Grace {
  constructor(options) {
    this.config = options.botConfig;
    this.client = options.client;
    this.redisClient = options.redisClient;
    this.setup();
  }

  setup() {
    this.client.login(config.token);
    components.events.init(this);
    components.redisEvents.init(this);
  }

  getClient() {
    return this.client;
  }

  getRedisClient() {
    return this.redisClient;
  }

  getConfig() {
    return this.config;
  }
}

new Grace({
  botConfig: config,
  client: new Discord.Client(),
  redisClient: redis.createClient(),
}); // eslint-disable-line no-new
