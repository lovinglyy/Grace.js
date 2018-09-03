const commands = require('./../commands/');

module.exports = {
  init(grace) {
    const client = grace.getClient();
    const config = grace.getConfig();
    const prefixLength = config.defaultPrefix.length;
    const { enabledCommands } = config;
    let spaceIndex;
    let cmd;

    client.on('ready', () => {
      console.log(`Grace logged in as ${client.user.tag} at ${client.readyTimestamp} timestamp.`);
    });

    client.on('message', (msg) => {
      if (msg.content.indexOf(config.defaultPrefix) !== 0) return;
      if (msg.author.bot === true) return;

      cmd = msg.content.substring(prefixLength).toUpperCase();
      spaceIndex = cmd.indexOf(' ');
      cmd = (spaceIndex === -1) ? cmd : cmd.substring(0, spaceIndex);
      if (enabledCommands.includes(cmd)) commands[cmd](msg, grace);
    });
  },
};
