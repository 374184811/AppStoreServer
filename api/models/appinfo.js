/**
 * @description :: appinfo 应用商店信息表
 * @author      :: This is Wang's holy crap.
 * @note        :: Who's ur daddy?
 */

module.exports = {
//  datastore: 'topic',
    attributes: {
        name: {//app的名称
           type: 'string'
        },
        version: {//app 版本
           type: 'string'
        },
        changelog: {//版本更新的内容
           type: 'string'
        },
        icon: {//app 小图标
          type: 'string'
        },
        downloadurl: {//app下载链接
          type: 'string'
        },
        createdAt:{//记录创建时间
          type: 'string'
        },
        updatedAt:{//记录更新时间
          type: 'string'
        },
        platform: {//app 平台
          type: 'string'
        },
        size: {//app包大小
          type: 'number'
        },
        channel: {//app下载渠道
          type: 'string'
        },
        upgrade: {//是否强制更新
          type: 'number'
        }
    }
};
