/**
 * @description :: topic 专题栏目表
 * @author      :: This is Wang's holy crap.
 * @note        :: Who's ur daddy?
 */

module.exports = {
//  datastore: 'topic',
    attributes: {
        createdAt:false,
        updatedAt:false,
        name: {
           type: 'string'
        },
        icon: {
           type: 'string'
        },
        type: {
           type: 'number'
        },
        isshow: {
          type: 'number'
        }
    }
};
