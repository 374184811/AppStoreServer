/**
 * create data components object
 *
 */
var dt = module.exports = function() {
    console.log('create: function');
    return this;
};

/**
 * Initialize Variables
 *
 */
dt.initialize = function() {
	this.map = new Map();
};

dt.hashCacheKey = function(action,param) {

	var counter = 0;
	var hashString = action || "";

	for(var keys in param) {
		if (counter === 0) {
			hashString += '/';
		}else {
			counter += 1;
		}

		hashString += keys
		hashString += '/';
		hashString += param[keys];
	}

	// if (counter>=0) {
	// 	hashString += '/';
	// 	hashString += m.timestamp() + 3000;
	// }

	console.log('cacheKey. ',hashString);
	return hashString;
};

dt.startUpActionCache = function(hashCacheKey) {

	//console.log('hashCacheKey',hashCacheKey);
	// hashCacheKey = hashCacheKey || "";
	// var hashCacheVal = this.map.get(hashCacheKey);


	// if (hashCacheVal) {
	// 	var timestamp = hashCacheVal.timestamp;
	// 	if (hashCacheVal.timestamp>m.timestamp()) {
	// 		//console.log('ok');
	// 	}else{
	// 		hashCacheVal = null;
	// 	}
	// }

	return this.map.get(hashCacheKey);
};

dt.setHashCacheKey = function(hashCacheKey,hashCacheVal) {

	// if (this.map.get(hashCacheKey)) {
	// 	return this.map.get(hashCacheKey);
	// }else{
	// 	this.map.set(hashCacheKey,hashCacheVal);
	// }

	// var hashCacheValNew = hashCacheVal.length || 0;
	// var hashCacheValOld = this.map.get(hashCacheKey) || 0;

	// if (!hashCacheValOld) {
	// 	console.log('err_0. ',hashCacheValOld);
	// }

	// if (_.isEqual(hashCacheValNew,hashCacheValOld)) {
	// 	console.log('err_1. ',hashCacheValNew)
	// 	return hashCacheValOld;
	// }

	// if (hashCacheValOld&&hashCacheValNew===0) {
	// 	return hashCacheValOld;
	// }

	//hashCacheVal.timestamp = m.timestamp() + 10000;
	this.map.set(hashCacheKey,hashCacheVal);
	//console.log('e. ',this.map);
}

dt.refreshPeasInterface = function() {
	console.log('update finish');
}

dt.updateDateCountDown = function() {

	var countdown = m.calcTime();
	console.log('countdown. ',countdown);

	var interval = setInterval(function() {
		if (countdown<0) {
			clearInterval(interval);
			dt.refreshPeasInterface();
		}else{
			console.log(countdown-=1);
		}
	}, 1000);
}

dt.setAppsClassify = function(list) {
	this._list = list;

	//反序列化分类
	this._classifyArray = {};
	for(var i = 0; i<list.length; i++) {
		var item = list[i];
		this._classifyArray[item.name] = item.id;
	}

	//所有游戏分类
	this._classifyParent = [];
	for(var i = 0; i<list.length; i++) {
		var item = list[i];
		if (_.isEqual(item.parentId,0)) {
			this._classifyParent.push(item);
		}
	}

	// //所有应用分类
	// this._classifyAppArray = {};
	// for(var i = 0; i<list.length; i++) {
	// 	var item = list[i];
	// 	if (_.isEqual(item.type,'APP')&&_.isEqual(parentId,0)) {
	// 		this._classifyAppArray.push(item.id);
	// 	}
	// }
}

dt.getAppsClassify = function() {
	return this._list;
}

dt.getAppsClassifyId = function(tag) {
	if (_.isNumber(tag)) {
		return -1;
	}else{
		return this._classifyArray[tag] ? this._classifyArray[tag] : 0;
	}
}

dt.getClassifyParentArray = function() {
	return this._classifyParent;
}

dt.setData = function(data) {
	if (this._data) return;
	this._data = data;
}

dt.getData = function() {
	return this._data;
};


/**
 * 抓取广告数据
 * @returns {*}
 */
dt.adsinitialize = function() {
  this.adsIdx = 0;
  this.adsPage = 0;
  this.adsList = [];
  this.adsModel = {};
};

dt.setAdsAppsClassify = function(list) {
  this._adsList = list;
};

dt.getAdsAppsClassify = function() {
    return this._adsList;
};

dt.gotoGetAdsPeas = function() {

  truncateModel = function(model) {//清空对应表的数据
      var sqlTruncateAds = 'truncate ' + model;
      console.log('sqlTruncateAdsPeas . check it out. ',sqlTruncateAds);
      eval(model).getDatastore().sendNativeQuery(sqlTruncateAds, function(err, r){
          console.log('cb_tag1: The result of this query is shown came out. check it out:  ok');
      });
  };

  addtopeas = function(model,list) {//添加对应表数据
      var arr = dt.getAdsAppsClassify();
      while(list.length) {
          var item = list.pop();
          var date = m.timestamp();
          item.updatedAt = date;
          item.createdAt = date;
          item.ad = item.ad ? 1 : 0;
          item.classify = arr[self.adsIdx]['name'];

          // console.log("adsIdx. ",self.adsIdx," adsPage. ",self.adsPage, " packageName. ",item.packageName);

          eval(model).create(item).exec(function (err) {
              if (!err) return;
              console.log(err,'\n\n\n');
          });
      }

      console.log('list. ',list.length);
  };

  addtopeasprice = function(model,list,cback) {//添加对应包的价格数据
      var arr = dt.getAdsAppsClassify();
      var priceList = [];
      var i = list.length;

      console.log("adsIdx. ",self.adsIdx, " adsCpc. ",i);

      while(list.length) {
          //存储对应包的价格
          var item = list.pop();
          priceList.push(item);
          var obj = {};
          obj.packageName = item.packageName;
          obj.name = arr[self.adsIdx]['name'];
          obj.createdAt = (new Date()).format('yyyy-MM-dd hh:mm:ss');
          obj.adstype = arr[self.adsIdx].type.toLowerCase();
          obj.price = item.price;

          eval(model).create(obj).exec(function (err) {
              i--;
              if(list.length == i){
                  cback(err,priceList);
              }
          });
      }
  };

  var self = this;
  self.adsIdx = self.adsIdx || 0;
  self.adsPage = self.adsPage || 0;
  var subClassify = dt.getAdsAppsClassify();
  var model = 'adsapp';

  if (_.isUndefined(self.adsModel[model])) {
      truncateModel(model);
      truncateModel('adsprice');
      self.adsModel[model] = true;
  }
  if(subClassify.length < 1){
      console.log('subClassify length is : ',subClassify.length);
      return;
  }

  async.auto({
      one:function (cb) {
          var cpsParams = {
              "adstype":subClassify[self.adsIdx].type.toLowerCase(),
              "alias":subClassify[self.adsIdx].alias,
              "ip":'172.16.1.150',
              "phone_imei":'861374037347422',
              "mac_address":'00:12:56:5c:14:c6',
              "phone_model":'PROTRULY',
              "api_level":'23',
              "startNum":self.adsPage * 10,
              "count":10
          };

          io.con('api.wandoujia.com','/v1/adsCpc','get',cpsParams,function (err,adscpc) {
              if(adscpc.length){
                  addtopeasprice('adsprice',adscpc,function(err,adslist){
                      cb(err,adslist);
                  });
              } else {
                  cb(err,adscpc);
              }
          });
      },
      two:['one',function (resulte,cb) {
          var adsCpc = resulte.one || [];
          if(adsCpc.length){
              var arr = [];
              for(var k=0;k<adsCpc.length;k++){
                  arr.push(adsCpc[k]['packageName']);
              }

              var adsAppParams = {
                  "packageNames":arr.join(',')||'',//应用包名列表，逗号分隔必填参数
                  "ip":'172.16.1.150',//手机 ip 必填参数
                  "phone_imei":'861374037347422',//
                  "mac_address":'00:12:56:5c:14:c6',
                  "phone_model":'PROTRULY',
                  "api_level":'23',
                  /**
                   应用展示/下载位置 必填参数拼写规则：pos=open/id/位置类型
                   id 即是分配给合作伙伴的
                   id位置类型：由豌豆荚定义的四种位置类型。
                   replace：用豌豆荚的广告包替换合作方原有的包#如果是替包的方式，请务必填写此字段#。
                   list：用户有明确预期这个页面为应用分发页面。
                   unexpect：用户无预期此页面为应用分发页面。
                   precise：有目的性的广告，例如分类。
                   */
                  "pos":'open/baoqianli/precise'
              };

              io.con('api.wandoujia.com','/v1/adsApp','get',adsAppParams,function (err,adsapp) {
                  cb(err,adsapp);
              });
          } else {
              cb(null,[]);
          }
      }]
  },function (err, results) {
      if (err){
          console.log(err);
          return;
      }

      if(results['two'].length){
          self.adsList = results['two'].slice();
      }
      self.adsPage += 1;
      console.log("adsIdx. ",self.adsIdx," adsPage. ",self.adsPage," adsList. ",self.adsList.length);
      if (self.adsList.length) {
          self.adsList = m.changeApps(self.adsList);
          addtopeas(model,self.adsList);
      }

      if (self.adsPage>=5) {
          self.adsPage = 0;
          self.adsIdx += 1;
      }

      var adsTimeout = null;
      if(self.adsIdx < dt.getAdsAppsClassify().length){
          adsTimeout = setTimeout(dt.gotoGetAdsPeas,300);
      } else{
          dt.adsinitialize();
          console.log('adsTimeout closeed.');
          clearTimeout(adsTimeout);
      }
  });
};
