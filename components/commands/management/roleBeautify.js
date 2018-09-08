const libs = require('./../../libs/');

const palletes = [
  [{ name: 'Chocolate Sunset', colors: ['#BF8777', '#7F5A4F', '#FFB49E', '#402D28', '#E5A28F'] }],
  [{ name: 'Angry Blossom', colors: ['#6FBF83', '#4A7F58', '#93FFAF', '#25402C', '#85E59E'] }],
  [{ name: 'Coffee Addiction', colors: ['#BF7859', '#7F503B', '#FFA077', '#40281E', '#E5906B'] }],
  [{ name: 'I Feel Blue', colors: ['#5CAABF', '#3D717F', '#7BE3FF', '#1F3940', '#6ECCE5'] }],
  [{ name: 'Love', colors: ['#BF5F5D', '#7F3F3E', '#FF7E7D', '#592C2B', '#E57170'] }],
  [{ name: 'Discord a e s t h e t i c s', colors: ['#9890BF', '#65607F', '#CBC0FF', '#333040', '#B7ADE5'] }],
  [{ name: 'Clouds', colors: ['#34BFAB', '#237F72', '#45FFE4', '#114039', '#3EE5CD'] }],
  [{ name: 'Bubblegum', colors: ['#BF7FA4', '#7F546D', '#FFA9DA', '#402A37', '#E598C4'] }],
  [{ name: 'Fake Love', colors: ['#A28EBF', '#6C5F7F', '#D8BDFF', '#362F40', '#C3AAE5'] }],
  [{ name: 'Reciprocal', colors: ['#BF635B', '#7F423D', '#FF847A', '#592E2B', '#E5776E'] }],
  [{ name: 'Chill', colors: ['#BFB293', '#7F7762', '#FFEEC5', '#403B31', '#E5D6B1'] }],
  [{ name: 'Pills', colors: ['#8576BF', '#594F7F', '#B29DFF', '#3E3759', '#A08DE5'] }],
  [{ name: 'Honeycomb', colors: ['#BF5C36', '#7F3D24', '#FF7B48', '#401F12', '#E56F41'] }],
  [{ name: 'Sweet Friendzone', colors: ['#BF3876', '#7F254E', '#FF4B9D', '#401327', '#E5438D'] }],
  [{ name: 'Marina', colors: ['#11AABF', '#0B717F', '#17E2FF', '#063940', '#14CCE5'] }],
  [{ name: 'Summer', colors: ['#BF5F44', '#7F3F2D', '#FF7E5B', '#402017', '#E57152'] }],
  [{ name: 'February', colors: ['#BF833C', '#7F5728', '#FFAE50', '#402C14', '#E59D48'] }],
  [{ name: 'Garden', colors: ['#4ABF4D', '#317F34', '#62FF67', '#19401A', '#58E55D'] }],
  [{ name: 'Hope', colors: ['#BBBDBF', '#7D7E7F', '#FAFCFF', '#3E3F40', '#E1E3E5'] }],
  [{ name: 'April Love', colors: ['#BF6283', '#7F4258', '#FF83AF', '#40212C', '#E5769E'] }],
  [{ name: 'Numb', colors: ['#BFAD8B', '#7F745C', '#FFE7B9', '#403A2E', '#E5D0A6'] }],
  [{ name: 'Harmony', colors: ['#68B298', '#CAFFEC', '#B0FFE3', '#B26958', '#FFBFB0'] }],
  [{ name: 'Childhood', colors: ['#B26E68', '#FFCECA', '#FFB6B0', '#58B27E', '#78FFB1'] }],
];

const guildBeautifyCooldown = new Map();

module.exports = (msg) => {
  if (!msg.member.hasPermission('MANAGE_ROLES')) return;
  if (!msg.guild.me.hasPermission('MANAGE_ROLES')) return;

  if (!libs.util.checkCooldown(msg.guild.id, guildBeautifyCooldown)) {
    msg.reply('this guild has a cooldown for this magical command! Don\'t worry, it\'s only a few seconds!!');
    return;
  }

  const roleList = msg.mentions.roles;
  if (!roleList || roleList.size < 3 || roleList.size > 5) {
    msg.reply('you need to mention the roles, from 3, up to 5! Example: @Role 1, @Role 2, @Role 3.');
    return;
  }

  if (roleList.some(role => !role.editable)) {
    msg.reply('please make sure that I can edit all specified roles.');
    return;
  }

  libs.util.setCooldown(guildBeautifyCooldown, msg.guild.id, 12);

  const rndPallete = palletes[~~(Math.random() * (palletes.length))][0];
  let colorIndex = 0;
  roleList.each((role) => {
    role.setColor(rndPallete.colors[colorIndex]);
    colorIndex += 1;
  });

  msg.channel.send(`Colors are now magically set to the **${rndPallete.name}** pallete!`);
};
