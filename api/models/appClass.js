/**
 *
 *
 * @description :: appClass model/应用分类表
 * @author      :: This is Kun's holy crap.
 * @note        :: Who's ur daddy?
 */

module.exports = {
//  datastore: 'darlingDev',
  attributes: {
    category: {
      type: 'string',
      unique: true,
      required: true
    },
    alias: {
      type: 'string',
      unique: true,
      required: true
    },
    type: {
      type: 'string',
      unique: true,
      required: true
    },
    icon: {
      type: 'string',
      unique: true,
      required: true
    },
    subcategories: {
      type: 'string',
      unique: true,
      required: true
    },
    subcategoryNum: {
      type: 'number',
      unique: true,
      required: true
    },
  }
};