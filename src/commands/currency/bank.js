const Cooldown = require('../../structures/Cooldown');

module.exports = async (msg, grace) => {
  const currencyCD = new Cooldown({ key: msg.author.id, obj: 'currency' });
  if (currencyCD.exists()) {
    msg.reply('currency commands in cooldown!! :3')
      .catch(() => {});
    return;
  }

  currencyCD.set(1, 3);
  const userBlossoms = await grace.getRedisClient().hget(`user:${msg.author.id}`, 'userBlossoms') || '0';
  msg.reply(`you have **${userBlossoms}** 🌼 in your bank.`)
    .catch(() => {});
};
