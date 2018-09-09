const commands = require('./../../commands/');

module.exports = class {
  constructor(options) {
    this.client = options.client;
    this.grace = options.grace;
    this.asyncRedis = options.asyncRedis;
    this.enabledCommands = options.grace.getConfig().enabledCommands;
    this.prefix = options.grace.getConfig().defaultPrefix;
  }

  start() {
    let cmd;
    let spaceIndex;
    this.client.on('message', (msg) => {
      if (msg.content.indexOf(this.prefix) !== 0) return;
      if (msg.channel.type !== 'text' || msg.author.bot) return;

      cmd = msg.content.substring(this.prefix.length).toUpperCase();
      spaceIndex = cmd.indexOf(' ');
      cmd = (spaceIndex === -1) ? cmd : cmd.substring(0, spaceIndex);
      if (this.enabledCommands.includes(cmd)) commands[cmd](msg, this.grace, this.asyncRedis);
    });
  }
};
