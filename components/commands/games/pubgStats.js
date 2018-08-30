const { promisify } = require('util');
const apiModel = require('./model');

module.exports = {
  /**
	* Command for pubg stats about a player.
	* @param {string} msg A Discord message.
  * @param {number} argSeparator The index where the message is separated
	* @param {string} pubgKey PUBG Api key, https://developer.playbattlegrounds.com/
	*/
  async cmd(msg, argSeparator, pubgKey) {
    const singleArgument = msg.content.substring(argSeparator);

    const options = {};
    options.region = 'pc-na';
    options.params = singleArgument;
    options.pubgKey = pubgKey;
    const pugbAPI = new apiModel.PubgAPI(options);

    const stats = await pugbAPI.getPlayer();
    if (!(stats.data) || !(stats.data[0])) return msg.reply('couldn\'t find data for that player.');
    const playerSeason = await pugbAPI.getPlayerSeasonInfo(stats.data[0].id);
    if (!playerSeason) return msg.reply('couldn\'t find this season data for that player.');
    msg.channel.send(`${stats.data[0].attributes.name}'s info:`, { embed: playerSeason });
  },
};
