const objs = {};

class Cooldown {
  constructor(options) {
    this.key = options.key;
    this.obj = options.obj;
  }

  /**
   * Set the cooldown.
   * @param {*} value Value that the cooldown will store.
   * @param {number} delay Cooldown time in seconds.
   */
  set(value, delay) {
    if (!objs[this.obj]) objs[this.obj] = {};
    objs[this.obj][this.key] = value;
    setTimeout(() => delete objs[this.obj][this.key], delay * 1000);
  }

  /**
   * Get the value stored in the cooldown.
   */
  get() {
    if (!objs[this.obj]) return false;
    return objs[this.obj][this.key];
  }

  /**
   * Check if the specified key exists.
   */
  exists() {
    if (!objs[this.obj]) return false;
    return Object.hasOwnProperty.call(objs[this.obj], this.key);
  }
}

module.exports = Cooldown;
