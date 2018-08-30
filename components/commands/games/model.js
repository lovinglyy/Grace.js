const fetch = require('node-fetch');
const Discord = require('discord.js');

class PubgAPI {
  constructor(options) {
    this.apiKey = options.pubgKey;
    this.region = options.region;
    this.params = options.params;
  }

  /**
  * This function returns info about a player by searching player names in the API.
  * @returns {Object} a json object with the player info will return.
  */
  async getPlayer() {
    const search = await fetch(`https://api.pubg.com/shards/${this.region}/players?filter[playerNames]=${this.params}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${this.apiKey}`, Accept: 'application/vnd.api+json' },
    });
    return await search.json();
  }

  /**
  * This function is used to get some season stats for a player(using the accountID).
  * @param {string} accountID the pubg accountId used to get the stats.
  * @returns {Discord.RichEmbed|boolean} it will return a embed with the stats or a false value.
  */
  async getPlayerSeasonInfo(accountID) {
    const today = new Date(Date.now());
    let month = today.getMonth() + 2;
    if (month > 12) month = 1;
    if (month < 10) month = `0${month}`;
    const season = `${today.getFullYear()}-${month}`;
    let search = await fetch(`https://api.pubg.com/shards/${this.region}/players/${accountID}/seasons/division.bro.official.${season}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${this.apiKey}`, Accept: 'application/vnd.api+json' },
    });
    search = await search.json();
    if (!search || !(search.data)) return false;
    const gameModes = [
      ['Solo', search.data.attributes.gameModeStats.solo],
      ['Solo FPP', search.data.attributes.gameModeStats['solo-fpp']],
      ['Duo', search.data.attributes.gameModeStats.duo],
      ['Duo FPP', search.data.attributes.gameModeStats['duo-fpp']],
      ['Squad', search.data.attributes.gameModeStats.squad],
      ['Squad FPP', search.data.attributes.gameModeStats['squad-fpp']],
    ];

    const embed = new Discord.RichEmbed()
      .setColor(11529967);
    for (let i = 0; i < gameModes.length; i++) {
      if (gameModes[i][1].roundsPlayed !== 0) {
        embed.addField(gameModes[i][0], `**Wins:** ${gameModes[i][1].wins} / **Losses:** ${gameModes[i][1].losses}
          **Kills:** ${gameModes[i][1].kills} **HS kills:** ${gameModes[i][1].headshotKills} **Assists:** ${gameModes[i][1].assists} **Daily kills:** ${gameModes[i][1].dailyKills} **Dmg dealt:** ${gameModes[i][1].damageDealt} **Round most kills:** ${gameModes[i][1].roundMostKills} **Rounds played:** ${gameModes[i][1].roundsPlayed}`, true);
      }
    }
    if (!(embed.fields)) embed.setDescription('This user has no data to show in the new season.');
    return embed;
  }
}
module.exports = { PubgAPI };
