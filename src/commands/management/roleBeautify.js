const Cooldown = require('./../../structures/Cooldown');
const { palletes } = require('./../../util/Constants');

module.exports = (msg) => {
  if (!msg.member.hasPermission('MANAGE_ROLES')) return;
  if (!msg.guild.me.hasPermission('MANAGE_ROLES')) return;

  const roleBeautifyCD = new Cooldown({ key: msg.guild.id, obj: 'roleBeautify' });

  if (roleBeautifyCD.exists()) {
    msg.reply('this guild has a cooldown for this magical command! Don\'t worry, it\'s only a few seconds!!')
      .catch(() => {});
    return;
  }

  const roleList = msg.mentions.roles;
  if (!roleList || roleList.size < 3 || roleList.size > 5) {
    msg.reply('you need to mention the roles, from 3, up to 5! Example: @Role 1, @Role 2, @Role 3.')
      .catch(() => {});
    return;
  }

  if (roleList.some(role => !role.editable)) {
    msg.reply('please make sure that I can edit all specified roles.')
      .catch(() => {});
    return;
  }

  roleBeautifyCD.set(1, 12);
  const rndPallete = palletes[(Math.random() * (palletes.length)) << 0][0];
  let colorIndex = 0;
  roleList.each((role) => {
    role.setColor(rndPallete.colors[colorIndex]);
    colorIndex += 1;
  });

  msg.channel.send(`Colors are now magically set to the **${rndPallete.name}** pallete!`)
    .catch(() => {});
};
