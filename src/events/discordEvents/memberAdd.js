module.exports = class {
  constructor(options) {
    this.client = options.client;
    this.redisClient = options.redisClient;
  }

  start() {
    this.client.on('guildMemberAdd', async (member) => {
      if (member.user.bot) return;
      const [welcomeMsg, welcomeChannelID] = Promise.all([
        this.redisClient.hget(`guild:${member.guild.id}`, 'welcome'),
        this.redisClient.hget(`guild:${member.guild.id}`, 'welcomeChannel'),
      ]).catch(() => null);
      
      if (!welcomeMsg || !welcomeChannelID) return;

      const channel = member.guild.channels.resolve(welcomeChannelID);
      if (!channel || channel.type !== 'text' || !channel.permissionsFor(member.guild.me).has('SEND_MESSAGES')) return;

      channel.send(welcomeMsg.replace(/\[MEMBER\]/g, member));
    });
  }
};
