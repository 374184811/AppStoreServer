var _l = require('../services/lodash');
module.exports = {
    /**
     * 广告应用展示
     * Statistics/adsShow
     * @param req
     * @param res
     * @param title 应用名称
     * @param packageName 应用包名
     * @param classify 应用所属分类
     * @param phone_imei 手机imei的值
     * @param phone_model 手机model的值
     */
    adsShow:function (req,res) {
        console.log(req.ip,req.path);

        var allParams = req.allParams();
        var obj = {};
        obj.phone_model = allParams.phone_model;
        obj.phone_imei = allParams.phone_imei;
        obj.classify = allParams.classify;
        obj.packageName = allParams.packageName;
        obj.title = allParams.title;
        obj.isshow = 1;
        obj.createdAt = (new Date()).format('yyyy-MM-dd hh:mm:ss');

        var keys = [], values = [];
        for (var key in obj) {
            keys.push(key);
            values.push("'" + obj[key] + "'");
        }
        var tableName = "adsappstatistics" + ((new Date()).format("yyyy"));
        var sql = "INSERT INTO " + tableName + "(" + keys.join(",") + ") VALUES (" + values.join(",") + ")";
        console.log(sql);

        adsappstatistics.getDatastore().sendNativeQuery(sql, function (err, ads) {
            if (err){
                console.log(err);
                return;
            }

            return res.json({
                code: 200,
                msg: '展示数据存储'
            });
        });
    },
  /**
   * 广告应用安装结束
   * Statistics/adsInstallFinish
   * @param req
   * @param res
   * @param title 应用名称
   * @param packageName 应用包名
   * @param classify 应用所属分类
   * @param phone_imei 手机imei的值
   * @param phone_model 手机model的值
   */
  adsInstallFinish:function (req,res) {
      console.log(req.ip,req.path);

      var allParams = req.allParams();
      var obj = {};
      obj.phone_model = allParams.phone_model;
      obj.phone_imei = allParams.phone_imei;
      obj.classify = allParams.classify;
      obj.packageName = allParams.packageName;
      obj.title = allParams.title;
      obj.isinstallfinish = 1;
      obj.createdAt = (new Date()).format('yyyy-MM-dd hh:mm:ss');

      var keys = [], values = [];
      for (var key in obj) {
          keys.push(key);
          values.push("'" + obj[key] + "'");
      }
      var tableName = "adsappstatistics" + ((new Date()).format("yyyy"));
      var sql = "INSERT INTO " + tableName + "(" + keys.join(",") + ") VALUES (" + values.join(",") + ")";
      console.log(sql);

      adsappstatistics.getDatastore().sendNativeQuery(sql, function (err, ads) {
          if (err){
              console.log(err);
              return;
          }

          return res.json({
              code: 200,
              msg: '展示数据存储'
          });
      });
  },
  /**
   * 广告应用下载结束
   * Statistics/adsDownloadFinish
   * @param req
   * @param res
   * @param title 应用名称
   * @param packageName 应用包名
   * @param classify 应用所属分类
   * @param phone_imei 手机imei的值
   * @param phone_model 手机model的值
   */
  adsDownloadFinish:function (req,res) {
      console.log(req.ip,req.path);

      var allParams = req.allParams();
      var obj = {};
      obj.phone_model = allParams.phone_model;
      obj.phone_imei = allParams.phone_imei;
      obj.classify = allParams.classify;
      obj.packageName = allParams.packageName;
      obj.title = allParams.title;
      obj.isdownloadfinish = 1;
      obj.createdAt = (new Date()).format('yyyy-MM-dd hh:mm:ss');

      var keys = [], values = [];
      for (var key in obj) {
          keys.push(key);
          values.push("'" + obj[key] + "'");
      }
      var tableName = "adsappstatistics" + ((new Date()).format("yyyy"));
      var sql = "INSERT INTO " + tableName + "(" + keys.join(",") + ") VALUES (" + values.join(",") + ")";
      console.log(sql);

      adsappstatistics.getDatastore().sendNativeQuery(sql, function (err, ads) {
          if (err){
              console.log(err);
              return;
          }

          return res.json({
              code: 200,
              msg: '展示数据存储'
          });
      });
  },
  /**
   * 广告应用开始下载
   * Statistics/adsDownloadStart
   * @param req
   * @param res
   * @param title 应用名称
   * @param packageName 应用包名
   * @param classify 应用所属分类
   * @param phone_imei 手机imei的值
   * @param phone_model 手机model的值
   */
  adsDownloadStart:function (req,res) {
      console.log(req.ip,req.path);

      var allParams = req.allParams();
      var obj = {};
      obj.phone_model = allParams.phone_model;
      obj.phone_imei = allParams.phone_imei;
      obj.classify = allParams.classify;
      obj.packageName = allParams.packageName;
      obj.title = allParams.title;
      obj.isdownloadstart = 1;
      obj.createdAt = (new Date()).format('yyyy-MM-dd hh:mm:ss');

      var keys = [], values = [];
      for (var key in obj) {
          keys.push(key);
          values.push("'" + obj[key] + "'");
      }
      var tableName = "adsappstatistics" + ((new Date()).format("yyyy"));
      var sql = "INSERT INTO " + tableName + "(" + keys.join(",") + ") VALUES (" + values.join(",") + ")";
      console.log(sql);

      adsappstatistics.getDatastore().sendNativeQuery(sql, function (err, ads) {
          if (err){
              console.log(err);
              return;
          }

          return res.json({
              code: 200,
              msg: '展示数据存储'
          });
      });
  },
  /**
   * 广告应用价格统计导出
   * Statistics/adsPriceStatis
   * @param req
   * @param res
   * @param selecttime  导出数据的时间，默认返回当月数据
   */
  adsPriceStatis:function(req,res){
      console.log(req.ip,req.path);

      var selectTime = req.param('selecttime')|| (new Date()).format('yyyy-MM');
      var tableName = "adsappstatistics" + ((new Date()).format("yyyy"));
      async.auto({
          one:function (callback) {//广告应用统计价格按照传的时间
              var sql = "SELECT COUNT(b.packageName) AS count,SUM(a.price) AS price from "+ tableName+" as b INNER JOIN adsprice as a ";
              sql += "on a.`name` = b.classify AND a.packageName = b.packageName AND b.isshow=1 AND b.createdAt LIKE '"+selectTime+"%'";
              sql += " UNION ALL ";

              sql += "SELECT COUNT(b.packageName) AS count,SUM(a.price) AS price from "+ tableName+" as b INNER JOIN adsprice as a ";
              sql += "on a.`name` = b.classify AND a.packageName = b.packageName AND b.isinstallfinish=1 AND b.createdAt LIKE '"+selectTime+"%'";
              sql += " UNION ALL ";

              sql += "SELECT COUNT(b.packageName) AS count,SUM(a.price) AS price from "+ tableName+" as b INNER JOIN adsprice as a ";
              sql += "on a.`name` = b.classify AND a.packageName = b.packageName AND b.isdownloadstart=1 AND b.createdAt LIKE '"+selectTime+"%'";
              sql += " UNION ALL ";

              sql += "SELECT COUNT(b.packageName) AS count,SUM(a.price) AS price from "+ tableName+" as b INNER JOIN adsprice as a ";
              sql += "on a.`name` = b.classify AND a.packageName = b.packageName AND b.isdownloadfinish=1 AND b.createdAt LIKE '"+selectTime+"%'";

              console.log(sql);
              adsappstatistics.getDatastore().sendNativeQuery(sql, function (err, adsstatistics) {
                  callback(err, adsstatistics);
              });
          }
      },function (err, results) {
          if (err){
              console.log(err);
              return;
          }
          var data = [],obj = {};
          obj.count = 0;
          obj.price = 0.0;
          obj[''] = '总计';

          var one = results['one']['rows']||[];
          for(var i=0;i<one.length;i++){
              if(i==0){
                  one[i][''] = '展示';
              }
              if(i==1){
                  one[i][''] = '安装完成';
              }
              if(i==2){
                  one[i][''] = '下载开始';
              }
              if(i==3){
                  one[i][''] = '下载结束';
              }

              obj.count += one[i]['count']||0;
              obj.price += one[i]['price']||0.0;
          }
          data.push(obj);
          data = _l.concat(one,data);
          // console.log(data);
          common.exportExcelList(res,'adsprice_statistics.xlsx',data);
      });
  },
};
