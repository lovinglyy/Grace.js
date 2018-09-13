const discordEvents = require('./discordEvents/');
const redisEvents = require('./redisEvents/');

module.exports = (grace) => {
  const client = grace.getClient();
  const redisClient = grace.getRedisClient();
  const ready = new discordEvents.ReadyEvent(client);
  const message = new discordEvents.MessageEvent({ grace });
  const guildMemberAdd = new discordEvents.GuildMemberAddEvent({ client, redisClient });
  const msgReactionAddEvent = new discordEvents.MsgReactionAddEvent({ client, redisClient });
  const readyRedis = new redisEvents.ReadyRedisEvent(grace.getRedisClient());

  ready.start();
  message.start();
  guildMemberAdd.start();
  msgReactionAddEvent.start();
  readyRedis.start();
};
