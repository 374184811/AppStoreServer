
module.exports = {
  attributes: {
    phone_imei: {//手机的imei值
      type: 'string',
    },
    phone_model: {//手机的Model值
      type: 'string',
    },
    classify:{//广告应用的所属分类
      type: 'string',
    },
    packageName: {//广告应用的包名
      type: 'string',
    },
    title: {//广告应用的名称
      type: 'string',
    },
    isinstallfinish: {//广告应用是否安装完成，0-没有，1-完成
      type: 'number',
    },
    isdownloadfinish: {//广告应用是否下载结束，0-没有，1-完成
      type: 'number',
    },
    isdownloadstart: {//广告应用是否下载开始，0-没有，1-开始
      type: 'number',
    },
    isshow: {//广告应用是否以及展示，0-没有，1-展示
      type: 'number',
    },
    createdAt: {
      type: 'string',
    },
  },
  createTable: function (tableName, next) {
      var createSql = "create table " + tableName + " like adsappstatistics";
      adsappstatistics.getDatastore().sendNativeQuery("show TABLES like '"+tableName+"'",function (err,tb) {
          if(!tb.rows.length > 0){
              adsappstatistics.getDatastore().sendNativeQuery(createSql, next);
          }else{
              next();
          }
      });
  },
};
