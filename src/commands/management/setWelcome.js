const Cooldown = require('./../../structures/Cooldown');
const DiscordUtil = require('./../../util/DiscordUtil');

module.exports = async (msg, grace) => {
  if (!msg.member.hasPermission('ADMINISTRATOR')) return;
  const redisClient = grace.getRedisClient();
  const singleArgument = DiscordUtil.getSingleArg(msg);
  const setWelcomeCD = new Cooldown({ key: msg.guild.id, obj: 'setWelcome' });

  if (setWelcomeCD.exists()) {
    msg.reply('this guild has a cooldown for this command :c - please wait a while.')
      .catch(() => {});
    return;
  }

  if (!singleArgument) {
    msg.reply('please tell me the new welcome message owo').catch(() => {});
    return;
  }

  if (singleArgument === 'remove') {
    const deleted = await redisClient.hdel(`guild:${msg.guild.id}`, 'welcome', 'welcomeChannel');
    if (deleted !== 2) {
      msg.reply('this guild has no welcome message.').catch(() => {});
    } else {
      msg.reply('this guild has no longer a welcome message.').catch(() => {});
    }
    setWelcomeCD.set(1, 60);
    return;
  }

  if (singleArgument.length > 146) {
    msg.reply('that welcome message is too long!! Please write something with around ~140 characters(a bit more is okay!).')
      .catch(() => {});
    return;
  }

  setWelcomeCD.set(1, 300);
  redisClient.hset(`guild:${msg.guild.id}`, 'welcome', `${singleArgument}`);
  redisClient.hset(`guild:${msg.guild.id}`, 'welcomeChannel', `${msg.channel.id}`);
  msg.channel.send(`This guild now has a neat welcome message in **${msg.channel.name}**! 🌺`)
    .catch(() => {});
};
