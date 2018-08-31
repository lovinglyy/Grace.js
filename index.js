const Discord = require('discord.js');
const redis = require('redis');
const components = require('./components/');
const config = require('./config');

class Grace {
  constructor(options) {
    this.config = options.botConfig;
    this.client = options.client;
    this.redisClient = options.redisClient;
    this.dailyCD = [];
    this.pubgCD = [];
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

  getCooldown(cd) {
    let cooldownArray;
    if (cd === 'daily') cooldownArray = this.dailyCD;
    if (cd === 'pubg') cooldownArray = this.pubgCD;
    if (!cooldownArray) return new Error('Couldn\'t find a specified cooldown.');
    return cooldownArray;
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
