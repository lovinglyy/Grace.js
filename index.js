const Discord = require('discord.js');
const redis = require('redis');
const events = require('./components/events/');
const config = require('./config');

const discordClient = new Discord.Client({
  disabledEvents: ['TYPING_START', 'USER_NOTE_UPDATE', 'WEBHOOKS_UPDATE', 'PRESENCE_UPDATE'],
});

class Grace {
  constructor(options) {
    this.config = options.botConfig;
    this.client = options.client;
    this.redisClient = options.redisClient;
    this.cooldowns = { currencyCD: new Map() };
  }

  setup() {
    this.client.login(config.token);
    events(this);
  }

  getClient() {
    return this.client;
  }

  getCooldowns() {
    return this.cooldowns;
  }

  getRedisClient() {
    return this.redisClient;
  }

  getConfig() {
    return this.config;
  }
}

const grace = new Grace({
  botConfig: config,
  client: discordClient,
  redisClient: redis.createClient(),
});

grace.setup();
