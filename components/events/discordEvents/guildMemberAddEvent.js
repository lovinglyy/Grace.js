module.exports = class {
  constructor(options) {
    this.client = options.client;
    this.asyncRedis = options.asyncRedis;
  }

  start() {
    this.client.on('guildMemberAdd', async (member) => {
      if (member.user.bot) return;
      const welcomeMsg = await this.asyncRedis.hget(`guild: ${member.guild}`, 'welcome');
      if (!welcomeMsg) return;
      const welcomeChannelID = await this.asyncRedis.hget(`guild: ${member.guild}`, 'welcomeChannel');
      if (!welcomeChannelID) return;

      const channel = member.guild.channels.resolve(welcomeChannelID);
      if (!channel || channel.type !== 'text' || !channel.permissionsFor(member.guild.me).has('SEND_MESSAGES')) return;

      channel.send(welcomeMsg.replace(/\[MEMBER\]/g, member));
    });
  }
};
