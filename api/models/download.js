/**
 * @description :: download 应用历史下载信息表
 * @author      :: This is Wang's holy crap.
 * @note        :: Who's ur daddy?
 */

module.exports = {
//  datastore: 'topic',
    attributes: {
        createdAt:false,
        updatedAt:false,
        packagename: {//应用包名
           type: 'string'
        },
        icon: {//应用icon图
           type: 'string'
        },
        downloadCount: {//应用下载数量
           type: 'number',
           columnType:'integer'
        },
        title: {//应用名称
          type: 'string'
        },
        updatedDate: {//应用更新时间
          type: 'string'
        }
    }
};
