/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = function(cb) {

	// 初始化
	dt.initialize();
  dt.adsinitialize();

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)


  var uncaughtHandler = function(e) {
	    return;
	};
	process.on('uncaughtException', uncaughtHandler);

  validity.find().exec(function (err, list) {
      if (err) return;
      while(list.length) {
          e = list.pop();
          // console.log(e.key);
          dt.setHashCacheKey(e.key,e.val);
      }
  });

  var sqlQueryAppsClassify = 'select id,name,parentId,type from appclassify';
  console.log('sqlQueryAppsClassify. check it out. ',sqlQueryAppsClassify);
  appClassify.getDatastore().sendNativeQuery(sqlQueryAppsClassify, function(err, r){
      if (err) return;
      dt.setAppsClassify(r.rows);
      console.log('cb_tag1: The result of this query is shown came out. check it out:  ',r.rows.length);
  });

  //准备广告分类数据
  var sqlQueryAppsClassify2 = 'SELECT id,name,type,alias FROM appclassify WHERE parentId=0';
  console.log('sqlQueryAppsClassify2. check it out. ',sqlQueryAppsClassify2);
  sails.getDatastore().sendNativeQuery(sqlQueryAppsClassify2, function(err, r){
      if (err) return;
      dt.setAdsAppsClassify(r.rows);

      console.log('cb_tag1: The result of this query is shown came out. check it out:  ',r.rows.length);
  });

  return cb();

};
