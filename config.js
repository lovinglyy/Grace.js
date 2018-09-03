const config = {};
config.botOwner = 'bot owner id';
config.token = 'bot token';
config.defaultPrefix = '--';
config.youtubeAPI = 'youtube v3 api key, https://developers.google.com/youtube/v3/';
config.pubgAPI = 'your pubg api key, https://developer.playbattlegrounds.com/';
config.enabledCommands = ['DAILY', 'BANK', 'ROULETTE', 'IDC', 'POKE', 'YUMMY', 'POSITIVE', 'HUG', 'ANGRY',
  'CHARM', 'EW', 'PLAY', 'QUEUE', 'PLAYLISTADD', 'PLAYLIST', 'PLAYLISTCLEAR', 'PLAYLISTREMOVE', 'PUBGSTATS',
  'DP', 'ASK', 'PURGE', 'BAN', 'KICK', 'BOTMESSAGE'];

Object.freeze(config);
module.exports = config;