module.exports = class GuildCreate {
  constructor(options) {
    this.client = options.client;
    this.joinedGuilds = 0;
  }

  start() {
    this.client.on('guildCreate', () => {
      this.joinedGuilds += 1;
    });
  }

  get() {
    return this.joinedGuilds;
  }

  clear() {
    this.joinedGuilds = 0;
  }
};
