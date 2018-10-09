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
  BANK: (msg, grace) => currency.bank(msg, grace),
  ROULETTE: (msg, grace) => currency.roulette(msg, grace),

  IDC: (msg, grace) => react(msg, grace, 'idc'),
  POKE: (msg, grace) => react(msg, grace, 'poke', true),
  YUMMY: (msg, grace) => react(msg, grace, 'yummy'),
  POSITIVE: (msg, grace) => react(msg, grace, 'positive'),
  HUG: (msg, grace) => react(msg, grace, 'hug', true),
  ANGRY: (msg, grace) => react(msg, grace, 'angry'),
  CHARM: (msg, grace) => react(msg, grace, 'charm', true),
  EW: (msg, grace) => react(msg, grace, 'ew'),

  PLAY: (msg, grace) => music.play(msg, grace),
  QUEUE: msg => music.queue(msg),
  PLAYLISTADD: (msg, grace) => music.playlistAdd(msg, grace),
  PLAYLISTCLEAR: (msg, grace) => music.playlistClear(msg, grace),
  PLAYLIST: (msg, grace) => music.myPlaylist(msg, grace),
  PLAYLISTREMOVE: (msg, grace) => music.playlistRemove(msg, grace),

  PUBGSTATS: (msg, grace) => games.pubgStats(msg, grace),

  DP: (msg, grace) => utilities.dp(msg, grace),
  INFO: msg => utilities.info(msg),
  SELF: (msg, grace) => utilities.self(msg, grace),
  HELP: msg => utilities.help(msg),

  ASK: msg => fun.ask(msg),
  CAT: msg => fun.cat(msg),
  DOG: msg => fun.dog(msg),
  BUNNY: msg => fun.bunny(msg),

  PURGE: msg => moderation.purge(msg),
  BAN: msg => moderation.ban(msg),
  KICK: msg => moderation.kick(msg),
  REMOVEROLES: (msg, grace) => moderation.removeRoles(msg, grace),

  ROLEBEAUTIFY: msg => management.roleBeautify(msg),
  DEFAULTROLE: (msg, grace) => management.defaultRole(msg, grace),
  SETWELCOME: (msg, grace) => management.setWelcome(msg, grace),
  STARBOARD: (msg, grace) => management.starboard(msg, grace),
  RANKREWARD: (msg, grace) => management.rankReward(msg, grace),
  REWARDLIST: (msg, grace) => management.rewardList(msg, grace),
  SELFASSIGN: (msg, grace) => management.selfAssign(msg, grace),

  LEADERBOARD: (msg, grace) => xp.leaderboard(msg, grace),
  RANK: (msg, grace) => xp.rank(msg, grace),

  BOTMESSAGE: (msg, grace) => owner.botMsg(msg, grace),
  SETXP: (msg, grace) => owner.setXP(msg, grace),
};

module.exports = commands;
