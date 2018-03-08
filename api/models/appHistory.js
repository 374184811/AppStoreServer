/**
 *
 *
 * @description :: appHistory model/应用历史信息表
 * @author      :: This is Kun's holy crap.
 * @note        :: Who's ur daddy?
 */

module.exports = {
//  datastore: 'appcenter',
  attributes: {
    createdAt: {
      type: 'string',
    },
    updatedAt: {
      type: 'string',
    },
    packageName: {
      type: 'string',
    },
    appId: {
      type: 'number',
      columnType:'integer'
    },
    appType: {
      type: 'string'
    },
    categories: {
      type: 'string'
    },
    tag: {
      type: 'string'
    },
    bytes: {
      type: 'string'
    },
    downloadCount: {
      type: 'number'
    },
    installedCount: {
      type: 'string'
    },
    versionName: {
      type: 'string'
    },
    versionCode: {
      type: 'number',
      //columnType:'integer'
    },
    title: {
      type: 'string'
    },
    likesRate: {
      type: 'string'
    },
    changelog: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    icons: {
      type: 'json'
    },
    screenshots: {
      type: 'json'
    },
    downloadUrl: {
      type: 'string'
    },
    md5: {
      type: 'string'
    },
    permissions: {
      type: 'string'
    },
    developer: {
      type: 'string'
    },
    tagline: {
      type: 'string'
    },
    class1: {
      type: 'string'
    },
    class2: {
      type: 'string'
    },
  },

  createTable: function (tableName, next) {
    var createSql = "create table " + tableName + " like apphistory";
    appHistory.getDatastore().sendNativeQuery(createSql, function (err, val) {
     return next(err, val);
    });
  },
  createLog: function (msg, next) {
    var tableName = "apphistory_" + ((new Date()).format("yyyy_MM"));
    appHistory.getDatastore().sendNativeQuery("show TABLES like '"+tableName+"'",function (err,tb) {
      tb = tb || {};
      tb.rows = tb.rows || []; 
      if(tb.rows.length>0){
        console.log(tableName+"表已存在");
        var keys = [], values = [];
        for (var key in msg) {
          keys.push(key);
          values.push("'" + msg[key] + "'");
        }

        var sql = "insert into " + tableName + "(" + keys.join(",") + ") values(" + values.join(",") + ")";
        console.log(sql);
        appHistory.getDatastore().sendNativeQuery(sql, next);
      }else{
        appHistory.createTable(tableName,function (err, table) {
          var keys = [], values = [];
          console.log("创建新表"+tableName);
          for (var key in msg) {
            keys.push(key);
            values.push("'" + msg[key] + "'");
          }
          var sql = "insert into " + tableName + "(" + keys.join(",") + ") values(" + values.join(",") + ")";
          console.log(sql);
          appHistory.getDatastore().sendNativeQuery(sql, next);
        });
      }
    });
  },
  createTest: function (msg, next) {
    var _this = this;
    var tableName = "apphistory_" + ((new Date()).format("yyyy_MM"));
    this.getDatastore().sendNativeQuery("show TABLES like '"+tableName+"'",function (err,tb) {

      // if(tb.length>0){
      //   console.log("不创建表");
      //   var keys = [], values = [];
      //   console.log("系统");
      //   for (var key in msg) {
      //     keys.push(key);
      //     values.push("'" + msg[key] + "'");
      //   }

      //   var sql = "insert into " + tableName + "(" + keys.join(",") + ") values(" + values.join(",") + ")";
      //   console.log(sql);
      //   _this.getDatastore().sendNativeQuery(sql, next);

      // }else{
        _this.createTable(tableName,function (err, table) {
          var keys = [], values = [];
          console.log("系统");
          for (var key in msg) {
            keys.push(key);
            values.push("'" + msg[key] + "'");
          }

          var sql = "insert into " + tableName + "(" + keys.join(",") + ") values(" + values.join(",") + ")";
          console.log(sql);
          _this.getDatastore().sendNativeQuery(sql, next);
        });
      //}
    });
  },
};
