const { MessageEmbed } = require('discord.js');

module.exports = class {
  constructor(options) {
    this.client = options.client;
    this.asyncRedis = options.asyncRedis;
    this.waitList = [];
  }

  start() {
    this.client.on('messageReactionAdd', async (messageReaction, user) => {
      if (messageReaction.emoji.name !== '⭐' || user.bot) return;
      const msg = messageReaction.message;
      if (msg.author.bot) return;
      if (Date.now() > (msg.createdTimestamp) - 55000) return;
      if (messageReaction.count !== 3) return;
      if (this.waitList.includes(msg.id)) return;

      this.waitList.push(msg.id);
      const timeLeft = ((messageReaction.message.createdTimestamp) - 55000) - Date.now();
      if (timeLeft < 1) return;

      this.waitForStars(timeLeft + 5000, msg);
    });
  }

  waitForStars(time, msg) {
    setTimeout(async () => {
      this.waitList.splice(this.waitList.indexOf(msg.id), 1);
      const totalStars = msg.reactions.filter(r => r.emoji.name === '⭐').size;
      if (totalStars < 3) return;
      const starboardChannelID = await this.asyncRedis.hget(`guild: ${msg.guild}`, 'starboardChannel');
      if (!starboardChannelID) return;

      const channel = msg.guild.channels.resolve(starboardChannelID);
      if (!channel || channel.type !== 'text' || !channel.permissionsFor(msg.guild.me).has('SEND_MESSAGES')) return;
      const content = (msg.content.length < 1000) ? msg.content : `${msg.content.substring(999)}...`;
      const starEmbed = new MessageEmbed()
        .setTitle(`${totalStars} ⭐`)
        .addField('Link', msg.url)
        .setColor(11529967)
        .setThumbnail(msg.author.displayAvatarURL({ size: 256 }))
        .setAuthor(`${msg.member.displayName}'s message starred`);
      if (content) starEmbed.addField('Content', content);
      if (msg.attachments.first()) starEmbed.setImage(msg.attachments.first().url);
      channel.send({ embed: starEmbed });
    }, time);
  }
};
