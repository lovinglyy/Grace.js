const { MessageEmbed } = require('discord.js');
const Cooldown = require('../../structures/Cooldown');

/**
* Show a guild leaderboard.
* @param {string} msg - A Discord message
* @param {object} asyncRedis Async redis methods
*/
module.exports = async (msg, _, asyncRedis) => {
  const leaderboardCD = new Cooldown({ key: msg.guild.id, obj: 'leaderboard' });
  let leaderboardDisplay = '';
  let guildLeaderboard;
  let memberGet;

  if (leaderboardCD.exists()) {
    leaderboardDisplay = leaderboardCD.get();
  } else {
    guildLeaderboard = await asyncRedis.zrevrange(`guildxp:${msg.guild.id}`, 0, 10, 'WITHSCORES')
      .catch(() => null);
    if (!guildLeaderboard || guildLeaderboard.length < 1) {
      msg.reply('the guild leaderboard is empty!');
      return;
    }
    for (let i = 0; i < guildLeaderboard.length; i += 2) {
      memberGet = msg.guild.members.resolve(guildLeaderboard[i].substring(7));
      if (memberGet) leaderboardDisplay += `**${memberGet.displayName}**: ${guildLeaderboard[i + 1]}xp\n`;
    }
    leaderboardCD.set(leaderboardDisplay, 360);
  }

  const embed = new MessageEmbed()
    .setTitle(`${msg.guild.name}'s leaderboard:`)
    .setColor(11529967)
    .setDescription(leaderboardDisplay)
    .setFooter('The list is refreshed periodically.');

  msg.channel.send('Be active to increase your xp! :3', { embed });
};
