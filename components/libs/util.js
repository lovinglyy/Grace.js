
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

  for (let i = 0; i < smallerLength + 1; i++) { if (str1[i] === str2[i] && str1[i] !== ' ' && str2[i] !== ' ') equalChars++; }
  return equalChars * 2 / (str1.length + str2.length);
}

/**
 * Returns an approximate value about how one string is comparable
 * to another, by comparing random chars in the string.
 * It's parameters are the same as the normal compareStrings.
 * @returns {number} A imprecise number of how equal the strings are,
 * for small strings, it will repeat sufficient times to get a more precise
 * result.
 */
function randomStringCompare(str1, str2) {
  if (str1[0] !== str2[0]) return 0;

  let greaterLength = str1.length;
  let smallerLength = str2.length;

  if (str2.length > greaterLength) {
    greaterLength = str2.length;
    smallerLength = str1.length;
  }

  if (str1 === str2) return 1;

  if (greaterLength > 25 || str1 !== str2) return 0;
  let equalChars = 0;

  for (let i = 0; i < ~~(smallerLength / 2); i++) {
    const rndChar = ~~(Math.random() * smallerLength - 1);
    if (str1[rndChar] === str2[rndChar] && str1[rndChar + 1] === str2[rndChar + 1]) equalChars += 2;
  }
  return equalChars * 2 / ~~((str1.length + str2.length));
}

/**
 * Get a GuildMember in a message by iterating with members in a guild.
 * First it will see if the username match, then if the displayName does.
 * After that it stores the member displayName in a array with a similiarity
 * value between the member that is current iterating and the one that is being searched.
 * For performance, it doesn't do one iteration for usernames, another for display names and another to
 * check similarity, it's only one so it's not certain about which one will be found first.
 * @param {string} search - A string that we will search for a member in it.
 * @param {string} msg Need to be a Discord message, it's used to send outputs for the user and
 * get the guild.
 * @param {boolean} errorReply Show or not a reply message if we didn't found a user.
 * @returns {object|boolean} Return the Discord Member found or a false value.
 */
function getMember(search, msg, errorReply) {
  search = search.toUpperCase(); // case insensitive
  const similarMembers = [];

  if (msg.guild.members.get(search)) return msg.guild.members.get(search);

  if (search.length < 3 || search.length > 16) {
    if (errorReply) msg.channel.send(`${msg.author}, sorry but I couldn't find the specified member :c`);
    return false;
  }

  const usernameSearch = msg.guild.members.first(55).find((curMember) => {
    const displayNameUpperCase = curMember.displayName.toUpperCase();

    if (`${curMember.user.username.toUpperCase()}#${curMember.user.discriminator}` === search) return true;
    if (displayNameUpperCase === search) return true;

    const namesSimilarity = compareStrings(displayNameUpperCase, search);
    if (namesSimilarity > 0.32) {
      similarMembers.push([namesSimilarity, `${curMember.displayName} (${curMember.user.username}#${curMember.user.discriminator})`]);
    }
  }, search);
  if (!usernameSearch) {
    similarMembers.sort((a, b) => b[0] - a[0]);

    let fSimilarMembers = '';
    for (let i = 0; i < 6; i++) { if (similarMembers[i]) fSimilarMembers += `${similarMembers[i][1]}\n`; }

    let embed = null;
    if (fSimilarMembers) {
      embed = {
        description: `There are some members with a similar name: \`\`\`${fSimilarMembers}\`\`\``,
        color: 11529967,
        thumbnail: {
          url: msg.guild.me.user.displayAvatarURL,
        },
      };
    }

    if (errorReply) msg.channel.send(`${msg.author}, sorry but I couldn't find the specified member :c`, { embed });
    return false;
  }
  return usernameSearch;
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
    possibleMember = getMember(singleArgument, msg, errorReply);
    if (!possibleMember) return false;
  }
  return possibleMember;
}

async function youtubeSearch(google, youtubeAPI, search) {
  const youtube = google.youtube({  version: 'v3',  auth: youtubeAPI });
  return await youtube.search.list({
      part: 'id,snippet',
      q: search
  })
  .then(res => {
    return res.data;
  })
  .catch(error => {
    return false;
  });
}

module.exports = { getMember, findOneMember, youtubeSearch  };
