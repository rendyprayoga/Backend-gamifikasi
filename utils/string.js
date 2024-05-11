module.exports = {
  /**
   * Serialize any value to string.
   *
   * @param {*} value
   * @returns {[String, String]} Type and serialized value.
   */
  serialize(value) {
    const type = typeof value;

    switch (type) {
      case 'object':
        value = JSON.stringify(value);
        break;
    }

    return [type, value];
  },

  /**
   * Unserialize a string.
   *
   * @param {String} type
   * @param {String} value
   * @returns {*}
   */
  unserialize(type, value) {
    switch (type) {
      case 'number':
        return Number(value);
      case 'object':
        return JSON.parse(value);
    }

    return value;
  },
};
