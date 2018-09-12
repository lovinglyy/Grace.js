const react = require('./reactions/');
const moderation = require('./moderation/');
const owner = require('./owner/');
const utilities = require('./utilities/');
const music = require('./music/');
const currency = require('./currency/');
const games = require('./games/');
const management = require('./management/');
const xp = require('./xp/');
const fun = require('./fun/');

const commands = {
  DAILY: (msg, grace) => currency.daily(msg, grace),
  BANK: (msg, _, asyncRedis) => currency.bank(msg, _, asyncRedis),
  ROULETTE: (msg, grace, asyncRedis) => currency.roulette(msg, grace, asyncRedis),

  IDC: (msg, grace) => react(msg, grace, 'idc'),
  POKE: (msg, grace) => react(msg, grace, 'poke', true),
  YUMMY: (msg, grace) => react(msg, grace, 'yummy'),
  POSITIVE: (msg, grace) => react(msg, grace, 'positive'),
  HUG: (msg, grace) => react(msg, grace, 'hug', true),
  ANGRY: (msg, grace) => react(msg, grace, 'angry'),
  CHARM: (msg, grace) => react(msg, grace, 'charm', true),
  EW: (msg, grace) => react(msg, grace, 'ew'),

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

  LEADERBOARD: (msg, _, asyncRedis) => xp.leaderboard(msg, _, asyncRedis),
  RANK: (msg, grace, asyncRedis) => xp.rank(msg, grace, asyncRedis),

  BOTMESSAGE: (msg, grace) => owner.botMsg(msg, grace),
};

module.exports = commands;
