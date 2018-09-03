const apiModel = require('./model');
const libs = require('./../../libs/');

module.exports = {
  /**
  * Command for pubg stats about a player.
  * @param {string} msg A Discord message.
  * @param {object} grace Grace object from the class, it will
  * use to get the API key.
  */
  async cmd(msg, grace) {
    const pubgCD = grace.getCooldown('pubg');
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

    const cdTime = new Date(Date.now());
    cdTime.setSeconds(cdTime.getSeconds() + 20);
    pubgCD.set(authorID, cdTime.getTime());

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
  },
};
