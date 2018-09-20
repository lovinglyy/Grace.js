module.exports = class {
  constructor(options) {
    this.client = options.client;
    this.redisClient = options.redisClient;
  }

  start() {
    this.client.on('guildMemberAdd', async (member) => {
      if (member.user.bot) return;

      const defaultRoleID = await this.redisClient.hget(`guild:${member.guild.id}`, 'defaultRole');
      if (defaultRoleID) {
        const defaultRole = member.guild.roles.get(defaultRoleID);
        if (defaultRole && defaultRole.editable) {
          member.roles.add(defaultRole, 'I\'m giving the default guild role.');
        } else {
          this.redisClient.hdel(`guild:${member.guild.id}`, 'defaultRole');
        }
      }

      const [welcomeMsg, welcomeChannelID] = await Promise.all([
        this.redisClient.hget(`guild:${member.guild.id}`, 'welcome'),
        this.redisClient.hget(`guild:${member.guild.id}`, 'welcomeChannel'),
      ]).catch(() => null);

      if (!welcomeMsg || !welcomeChannelID) return;

      const channel = member.guild.channels.resolve(welcomeChannelID);
      if (!channel || channel.type !== 'text' || !channel.permissionsFor(member.guild.me).has('SEND_MESSAGES')) {
        this.redisClient.hdel(`guild:${member.guild.id}`, 'welcome', 'welcomeChannel');
        return;
      }

      channel.send(welcomeMsg.replace(/\[MEMBER\]/g, member)).catch(() => {
        this.redisClient.hdel(`guild:${member.guild.id}`, 'welcome', 'welcomeChannel');
      });
    });
  }
};
