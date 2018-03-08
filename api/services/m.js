
/**
 *	类成员管理
 *	
 *	按照类结构建立成员函数
 *	js文件表示类，m表示类的成员变量，
 *	调用格式 m.fn，表示类的成员函数。
 *	
 */


const reduce = Function.bind.call(Function.call, Array.prototype.reduce);
const isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable);
const concat = Function.bind.call(Function.call, Array.prototype.concat);


var ownKeys = function(obj) {
    var keys = [];
    for (var key in obj) {
        if (objectHasOwnProperty(obj, key)) {
            keys.push(key);
        }
    }
    return keys;
};

var objectHasOwnProperty = function(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
};

const keys = ownKeys;

if (!Object.values) {
    Object.values = function values(O) {
        return reduce(keys(O), (v, k) => concat(v, typeof k === 'string' && isEnumerable(O, k) ? [O[k]] : []), []);
    };
}

if (!Object.entries) {
    Object.entries = function entries(O) {
        return reduce(keys(O), (e, k) => concat(e, typeof k === 'string' && isEnumerable(O, k) ? [[k, O[k]]] : []), []);
    };
}


var m = {

    insertSql: function(map,tbName) {

        //console.log('key: check it out: ',map);
        if (!map.size || !map) {
            return '';
        }

        //special value
        var toString = function(iter) {
            return '"' + (iterVal.next().value).toString().replace(/"/g, '\\"') + '"';
        };
        var insertSql = '',i;
        var iterKey = map.keys();
        var iterVal = map.values();

        i = map.size;
        var k = '',v = '';

        insertSql += 'INSERT INTO ' + tbName + ' ' + '(';
        while(i--) k = i>0 ? k += iterKey.next().value + ',': k += iterKey.next().value ;

        insertSql += ' ' + k;

        i = map.size;
        while(i--) v = i>0 ? v +=  utils.escapeQuotes(iterVal) + ',' : v += utils.escapeQuotes(iterVal);
           
        insertSql += ') VALUES (' + v + ')';

        //console.log('insertSql: check it out: ',insertSql);
        return insertSql;
    },

    timestamp: function() {
        return (new Date()).getTime()
    },

    format1: function(param) {
        return (new Date()).format("yyyy-M-d h:m:s.S");
    },

    format2: function(param) {
        return (new Date()).format("yyyy-MM-dd hh:mm:ss.S");
    },

    calcTime: function() {
        var today = new Date();
        var todaySeconds = 86400;
        var nowHours = today.getHours();
        var nowMinutes = today.getMinutes();
        var nowSeconds = today.getSeconds();

        var nowSeconds = nowSeconds;
        nowSeconds += nowMinutes * 60;
        nowSeconds += nowHours * 60 * 60;
        return todaySeconds - nowSeconds;
    },

    getApps: function(list) {

        var self = this;
    	var appsArray = [];
    	for(var i = 0; i<list.length; i++) {

            var newObj = {};
    		var dataObj = list[i];

            if (!parseInt(dataObj.unshelve)) {

                newObj.protruly = true;
                newObj.unshelve = dataObj.unshelve || 0;
                newObj.installedCountStr = dataObj.installedCountStr || "1万";
                newObj.downloadFinishUrl = dataObj.downloadFinishUrl || null;
                newObj.installedCount = dataObj.installedCount || 0;
                newObj.downloadStartUrl = dataObj.downloadStartUrl || null;
                newObj.downloadCountStr = dataObj.downloadCountStr || "1万";
                newObj.downloadCount = dataObj.downloadCount || 0;
                newObj.updatedDate = dataObj.updatedDate || self.timestamp();
                newObj.publishDate = dataObj.publishDate || self.timestamp();
                newObj.packageName = dataObj.packageName || "";
                newObj.detailsParam = dataObj.detailsParam || "";
                newObj.screenshots = dataObj.screenshots || {};
                newObj.screenshots.normal = dataObj.screenshots.normal || [];
                newObj.screenshots.small = dataObj.screenshots.small || [];
                newObj.itemStatus = dataObj.itemStatus || 0;
                newObj.description = dataObj.description || "";
                newObj.likesRate = dataObj.likesRate || 0;
                newObj.categories = JSON.parse(dataObj.categories) || [];
                newObj.developer = dataObj.developer || {};

                //续补 start
                newObj.developer.verified = newObj.developer.verified || 0;
                newObj.developer.website = newObj.developer.website || "";
                newObj.developer.weibo = newObj.developer.weibo || "";
                newObj.developer.intro = newObj.developer.intro || "";
                newObj.developer.email = newObj.developer.email  || "";
                newObj.developer.urls = newObj.developer.urls  || "";
                newObj.developer.name = newObj.developer.name  || "";
                newObj.developer.id = newObj.developer.id  || -1;
                //续补 end

                newObj.changelog = dataObj.changelog || "";
                newObj.imprUrl = dataObj.imprUrl || null;
                newObj.appType = dataObj.appType || "";
                newObj.trusted = dataObj.trusted || "";
                newObj.tagline = dataObj.tagline || "";
                newObj.title = dataObj.title || "";
                newObj.icons = dataObj.icons || [];
                newObj.tags = dataObj.tags || [];
                newObj.start = dataObj.start || {};

                //续补 start
                newObj.start.weeklyStr = newObj.start.weeklyStr || "1万";
                //续补 end

                newObj.apks = dataObj.apks || [];

                //续补 start
                newObj.apks[0] = newObj.apks[0] || {};
                newObj.apks[0].bytes = dataObj.bytes || 0;


                newObj.apks[0].targetSdkVersion = newObj.apks[0].targetSdkVersion || 0;
                newObj.apks[0].pubKeySignature = newObj.apks[0].pubKeySignature || "";
                newObj.apks[0].securityStatus = newObj.apks[0].securityStatus || "UNKNOWN";
                newObj.apks[0].minSdkVersion = newObj.apks[0].minSdkVersion || 0;
                newObj.apks[0].maxSdkVersion = newObj.apks[0].maxSdkVersion || 0;
                newObj.apks[0].versionName = newObj.apks[0].versionName || "0.0.0";
                newObj.apks[0].versionCode = newObj.apks[0].versionCode || 0;

                newObj.apks[0].downloadUrl = newObj.apks[0].downloadUrl || {};
                newObj.apks[0].downloadUrl.url =  dataObj.downloadUrl || "";
                newObj.apks[0].downloadUrl.market = newObj.apks[0].downloadUrl.market || "";
               
                newObj.apks[0].permissions = newObj.apks[0].permissions || [];
                newObj.apks[0].signature = newObj.apks[0].signature || "";
                newObj.apks[0].paidType = newObj.apks[0].paidType || "NONE";
                newObj.apks[0].verified = newObj.apks[0].verified || 0;
                newObj.apks[0].superior = newObj.apks[0].superior || 0;
                newObj.apks[0].official = newObj.apks[0].official || 0;
                newObj.apks[0].language = newObj.apks[0].language || [];
                newObj.apks[0].creation = newObj.apks[0].creation || self.timestamp();
                newObj.apks[0].adsType = newObj.apks[0].adsType || "NONE";
                
                newObj.apks[0].md5 = newObj.apks[0].md5 || "";
                 //续补 end

                appsArray.push(newObj);

            }
    	}

    	return appsArray;
    },

    changeApps: function(list) {

        var self = this;
        for(var i = 0; i<list.length; i++) {

            list[i].installedCountStr = list[i].installedCountStr || "1万";
            list[i].downloadFinishUrl = list[i].downloadFinishUrl || 0;
            list[i].installFinishUrl = list[i].installFinishUrl || "";
            list[i].installedCount = list[i].installedCount || 0;
            list[i].downloadStartUrl = list[i].downloadStartUrl || 0;
            list[i].downloadCountStr = list[i].downloadCountStr || "1万";
            list[i].downloadCount = list[i].downloadCount || 0;
            list[i].updatedDate = list[i].updatedDate || self.timestamp();
            list[i].publishDate = list[i].publishDate || self.timestamp();
            list[i].packageName = list[i].packageName || "";
            list[i].detailParam = list[i].detailParam || "";
            list[i].screenshots = list[i].screenshots || {};
            list[i].screenshots.normal = list[i].screenshots.normal || [];
            list[i].screenshots.small = list[i].screenshots.small || [];
            list[i].itemStatus = list[i].itemStatus || 0;
            list[i].description = list[i].description || "";
            list[i].likesRate = list[i].likesRate || 0;
            list[i].categories = list[i].categories || [];
            list[i].developer = list[i].developer || {};

            //续补 start
            list[i].developer.verified = list[i].developer.verified || 0;
            list[i].developer.website = list[i].developer.website || "";
            list[i].developer.weibo = list[i].developer.weibo || "";
            list[i].developer.intro = list[i].developer.intro || "";
            list[i].developer.email = list[i].developer.email  || "";
            list[i].developer.urls = list[i].developer.urls  || "";
            list[i].developer.name = list[i].developer.name  || "";
            list[i].developer.id = list[i].developer.id  || -1;
            //续补 end

            list[i].changelog = list[i].changelog || "";
            
            list[i].imprUrl = list[i].imprUrl || "";
            list[i].appType = list[i].appType || "";
            list[i].trusted = list[i].trusted || 0;
            list[i].tagline = list[i].tagline || "";
            list[i].title = list[i].title || "";
            list[i].icons = list[i].icons || [];
            list[i].tags = list[i].tags || [];
            list[i].start = list[i].start || {};

            //续补 start
            list[i].start.weeklyStr = list[i].start.weeklyStr || "1万";
            //续补 end

            list[i].apks = list[i].apks || [];

            //续补 start
            list[i].apks[0] = list[i].apks[0] || {};
            list[i].apks[0].targetSdkVersion = list[i].apks[0].targetSdkVersion || 0;
            list[i].apks[0].pubKeySignature = list[i].apks[0].pubKeySignature || "";
            list[i].apks[0].securityStatus = list[i].apks[0].securityStatus || "UNKNOWN";
            list[i].apks[0].minSdkVersion = list[i].apks[0].minSdkVersion || 0;
            list[i].apks[0].maxSdkVersion = list[i].apks[0].maxSdkVersion || 0;
            list[i].apks[0].versionName = list[i].apks[0].versionName || "0.0.0";
            list[i].apks[0].versionCode = list[i].apks[0].versionCode || 0;

            list[i].apks[0].downloadUrl = list[i].apks[0].downloadUrl || {};
            list[i].apks[0].downloadUrl.url = list[i].apks[0].downloadUrl.url || "";
            list[i].apks[0].downloadUrl.market = list[i].apks[0].downloadUrl.market || "";
           
            list[i].apks[0].permissions = list[i].apks[0].permissions || [];
            list[i].apks[0].signature = list[i].apks[0].signature || "";
            list[i].apks[0].paidType = list[i].apks[0].paidType || "NONE";
            list[i].apks[0].verified = list[i].apks[0].verified || 0;
            list[i].apks[0].superior = list[i].apks[0].superior || 0;
            list[i].apks[0].official = list[i].apks[0].official || 0;
            list[i].apks[0].language = list[i].apks[0].language || [];
            list[i].apks[0].creation = list[i].apks[0].creation || self.timestamp();
            list[i].apks[0].adsType = list[i].apks[0].adsType || "NONE";
            list[i].apks[0].bytes = list[i].apks[0].bytes || 0;
            list[i].apks[0].md5 = list[i].apks[0].md5 || "";
            //续补 end
        }

        return list;
    },

    changeData: function(list) {

        var self = this;
        for(var i = 0; i<list.length; i++) {
            delete list[i].id;
            // delete list[i].updatedAt;
            // delete list[i].createdAt;
            // delete list[i].detailParam;
            list[i].installedCountStr = list[i].installedCountStr || "1万";
            list[i].downloadFinishUrl = list[i].downloadFinishUrl || 0;
            list[i].installFinishUrl = list[i].installFinishUrl || "";
            list[i].installedCount = list[i].installedCount || 0;
            list[i].downloadStartUrl = list[i].downloadStartUrl || 0;
            list[i].downloadCountStr = list[i].downloadCountStr || "1万";
            list[i].downloadCount = parseInt(list[i].downloadCount) || 0;
            list[i].updatedDate = list[i].updatedDate || self.timestamp();
            list[i].publishDate = list[i].publishDate || self.timestamp();
            list[i].packageName = list[i].packageName || "";
            list[i].detailParam = list[i].detailParam || "";
            list[i].screenshots = list[i].screenshots || {};
            list[i].itemStatus = list[i].itemStatus || 0;
            list[i].description = list[i].description || "";
            list[i].likesRate = list[i].likesRate || 0;
            list[i].categories = list[i].categories || [];
            list[i].developer = list[i].developer || {};
            list[i].changelog = list[i].changelog || "";
            list[i].imprUrl = list[i].imprUrl || "";
            list[i].appType = list[i].appType || "";
            list[i].trusted = list[i].trusted || 0;
            list[i].tagline = list[i].tagline || "";
            list[i].title = list[i].title || "";
            list[i].icons = list[i].icons || [];
            list[i].tags = list[i].tags || [];
            list[i].start = list[i].start || {};
        }

        return list;
    },

    parseApps: function(list) {

        var self = this;
        for(var i = 0; i<list.length; i++) {
            list[i].apks = JSON.parse(list[i].apks);
            list[i].tags = JSON.parse(list[i].tags);
            list[i].icons = JSON.parse(list[i].icons);
            list[i].start = JSON.parse(list[i].start);
            list[i].developer = JSON.parse(list[i].developer);
            list[i].categories = JSON.parse(list[i].categories);
            list[i].screenshots = JSON.parse(list[i].screenshots);
        }

        return list;
    },

    packageNameUnique: function(list) {
      var result = [], hash = {};
      for (var i = 0, elem; (elem = list[i]) != null; i++) {
        if (!hash[elem.packageName]) {
          result.push(elem);
          hash[elem.packageName] = true;
        }
      }
      return result;
    },

    parseApps2: function(list) {

        var self = this;
        for(var i = 0; i<list.length; i++) {
            //delete list[i].id;
            //delete list[i].createdAt;
            //delete list[i].updatedAt;
            list[i].apks = JSON.parse(list[i].apks);
            list[i].tags = JSON.parse(list[i].tags);
            list[i].icons = JSON.parse(list[i].icons);
            list[i].start = JSON.parse(list[i].start);
            list[i].developer = JSON.parse(list[i].developer);
            list[i].categories = JSON.parse(list[i].categories);
            list[i].screenshots = JSON.parse(list[i].screenshots);
        }

        return list;
    },

    sortApps: function(arr) {

        var len = arr.length;
        var minIndex, temp;
        for (var i = 0; i < len - 1; i++) {
            minIndex = i;
            for (var j = i + 1; j < len; j++) {
                var a = parseInt(arr[j].downloadCount);
                var b = parseInt(arr[minIndex].downloadCount);
                if (a > b) {     //寻找最小的数
                    minIndex = j;                 //将最小数的索引保存
                }
            }
            temp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = temp;
        }

        return arr;
    },

    changeIndex: function(x) {
    	return (x*2-1);
    }, 

    changeNextIdx: function(x) {
        return (x*2-2);
    },
    getFilterArray: function() {
        //var filterArray = {}
        //filterArray['com.sina.weibo'] = true;
        //filterArray['com.sina.weibo'] = true;
    },
    filtersApp: function(list) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].packageName.indexOf('sina')>-1 || 
                list[i].packageName.indexOf('新浪')>-1 ||
                list[i].packageName.indexOf('taobao')>-1) {
                list.remove(list[i]);
            }
        }
        return list;
    },
}

module.exports = m;