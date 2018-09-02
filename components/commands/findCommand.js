const reactions = require('./reactions/');
const moderation = require('./moderation/');
const owner = require('./owner/');
const utilities = require('./utilities/');
const music = require('./music/');
const currency = require('./currency/');
const games = require('./games/');

module.exports = {
  findCommand(msg, commandAndArgs, grace, argSeparator) {
    const spacePlace = commandAndArgs.indexOf(' ');
    const CMD_SYNTAX = (spacePlace === -1)
      ? commandAndArgs : commandAndArgs.substring(0, spacePlace);

    // Currency commands
    if (CMD_SYNTAX === 'DAILY') return currency.daily.cmd(msg, grace.getCooldown('daily'), grace.getRedisClient());
    if (CMD_SYNTAX === 'BANK') return currency.bank.cmd(msg, grace.getRedisClient());
    if (CMD_SYNTAX === 'ROULETTE') return currency.roulette.cmd(msg, grace.getCooldown('currency'), grace.getRedisClient(), argSeparator + CMD_SYNTAX.length);

    // Reaction commands
    if (CMD_SYNTAX === 'IDC') return reactions.idc(msg, argSeparator + CMD_SYNTAX.length);
    if (CMD_SYNTAX === 'POKE') return reactions.poke(msg, argSeparator + CMD_SYNTAX.length);
    if (CMD_SYNTAX === 'YUMMY') return reactions.yummy(msg);
    if (CMD_SYNTAX === 'POSITIVE') return reactions.positive(msg, argSeparator + CMD_SYNTAX.length);
    if (CMD_SYNTAX === 'HUG' || CMD_SYNTAX === 'CUDDLE') return reactions.hug(msg, argSeparator + CMD_SYNTAX.length);
    if (CMD_SYNTAX === 'ANGRY' || CMD_SYNTAX === 'RAGE') return reactions.angry(msg, argSeparator + CMD_SYNTAX.length);
    if (CMD_SYNTAX === 'CHARM' || CMD_SYNTAX === 'FLIRT') return reactions.charm(msg, argSeparator + CMD_SYNTAX.length);
    if (CMD_SYNTAX === 'EW' || CMD_SYNTAX === 'EWW' || CMD_SYNTAX === 'EWW') return reactions.ew(msg, argSeparator + CMD_SYNTAX.length);

    // Music
    if (CMD_SYNTAX === 'PLAY') {
      return music.play.cmd(msg, argSeparator + CMD_SYNTAX.length,
        grace.getRedisClient(), grace.getConfig().youtubeAPI);
    }
    if (CMD_SYNTAX === 'QUEUE') return music.queue.cmd(msg, grace.getRedisClient(), argSeparator + CMD_SYNTAX.length);

    if (CMD_SYNTAX === 'PLAYLISTADD' || CMD_SYNTAX === 'PLADD') {
      return music.playlistAdd.cmd(msg, argSeparator + CMD_SYNTAX.length,
        grace.getRedisClient(), grace.getConfig().youtubeAPI);
    }
    if (CMD_SYNTAX === 'PLAYLISTCLEAR' || CMD_SYNTAX === 'PLCLEAR') return music.playlistClear.cmd(msg, grace.getRedisClient());
    if (CMD_SYNTAX === 'MYPLAYLIST' || CMD_SYNTAX === 'PLAYLIST' || CMD_SYNTAX === 'PL') return music.myPlaylist.cmd(msg, grace.getRedisClient());
    if (CMD_SYNTAX === 'PLAYLISTREMOVE' || CMD_SYNTAX === 'PLREMOVE') {
      return music.playlistRemove.cmd(msg, argSeparator + CMD_SYNTAX.length,
        grace.getRedisClient());
    }

    // Games
    if (CMD_SYNTAX === 'PUBGSTATS') {
      return games.pubgStats.cmd(msg, argSeparator + CMD_SYNTAX.length,
        grace.getConfig().pubgAPI, grace.getCooldown('pubg'));
    }

    // Utilities
    if (CMD_SYNTAX === 'DP') return utilities.dp.cmd(msg, argSeparator + CMD_SYNTAX.length);
    if (CMD_SYNTAX === 'ASK') return utilities.ask.cmd(msg);

    // Moderation commands
    if (msg.member.hasPermission('MANAGE_MESSAGES')) { if (CMD_SYNTAX === 'PURGE') return moderation.purge.cmd(msg, argSeparator + CMD_SYNTAX.length); }
    if (msg.member.hasPermission('BAN_MEMBERS')) { if (CMD_SYNTAX === 'BAN') return moderation.ban.cmd(msg, argSeparator + CMD_SYNTAX.length); }
    if (msg.member.hasPermission('KICK_MEMBERS')) { if (CMD_SYNTAX === 'KICK') return moderation.kick.cmd(msg, argSeparator + CMD_SYNTAX.length); }

    // Commands for the bot owner
    if (msg.author.id === grace.getConfig().botOwner
    && msg.guild.ownerID === grace.getConfig().botOwner) {
      if (CMD_SYNTAX === 'BOTMESSAGE' || CMD_SYNTAX === 'BOTMSG') {
        owner.botMsg.cmd(msg, argSeparator + CMD_SYNTAX.length);
      }
    }
    return true;
  },
};
