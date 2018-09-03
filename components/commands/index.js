const reactions = require('./reactions/');
const moderation = require('./moderation/');
const owner = require('./owner/');
const utilities = require('./utilities/');
const music = require('./music/');
const currency = require('./currency/');
const games = require('./games/');

const commands = {
  DAILY: (msg, grace) => currency.daily.cmd(msg, grace),
  BANK: (msg, grace) => currency.bank.cmd(msg, grace),
  ROULETTE: (msg, grace) => currency.roulette.cmd(msg, grace),

  IDC: (msg, grace) => reactions.idc(msg, grace),
  POKE: (msg, grace) => reactions.poke(msg, grace),
  YUMMY: (msg, grace) => reactions.yummy(msg, grace),
  POSITIVE: (msg, grace) => reactions.positive(msg, grace),
  HUG: (msg, grace) => reactions.hug(msg, grace),
  ANGRY: (msg, grace) => reactions.angry(msg, grace),
  CHARM: (msg, grace) => reactions.charm(msg, grace),
  EW: (msg, grace) => reactions.ew(msg, grace),

  PLAY: (msg, grace) => music.play.cmd(msg, grace),
  QUEUE: (msg, grace) => music.queue.cmd(msg, grace),
  PLAYLISTADD: (msg, grace) => music.playlistAdd.cmd(msg, grace),
  PLAYLISTCLEAR: (msg, grace) => music.playlistClear.cmd(msg, grace),
  PLAYLIST: (msg, grace) => music.myPlaylist.cmd(msg, grace),
  PLAYLISTREMOVE: (msg, grace) => music.playlistRemove.cmd(msg, grace),

  PUBGSTATS: (msg, grace) => games.pubgStats.cmd(msg, grace),

  DP: (msg, grace) => utilities.dp.cmd(msg, grace),
  ASK: msg => utilities.ask.cmd(msg),

  PURGE: msg => moderation.purge.cmd(msg),
  BAN: msg => moderation.ban.cmd(msg),
  KICK: msg => moderation.kick.cmd(msg),

  BOTMESSAGE: (msg, grace) => owner.botMsg.cmd(msg, grace),
};

module.exports = commands;
