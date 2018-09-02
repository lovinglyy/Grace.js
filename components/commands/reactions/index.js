const archive = require('./archive');
const libs = require('./../../libs/');

module.exports = {
  hug(msg, argSeparator) {
    const anotherMember = libs.util.findOneMember(msg, argSeparator);
    if (!anotherMember) return;
    if (anotherMember.id === msg.author.id) {
      msg.reply('I can\'t believe that you\'re so lonely :(');
      return;
    }
    msg.channel.send(`${msg.author} is hugging ${anotherMember}! <3`, { files: [archive.hugs[~~(Math.random() * (archive.hugs.length))]] });
  },
  idc(msg, argSeparator) {
    const anotherMember = libs.util.findOneMember(msg, argSeparator);
    let outputMsg = `${msg.author} don't care...`;
    if (anotherMember) {
      outputMsg = `${msg.author} doesn't care about ${anotherMember}.`;
      if (anotherMember.id === msg.author.id) outputMsg = `${msg.author} don't care...`;
    }
    msg.channel.send(outputMsg, { files: [archive.idc[~~(Math.random() * (archive.idc.length))]] });
  },
  angry(msg, argSeparator) {
    const anotherMember = libs.util.findOneMember(msg, argSeparator, false);
    let outputMsg = `${msg.author} is angry!!!`;
    if (anotherMember) {
      outputMsg = `${msg.author} is angry with ${anotherMember}.`;
      if (anotherMember.id === msg.author.id) outputMsg = `${msg.author} is angry!!!`;
    }
    msg.channel.send(outputMsg, {
      files: [archive.angry[~~(Math.random() * (archive.angry.length))]],
    });
  },
  positive(msg, argSeparator) {
    const anotherMember = libs.util.findOneMember(msg, argSeparator, false);
    let outputMsg = `${msg.author} is feeling positive!`;
    if (anotherMember) {
      outputMsg = `${msg.author} is feeling positive with ${anotherMember}.`;
      if (anotherMember.id === msg.author.id) outputMsg = `${msg.author} is feeling positive!`;
    }
    msg.channel.send(outputMsg, {
      files: [archive.positive[~~(Math.random() * (archive.positive.length))]],
    });
  },
  charm(msg, argSeparator) {
    const anotherMember = libs.util.findOneMember(msg, argSeparator);
    if (!anotherMember) return;
    if (anotherMember.id === msg.author.id) {
      msg.channel.send(`${msg.author} is feeling lonely :c *pat pat*`);
      return;
    }
    msg.channel.send(`${msg.author} is sending their charm to ${anotherMember}! <3 <3`,
      { files: [archive.charm[~~(Math.random() * (archive.charm.length))]] });
  },
  poke(msg, argSeparator) {
    const anotherMember = libs.util.findOneMember(msg, argSeparator);
    if (!anotherMember) return;
    if (anotherMember.id === msg.author.id) {
      msg.channel.send(` ${msg.author} has nobody to poke... t.t`);
      return;
    }
    msg.channel.send(`${msg.author} is poking ${anotherMember}! *grr*`, { files: [archive.poke[~~(Math.random() * (archive.poke.length))]] })
      .catch(console.error);
  },
  yummy(msg) {
    return msg.channel.send(`${msg.author}: *yummyyyyyy*`, { files: [archive.yummy[~~(Math.random() * (archive.yummy.length))]] });
  },
  ew(msg, argSeparator) {
    const anotherMember = libs.util.findOneMember(msg, argSeparator, false);
    let outputMsg = `${msg.author}: ewwwww.`;
    if (anotherMember) {
      outputMsg = `${msg.author} ewww at ${anotherMember}.`;
      if (anotherMember.id === msg.author.id) outputMsg = `${msg.author} ewwww to ${msg.author} @.@`;
    }
    msg.channel.send(outputMsg, { files: [archive.ew[~~(Math.random() * (archive.ew.length))]] });
  },
};
