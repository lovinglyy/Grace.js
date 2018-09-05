const Discord = require('discord.js');
const redis = require('redis');
const components = require('./components/');
const config = require('./config');

const discordClient = new Discord.Client({
  restSweepInterval: 50,
  disabledEvents: ['TYPING_START', 'USER_NOTE_UPDATE', 'WEBHOOKS_UPDATE', 'PRESENCE_UPDATE'],
});

class Grace {
  constructor(options) {
    this.config = options.botConfig;
    this.client = options.client;
    this.redisClient = options.redisClient;
    this.dailyCD = new Map();
    this.pubgCD = new Map();
    this.currencyCD = new Map();
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
    if (cd === 'currency') cooldownArray = this.currencyCD;
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

new Grace({ // eslint-disable-line no-new
  botConfig: config,
  client: discordClient,
  redisClient: redis.createClient(),
});
