/**
 * @description :: authority 应用设置权限表
 * @author      :: This is Wang's holy crap.
 * @note        :: Who's ur daddy?
 */

module.exports = {
//  datastore: 'topic',
    attributes: {
        createdAt:false,
        updatedAt:false,
        imei: {
           type: 'string'
        },
        authmsg: {
           type: 'string'
        },
        set: {
           type: 'number',
           columnType:'integer'
        }
    }
};
