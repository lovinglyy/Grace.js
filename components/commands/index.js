const reactions = require('./reactions/');
const moderation = require('./moderation/');
const owner = require('./owner/');
const utilities = require('./utilities/');
const music = require('./music/');
const currency = require('./currency/');
const games = require('./games/');
const management = require('./management/');
const fun = require('./fun/');

const commands = {
  DAILY: (msg, grace, asyncRedis) => currency.daily(msg, grace, asyncRedis),
  BANK: (msg, _, asyncRedis) => currency.bank(msg, _, asyncRedis),
  ROULETTE: (msg, grace, asyncRedis) => currency.roulette(msg, grace, asyncRedis),

  IDC: (msg, grace) => reactions.idc(msg, grace),
  POKE: (msg, grace) => reactions.poke(msg, grace),
  YUMMY: (msg, grace) => reactions.yummy(msg, grace),
  POSITIVE: (msg, grace) => reactions.positive(msg, grace),
  HUG: (msg, grace) => reactions.hug(msg, grace),
  ANGRY: (msg, grace) => reactions.angry(msg, grace),
  CHARM: (msg, grace) => reactions.charm(msg, grace),
  EW: (msg, grace) => reactions.ew(msg, grace),

  PLAY: (msg, grace, asyncRedis) => music.play(msg, grace, asyncRedis),
  QUEUE: msg => music.queue(msg),
  PLAYLISTADD: (msg, grace, asyncRedis) => music.playlistAdd(msg, grace, asyncRedis),
  PLAYLISTCLEAR: (msg, grace) => music.playlistClear(msg, grace),
  PLAYLIST: (msg, _, asyncRedis) => music.myPlaylist(msg, _, asyncRedis),
  PLAYLISTREMOVE: (msg, grace, asyncRedis) => music.playlistRemove(msg, grace, asyncRedis),

  PUBGSTATS: (msg, grace) => games.pubgStats(msg, grace),

  DP: (msg, grace) => utilities.dp(msg, grace),
  GUILDINFO: msg => utilities.guildInfo(msg),

  ASK: msg => fun.ask(msg),
  CAT: msg => fun.cat(msg),

  PURGE: msg => moderation.purge(msg),
  BAN: msg => moderation.ban(msg),
  KICK: msg => moderation.kick(msg),
  REMOVEROLES: (msg, grace) => moderation.removeRoles(msg, grace),

  ROLEBEAUTIFY: msg => management.roleBeautify(msg),
  SETWELCOME: (msg, grace) => management.setWelcome(msg, grace),
  STARBOARD: (msg, grace) => management.starboard(msg, grace),

  BOTMESSAGE: (msg, grace) => owner.botMsg(msg, grace),
};

module.exports = commands;
