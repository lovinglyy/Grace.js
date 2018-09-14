const commands = require('./../../commands/');
const Util = require('./../../util/Util');

module.exports = class {
  constructor(options) {
    this.client = options.grace.getClient();
    this.grace = options.grace;
    this.redisClient = options.grace.getRedisClient();
    this.enabledCommands = options.grace.getConfig().enabledCommands;
    this.prefix = options.grace.getConfig().defaultPrefix;
    this.xpCD = {};
  }

  async addExp(member) {
    const memberCD = this.xpCD[member.id];
    if (memberCD && memberCD.includes(member.guild.id)) return;
    if (!memberCD) this.xpCD[member.id] = [];
    this.xpCD[member.id].push(member.guild.id);
    const elementIndex = this.xpCD[member.id].length;
    setTimeout(() => {
      if (this.xpCD[member.id].length === 1) {
        delete this.xpCD[member.id];
        return;
      }
      this.xpCD[member.id].splice(elementIndex, 1);
    }, 180000);
    const rndAmount = Math.floor(Math.random() * 6) + 1;
    const totalXP = await this.redisClient.zincrby(`guildxp:${member.guild.id}`, rndAmount, `member:${member.id}`);
    if (Util.getXpInLv(totalXP) > Util.getXpInLv(totalXP - rndAmount)) {
      const roleRewardID = await this.redisClient.hget(`guildrankrewards:${member.guild.id}`, Util.getXpInLv(totalXP));
      const roleReward = member.guild.roles.get(roleRewardID);
      if (roleReward && roleReward.editable) member.roles.add(roleRewardID, 'adding rank reward role.');
    }
  }

  start() {
    let cmd;
    let spaceIndex;
    this.client.on('message', (msg) => {
      if (msg.channel.type !== 'text' || msg.author.bot) return;
      if (msg.content.length > 12) this.addExp(msg.member);
      if (msg.content.indexOf(this.prefix) !== 0) return;

      cmd = msg.content.substring(this.prefix.length).toUpperCase();
      spaceIndex = cmd.indexOf(' ');
      cmd = (spaceIndex === -1) ? cmd : cmd.substring(0, spaceIndex);
      if (this.enabledCommands.includes(cmd)) commands[cmd](msg, this.grace);
    });
  }
};
