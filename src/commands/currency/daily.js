const dailyCD = new Map();

module.exports = (msg, grace) => {
  const CD = dailyCD.get(msg.author.id);
  if (CD && Date.now() < CD) {
    msg.reply('you already got your dailies today, huh!')
      .catch(() => {});
    return;
  }

  const tomorrow = new Date(Date.now());
  const rndBlossoms = Math.floor(Math.random() * 17) + 6;
  tomorrow.setDate(tomorrow.getDate() + 1);
  dailyCD.set(msg.author.id, tomorrow.getTime());

  grace.getRedisClient().hincrby(`user:${msg.author.id}`, 'userBlossoms', rndBlossoms);
  msg.reply(`you got **${rndBlossoms}** 🌼 ^^`)
    .catch(() => {});
};
