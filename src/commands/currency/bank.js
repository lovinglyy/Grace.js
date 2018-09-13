module.exports = async (msg, grace) => {
  const userBlossoms = await grace.getRedisClient().hget(`user:${msg.author.id}`, 'userBlossoms') || '0';
  msg.reply(`you have **${userBlossoms}** 🌼 in your bank.`);
};
