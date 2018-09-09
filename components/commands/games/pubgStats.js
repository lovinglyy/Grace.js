const apiModel = require('./model');
const libs = require('./../../libs/');

const pubgCD = new Map();

/**
* Command for pubg stats about a player.
* @param {string} msg A Discord message.
* @param {object} grace Grace object from the class, it will
* be used to get the API key.
*/
module.exports = async (msg, grace) => {
  const pubgKey = grace.getConfig().pubgAPI;
  const singleArgument = libs.discordUtil.getSingleArg(msg);
  const authorID = msg.author.id;

  if (!libs.util.checkCooldown(msg.author.id, pubgCD)) {
    msg.reply('this command is on cooldown!!');
    return;
  }

  const options = {};
  options.region = 'pc-na';
  options.params = singleArgument;
  options.pubgKey = pubgKey;
  const pugbAPI = new apiModel.PubgAPI(options);

  libs.util.setCooldown(pubgCD, authorID, 20);
  const stats = await pugbAPI.getPlayer();
  if (!(stats.data) || !(stats.data[0])) {
    msg.reply('couldn\'t find data for that player.');
    return;
  }
  const playerSeason = await pugbAPI.getPlayerSeasonInfo(stats.data[0].id);
  if (!playerSeason) {
    msg.reply('couldn\'t find this season data for that player.');
    return;
  }
  msg.channel.send(`${stats.data[0].attributes.name}'s info:`, { embed: playerSeason });
};
