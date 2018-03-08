/**
 * @description :: userSelectLog 客户端搜索日志表
 * @author      :: This is Wang's holy crap.
 * @note        :: Who's ur daddy?
 */

module.exports = {
//  datastore: 'topic',
    attributes: {
        createdAt:false,
        updatedAt:false,
        phoneimei: {
            type: 'string'
        },
        controller: {
            type: 'string'
        },
        action: {
            type: 'string'
        },
        params: {
            type: 'string'
        },
        createtime: {
            type: 'string'
        }
    },
    createTable: function (tableName, next) {
        var createSql = "create table " + tableName + " like userselectlog";
        userSelectLog.getDatastore().sendNativeQuery(createSql, function (err, val) {
            return next(err, val);
        });
    },
    createLog: function (msg, next) {
        var tableName = "userselectlog" + ((new Date()).format("yyyyMM"));
        userSelectLog.getDatastore().sendNativeQuery("show TABLES like '"+tableName+"'",function (err,tb) {
            if(tb.rows.length>0){
                console.log(tableName+"表已存在");
                var keys = [], values = [];
                for (var key in msg) {
                    keys.push(key);
                    values.push("'" + msg[key] + "'");
                }

                var sql = "insert into " + tableName + "(" + keys.join(",") + ") values(" + values.join(",") + ")";
                console.log(sql);
                userSelectLog.getDatastore().sendNativeQuery(sql, next);
            }else{
                console.log("创建新表"+tableName);
                userSelectLog.createTable(tableName,function (err, table) {
                    var keys = [], values = [];
                    for (var key in msg) {
                        keys.push(key);
                        values.push("'" + msg[key] + "'");
                    }

                    var sql = "insert into " + tableName + "(" + keys.join(",") + ") values(" + values.join(",") + ")";
                    console.log(sql);
                    userSelectLog.getDatastore().sendNativeQuery(sql, next);
                });
            }
        });
    }
};
