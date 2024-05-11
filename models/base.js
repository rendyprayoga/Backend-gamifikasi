const dayjs = require('dayjs');
const omitBy = require('lodash/omitBy');
const { Model, Op } = require('sequelize');

class Base extends Model {
  static searchable = [];

  /**
   * Parse request query to Sequelize where option.
   *
   * @param {Object} query Request query.
   * @returns {Object}
   */
  static parseWhereQuery(query) {
    const where = omitBy(query, (value, key) => key.startsWith('_'));

    for (const [key, value] of Object.entries(where)) {
      switch (key) {
        case 'createdAt':
        case 'updatedAt':
          const from = dayjs(value)
            .startOf('day')
            .format('YYYY-MM-DD HH:mm:ss');
          const to = dayjs(value).endOf('day').format('YYYY-MM-DD HH:mm:ss');

          where[key] = { [Op.between]: [from, to] };
          break;
      }

      if (Array.isArray(value)) {
        where[key] = { [Op.or]: value };
      } else if (typeof value === 'object') {
        where[key] = Object.entries(value).reduce((result, [key, value]) => {
          switch (key) {
            case 'ne':
              result[Op.ne] = value;
              break;
          }

          return result;
        }, {});
      }
    }

    if (query._search) {
      const keyword = query._search.includes('*')
        ? query._search.replace(/\*/g, '%')
        : `%${query._search}%`;

      where[Op.or] = this.searchable.map((field) => ({
        [field]: { [Op.like]: keyword },
      }));
    }

    return where;
  }

  /**
   * Find all with pagination.
   *
   * @param {Object} query Query string from client side.
   * @param {Object} options Sequelize query options.
   * @returns {Object}
   */
  static async findAndPaginateAll(query, options = {}) {
    const page = Math.abs(query._page) || 1;
    const limit = Math.abs(query._limit) || 10;
    const order = query._order || [['id', 'desc']];
    const where = this.parseWhereQuery(query);

    const result = await this.findAndCountAll({
      where,
      order,
      offset: limit * (page - 1),
      limit,
      distinct: true,
      ...options,
    });

    return {
      data: result.rows,
      meta: {
        total: result.count,
        currentPage: page,
        lastPage: Math.ceil(result.count / limit),
      },
    };
  }

  /**
   * Find all from query parameters.
   *
   * @param {Object} query Query string from client side.
   * @param {Object} options Sequelize query options.
   * @returns {Object}
   */
  static async findAllFromQuery(query, options = {}) {
    const order = query._order || [['id', 'desc']];
    const where = this.parseWhereQuery(query);
    const result = await this.findAll({ where, order, ...options });

    return result;
  }
}

module.exports = Base;
