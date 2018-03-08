/**
 * @description :: appcheckmsg 客户端需要更新的app检测的数据表
 * @author      :: This is Wang's holy crap.
 */

module.exports = {
    attributes: {
        createdAt:false,
        updatedAt:false,
        model: {//手机的model值model，packageName，fileMd5，versionCode，versionName，cerStrMd5
            type: 'string'
        },
        packageName: {//APk的包名
            type: 'string'
        },
        fileMd5: {//apk文件的Md5值
            type: 'string'
        },
        versionCode: {//app版本(Android标准)
            type: 'string'
        },
        versionName: {//apk的版本(用户可见)
            type: 'string'
        },
        cerStrMd5: {//apk的数字签名的MD5
            type: 'string'
        },
        selectcon: {//查询条件
            type: 'string'
        },
        createdat: {//数据创建时间
            type: 'string',
        },

    },
};
