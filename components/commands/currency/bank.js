module.exports = async (msg, _, asyncRedis) => {
  const userBlossoms = await asyncRedis.hget(msg.author.id, 'userBlossoms') || '0';
  msg.reply(`you have **${userBlossoms}** 🌼 in your bank.`);
};
