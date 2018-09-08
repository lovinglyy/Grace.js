const { promisify } = require('util');
const commands = require('./../commands/');

module.exports = {
  init(grace) {
    const client = grace.getClient();
    const config = grace.getConfig();
    const asyncRedis = {
      hget: promisify(grace.getRedisClient().hget).bind(grace.getRedisClient()),
    };
    let spaceIndex;
    let cmd;

    client.on('ready', () => {
      console.log(`Grace logged in as ${client.user.tag} at ${client.readyAt}(${client.readyTimestamp}).
${client.users.size} users are cached, Grace has access to ${client.guilds.size} guilds and ${client.channels.size} channels(of all types, even categories).`);
    });

    client.on('message', (msg) => {
      if (msg.content.indexOf(config.defaultPrefix) !== 0) return;
      if (msg.channel.type !== 'text' || msg.author.bot) return;

      cmd = msg.content.substring(config.defaultPrefix.length).toUpperCase();
      spaceIndex = cmd.indexOf(' ');
      cmd = (spaceIndex === -1) ? cmd : cmd.substring(0, spaceIndex);
      if (config.enabledCommands.includes(cmd)) commands[cmd](msg, grace, asyncRedis);
    });

    client.on('guildMemberAdd', async (member) => {
      if (member.user.bot) return;
      const welcomeMsg = await asyncRedis.hget(`guild: ${member.guild}`, 'welcome');
      if (!welcomeMsg) return;
      const welcomeChannelID = await asyncRedis.hget(`guild: ${member.guild}`, 'welcomeChannel');
      if (!welcomeChannelID) return;

      const channel = member.guild.channels.resolve(welcomeChannelID);
      if (!channel || channel.type !== 'text' || !channel.permissionsFor(member.guild.me).has('SEND_MESSAGES')) return;

      channel.send(welcomeMsg.replace(/\[MEMBER\]/g, member));
    });
  },
};
