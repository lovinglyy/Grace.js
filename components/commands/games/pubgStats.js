const apiModel = require('./model');

module.exports = {
  /**
  * Command for pubg stats about a player.
  * @param {string} msg A Discord message.
  * @param {number} argSeparator The index where the message is separated
  * @param {string} pubgKey PUBG Api key, https://developer.playbattlegrounds.com/
  */
  async cmd(msg, argSeparator, pubgKey, pubgCD) {
    const singleArgument = msg.content.substring(argSeparator);
    const authorID = msg.author.id;

    let elemIndex = -1;
    const searchUser = pubgCD.find((element) => {
      elemIndex += 1;
      return (authorID === element[0]);
    });
    if (searchUser) {
      if (Date.now() >= searchUser[1]) {
        pubgCD.splice(elemIndex, 1);
      } else {
        return msg.reply('this command is on cooldown!');
      }
    }

    const options = {};
    options.region = 'pc-na';
    options.params = singleArgument;
    options.pubgKey = pubgKey;
    const pugbAPI = new apiModel.PubgAPI(options);

    const cdTime = new Date(Date.now());
    cdTime.setSeconds(cdTime.getSeconds() + 20);
    pubgCD.push([authorID, cdTime.getTime()]);

    const stats = await pugbAPI.getPlayer();
    if (!(stats.data) || !(stats.data[0])) return msg.reply('couldn\'t find data for that player.');
    const playerSeason = await pugbAPI.getPlayerSeasonInfo(stats.data[0].id);
    if (!playerSeason) return msg.reply('couldn\'t find this season data for that player.');
    msg.channel.send(`${stats.data[0].attributes.name}'s info:`, { embed: playerSeason });
    return true;
  },
};
