const Cooldown = require('./../../structures/Cooldown');

module.exports = (msg, grace) => {
  if (!msg.member.hasPermission('MANAGE_CHANNELS')) return;
  const starboardCD = new Cooldown({ key: msg.guild.id, obj: 'starboard' });

  if (starboardCD.exists()) {
    msg.reply('the starboard channel for this guild was set recently, please wait a while. o-o')
      .catch(() => {});
    return;
  }

  starboardCD.set(1, 180);
  grace.getRedisClient().hset(`guild:${msg.guild.id}`, 'starboardChannel', `${msg.channel.id}`);
  msg.channel.send(`Your cool guild starboard will be in **${msg.channel}** channel!!`)
    .catch(() => {});
};
