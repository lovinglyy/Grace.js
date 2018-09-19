const discordEvents = require('./discordEvents/');
const redisEvents = require('./redisEvents/');

module.exports = (grace) => {
  const client = grace.getClient();
  const redisClient = grace.getRedisClient();
  const ready = new discordEvents.ReadyEvent(client);
  const message = new discordEvents.MessageEvent({ grace });
  const guildMemberAdd = new discordEvents.GuildMemberAddEvent({ client, redisClient });
  const msgReactionAddEvent = new discordEvents.MsgReactionAddEvent({ client, redisClient });
  const guildCreate = new discordEvents.GuildCreate({ client });

  const readyRedis = new redisEvents.ReadyRedisEvent(grace.getRedisClient());

  ready.start();
  message.start();
  guildMemberAdd.start();
  msgReactionAddEvent.start();
  guildCreate.start();

  readyRedis.start();

  setInterval(() => {
    const dateNow = new Date();
    console.log(`[${dateNow.getHours()}:${dateNow.getMinutes()}] I'm using ${process.memoryUsage().rss} (rss) memory.
Heap total: ${process.memoryUsage().heapTotal} Heap used: ${process.memoryUsage().heapUsed} External: ${process.memoryUsage().external}`);
  }, 60000 * 15);

  setInterval(() => {
    if (guildCreate.get() < 1) return;
    console.log(`I was added to ${guildCreate.get()} guilds in the last 30 minutes.`);
    guildCreate.clear();
  }, 60000 * 30);
};
