const Discord = require('discord.js');

/**
  * From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  */
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; // The maximum is inclusive and the minimum is inclusive
}

/**
 * Returns an approximate value about how one string is comparable
 * to another, by checking their chars, the string order doesn't matter.
 * Acidentally, the "formula" of this function, is equal to the first formula of
 * the Dice's coefficient, and it's faster than the one using bigrams.
 * If the words doesn't start with the same char, it immediately return.
 * @param {string} str1 - A string that will be compared to str2,
 * it must be a string(typeof str1 need to return 'string').
 * It can't have more than 20 characters.
 * @param {string} str2 - Same as str1, this string will have it's
 * characters compared to str1. It can't have more than 16 characters.
 * @example
 * // returns 0.8571428571428571
 * compareStrings('Mozilla', 'Mozillo');
 * @returns {number} number of equal chars multiplied by two(as equal chars
 * are in both words) divided by the char amount of both strings, or 0/1 in some
 * comparation cases.
 * @see {@https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare localeCompare}
 * this can be used for a better case insensitive reliability,
 * however with some local tests, it appeared to decrease a huge amount of performance.
 */

function compareStrings(str1, str2) {
  if (str1[0] !== str2[0]) return 0;

  let greaterLength = str1.length;
  let smallerLength = str2.length;

  if (str2.length > greaterLength) {
    greaterLength = str2.length;
    smallerLength = str1.length;
  }

  if (greaterLength > 16) return 0;
  let equalChars = 0;

  let i;
  for (i = 0; i < smallerLength + 1; i += 1) {
    if (str1[i] === str2[i] && str1[i] !== ' ' && str2[i] !== ' ') equalChars += 1;
  }
  return equalChars * 2 / (str1.length + str2.length);
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
function getMember(search, msg, errorReply) {
  const similarMembers = [];

  const resolveMember = msg.guild.members.resolve(search);
  if (resolveMember) return resolveMember;

  if (search.length < 3 || search.length > 16) {
    if (errorReply) msg.channel.send(`${msg.author}, sorry but I couldn't find the specified member :c`);
    return false;
  }

  let displayNameUpper;
  let memberUsername;
  let namesSimilarity;
  const usernameSearch = msg.guild.members.first(55).find((curMember) => {
    displayNameUpper = curMember.displayName.toUpperCase();
    memberUsername = `${curMember.user.username}#${curMember.user.discriminator}`;
    namesSimilarity = compareStrings(displayNameUpper, search);
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

  const embed = new Discord.RichEmbed()
    .setDescription(`There are some members with a similar name: \`\`\`${fSimilarMembers}\`\`\``)
    .setColor(11529967)
    .setThumbnail(msg.guild.me.user.displayAvatarURL);

  if (errorReply) msg.channel.send(`${msg.author}, sorry but I couldn't find the specified member :c`, { embed });
  return false;
}

/**
 * Find a member in a Discord message sent by a GuildMember.
 * @param {string} msg - A str intended to be a message sent from a Discord user,
 * we will search for the member here.
 * @param {number} argSeparator A number that represents where the message is separated
 * by a blank space
 * @param {boolean} errorReply Show or not a reply message if we didn't found a user.
 * @returns {object|boolean} Returns the same value as getMember(search, msg),
 * the Discord Member found or a false value.
 */
function findOneMember(msg, argSeparator, errorReply = true) {
  let possibleMember = msg.mentions.members.first();
  if (!possibleMember) {
    if (argSeparator === -1) return msg.reply('please mention a user or type a username/display name ^^');
    const singleArgument = msg.content.substring(argSeparator);
    possibleMember = getMember(singleArgument.toUpperCase(), msg, errorReply);
    if (!possibleMember) return false;
  }
  return possibleMember;
}

module.exports = { getMember, findOneMember, getRandomIntInclusive };
