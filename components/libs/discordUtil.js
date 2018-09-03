const { MessageEmbed } = require('discord.js');
const util = require('./util');

class DiscordUtil {

  /**
   * Get the text next to the command issued as a single argument,
   * not splitting it.
   *  @param {Message} msg A Discord Message
   */
  static getSingleArg(message) {
    if (message.content.indexOf(' ') === -1) return false;
    return message.content.substring(message.content.indexOf(' ') + 1);
  }

  /**
   * Send a basic default embed, with defined color and thumb.
   * @param {string} text A message to be displayed in the embed description
   * @param {Message} msg Discord Message
   * @param {string} content Optional value to send as the message content
   */
  static sendDefaultEmbed(text, msg, content = null) {
    const embed = new MessageEmbed()
      .setDescription(text)
      .setColor(11529967)
      .setThumbnail(msg.guild.me.user.displayAvatarURL({ size: 256 }));
    msg.channel.send(content, { embed });
  }

  /**
  * Get a GuildMember in a message by iterating with members in a guild.
  * First it will see if the username match, then if the displayName does.
  * After that it stores the member displayName in a array with a similiarity
  * value between the member that is current iterating and the one that is being searched.
  * For performance, it doesn't do one iteration for usernames,
  * another for display names and another to
  * check similarity, it's only one so it's not certain about which one will be found first.
  * @param {string} search - A string that we will search for a member in it.
  * @param {string} msg Need to be a Discord message, it's used to send outputs for the user and
  * get the guild.
  * @param {boolean} errorReply Show or not a reply message if we didn't found a user.
  * @returns {object|boolean} Return the Discord Member found or a false value.
  */
  static getMember(search, msg, errorReply) {
    const similarMembers = [];
    const resolveMember = msg.guild.members.resolve(search);
    let displayNameUpper;
    let memberUsername;
    let namesSimilarity;

    if (resolveMember) return resolveMember;

    if (search.length < 3 || search.length > 16) {
      if (errorReply) msg.channel.send(`${msg.author}, sorry but I couldn't find the specified member :c`);
      return false;
    }

    const usernameSearch = msg.guild.members.first(55).find((curMember) => {
      displayNameUpper = curMember.displayName.toUpperCase();
      memberUsername = `${curMember.user.username}#${curMember.user.discriminator}`;
      namesSimilarity = util.compareStrings(displayNameUpper, search);
      if (namesSimilarity > 0.32) {
        similarMembers.push([namesSimilarity, `${curMember.displayName} (${memberUsername})`]);
      }
      return (memberUsername.toUpperCase() === search || displayNameUpper === search);
    });

    if (usernameSearch) return usernameSearch;

    if (similarMembers.length === 0) {
      if (errorReply) msg.channel.send(`${msg.author}, sorry but I couldn't find the specified member :c`);
      return false;
    }

    similarMembers.sort((a, b) => b[0] - a[0]);

    let fSimilarMembers = '';
    for (let i = 0; i < 6; i += 1) {
      if (similarMembers[i]) fSimilarMembers += `${similarMembers[i][1]}\n`;
    }

    if (errorReply) {
      this.sendDefaultEmbed(
        `There are some members with a similar name: \`\`\`${fSimilarMembers}\`\`\``,
        msg,
        `${msg.author}, sorry but I couldn't find the specified member :c`,
      );
    }
    return false;
  }

  /**
  * Find a member in a Discord message sent by a GuildMember.
  * @param {string} msg - A str intended to be a message sent from a Discord user,
  * we will search for the member here.
  * @param {boolean} errorReply Show or not a reply message if we didn't found a user.
  * @returns {object|boolean} Returns the same value as getMember(search, msg),
  * the Discord Member found or a false value.
  */
  static findOneMember(msg, errorReply = true) {
    let possibleMember = msg.mentions.members.first();
    if (!possibleMember) {
      const singleArgument = this.getSingleArg(msg);
      if (!singleArgument) {
        msg.reply('please mention a user or type a username/display name ^^');
        return false;
      }
      possibleMember = this.getMember(singleArgument.toUpperCase(), msg, errorReply);
      if (!possibleMember) return false;
    }
    return possibleMember;
  }
}

module.exports = DiscordUtil;
