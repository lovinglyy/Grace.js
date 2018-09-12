class Util {
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
  * are in both words) divided by the char amount of both strings,
  * or 0/1 in some comparation cases.
  */
  static compareStrings(str1, str2) {
    if (str1 === str2) return 1;
    if (str1[0] !== str2[0]) return 0;

    let greaterLength = str1.length;
    let smallerLength = str2.length;

    if (str2.length > greaterLength) {
      greaterLength = str2.length;
      smallerLength = str1.length;
    }

    if (greaterLength > 16) return 0;

    let equalChars = 0;
    for (let i = 0; i < smallerLength + 1; i += 1) {
      if (str1[i] === str2[i] && str1[i] !== ' ' && str2[i] !== ' ') equalChars += 1;
    }
    return equalChars * 2 / (str1.length + str2.length);
  }
}

module.exports = Util;
