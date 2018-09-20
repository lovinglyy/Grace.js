const apiModel = require('./model');
const Cooldown = require('./../../structures/Cooldown');
const DiscordUtil = require('./../../util/DiscordUtil');

/**
* Command for pubg stats about a player.
* @param {string} msg A Discord message.
* @param {object} grace Grace object from the class, it will
* be used to get the API key.
*/
module.exports = async (msg, grace) => {
  const pubgKey = grace.getConfig().pubgAPI;
  const singleArgument = DiscordUtil.getSingleArg(msg);
  const pubgCD = new Cooldown({ key: msg.author.id, obj: 'pubgCD' });

  if (pubgCD.exists()) {
    msg.reply('this command is on cooldown!!').catch(() => {});
    return;
  }

  const options = {};
  options.region = 'pc-na';
  options.params = singleArgument;
  options.pubgKey = pubgKey;
  const pugbAPI = new apiModel.PubgAPI(options);

  pubgCD.set(1, 20);
  const stats = await pugbAPI.getPlayer();
  if (!(stats.data) || !(stats.data[0])) {
    msg.reply('couldn\'t find data for that player.').catch(() => {});
    return;
  }
  const playerSeason = await pugbAPI.getPlayerSeasonInfo(stats.data[0].id);
  if (!playerSeason) {
    msg.reply('couldn\'t find this season data for that player.').catch(() => {});
    return;
  }
  msg.channel.send(`${stats.data[0].attributes.name}'s info:`, { embed: playerSeason })
    .catch(() => {});
};
