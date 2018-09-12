module.exports = class {
  constructor(client) {
    this.client = client;
  }

  start() {
    this.client.on('ready', () => {
      console.log(`Grace logged in as ${this.client.user.tag} at ${this.client.readyAt}(${this.client.readyTimestamp}).
${this.client.users.size} users are cached, Grace has access to ${this.client.guilds.size} guilds and ${this.client.channels.size} channels(of all types, even categories).`);
    });
  }
};
