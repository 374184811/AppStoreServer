/**
 *
 *
 * @description :: admin login model/登录
 * @author      :: This is Kun's holy crap.
 * @note        :: Who's ur daddy?
 */

module.exports = {
//  datastore: 'darlingDev',
  attributes: {
  	createdAt: {
      type: 'string',
    },
    updatedAt: {
      type: 'string',
    },
    username: {
      type: 'string'
    },
    password: {
      type: 'string'
    },
  }
};