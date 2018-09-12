const Discord = require('discord.js');
const redis = require('redis');
const events = require('./events');
const config = require('./config');

const discordClient = new Discord.Client({
  disabledEvents: [
    'TYPING_START',
    'USER_NOTE_UPDATE',
    'WEBHOOKS_UPDATE',
    'PRESENCE_UPDATE',
    'CHANNEL_PINS_UPDATE',
  ],
  messageCacheMaxSize: 125,
  messageCacheLifetime: 180,
  messageSweepInterval: 180,
});

class Grace {
  constructor(options) {
    this.config = options.botConfig;
    this.client = options.client;
    this.redisClient = options.redisClient;
  }

  setup() {
    this.client.login(config.token);
    events(this);
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

const grace = new Grace({
  botConfig: config,
  client: discordClient,
  redisClient: redis.createClient(),
});

grace.setup();
