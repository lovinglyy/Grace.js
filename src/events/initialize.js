const { promisify } = require('util');
const discordEvents = require('./discordEvents/');
const redisEvents = require('./redisEvents/');

module.exports = (grace) => {
  const client = grace.getClient();
  const asyncRedis = {
    hget: promisify(grace.getRedisClient().hget).bind(grace.getRedisClient()),
    zrevrange: promisify(grace.getRedisClient().zrevrange)
      .bind(grace.getRedisClient()),
    zrevrank: promisify(grace.getRedisClient().zrevrank).bind(grace.getRedisClient()),
    zscore: promisify(grace.getRedisClient().zscore).bind(grace.getRedisClient()),
  };
  const ready = new discordEvents.ReadyEvent(client);
  const message = new discordEvents.MessageEvent({ client, grace, asyncRedis });
  const guildMemberAdd = new discordEvents.GuildMemberAddEvent({ client, asyncRedis });
  const msgReactionAddEvent = new discordEvents.MsgReactionAddEvent({ client, asyncRedis });
  const readyRedis = new redisEvents.ReadyRedisEvent(grace.getRedisClient());

  ready.start();
  message.start();
  guildMemberAdd.start();
  msgReactionAddEvent.start();
  readyRedis.start();
};
