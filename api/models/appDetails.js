/**
 *
 *
 * @description :: appDetails model/应用详情信息表
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
      columnType:'integer'
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
    unshelve: {
      type: 'string'
    },
    unshelveTime: {
      type: 'string'
    },
    setTopTime: {
      type: 'string'
    },
    setTop: {
      type: 'string'
    },
    class1: {
      type: 'string'
    },
    class2: {
      type: 'string'
    },
    orderId: {
      type: 'number'
    },
  },
  /**
  * 配置数据格式函数
  * @param obj
    * @param callback
    */
  dataFormat:function(obj){
      var app = {};
      var apksArr = [],apksObj = {},downloadUrlObj = {};
      var developerObj = {},statObj = {};
      downloadUrlObj.url = obj.downloadUrl;

      apksObj.adsType = 'NONE';
      apksObj.bytes = obj.bytes;
      apksObj.creation = new Date(obj.createdAt).getTime();
      apksObj.downloadUrl = downloadUrlObj;
      apksObj.maxSdkVersion = obj.maxSdkVersion||0;
      apksObj.md5 = obj.md5||null;
      apksObj.minSdkVersion = obj.minSdkVersion||0;
      apksObj.official = obj.official||null;
      apksObj.paidType = 'NONE';
      apksObj.permissions = JSON.parse(obj.permissions);
      apksObj.pubKeySignature = obj.pubKeySignature||null;
      apksObj.securityStatus = 'SAFE';
      apksObj.signature = null;
      apksObj.superior = null;
      apksObj.targetSdkVersion = null;
      apksObj.verified = null;
      apksObj.versionCode = obj.versionCode + '';
      apksObj.versionName = obj.versionName;
      apksArr.push(apksObj);

      developerObj.name = obj.developer;
      statObj.weeklyStr = obj.weeklyStr||null;

      app.ad = false;
      app.apks = apksArr;
      app.appType = obj.appType;
      app.categories = JSON.parse(obj.categories);
      app.changelog = obj.changelog;
      app.description = obj.description;
      app.detailParam = obj.detailParam||null;
      app.developer = developerObj;
      app.downloadCount = obj.downloadCount || 0;
      app.downloadCountStr = obj.downloadCountStr ||null;
      app.downloadFinishUrl = obj.downloadFinishUrl||null;
      app.downloadStartUrl = obj.downloadStartUrl||null;
      app.icons = obj.icons;
      app.imprUrl = obj.imprUrl||null;
      app.installFinishUrl = obj.installFinishUrl||null;
      app.installedCount = obj.installedCount||0;
      app.installedCountStr = obj.installedCountStr||null;
      app.itemStatus = 1;
      app.likesRate = obj.likesRate||0;
      app.packageName = obj.packageName||null;
      app.publishDate = obj.publishDate||0;
      app.screenshots = obj.screenshots||{};
      app.stat = statObj;
      app.tagline = obj.tagline;
      app.tags = obj.tag;
      app.title = obj.title;
      app.trusted = null;
      app.updatedDate = new Date(obj.updatedAt).getTime();
      app.protruly = true;

      return app;
  },
  /**
   * 配置更新升级接口数据格式函数
   * @param data
   * @param callback
   */
  updateFormat:function(data){
      var obj = {};
      obj.packageName = data.packageName|| "";
      obj.title = data.title|| "";
      obj.downloadUrl = data.downloadUrl|| "",
      obj.iconPath = data.icons['px256']|| "";
      obj.versionCode = data.versionCode + ''|| "0";
      obj.versionName = data.versionName|| "0.0.0";
      obj.developer = data.developer|| "";
      obj.lastModifiedTime = new Date(data.createdAt||new Date()).format('yyyy年MM月dd日')|| "";
      obj.size = data.bytes|| 0;
      obj.detailUrl = data.detailUrl|| "";
      obj.downloadCnt = data.downloadCount|| "";
      obj.isCerStrMatch = data.isCerStrMatch|| true;
      obj.changeLog = data.changelog|| "";
      obj.fileMd5 = data.fileMd5|| "";
      obj.hasPatch = data.hasPatch|| false;
      obj.patchURL = data.patchURL|| "";
      obj.patchSize = data.patchSize|| "";
      obj.patchMd5 = data.patchMd5|| "";
      obj.recommendedType = data.recommendedType|| "";
      obj.notRecommendReason = data.notRecommendReason|| {};
      obj.market = data.market|| "";
      obj.superior = data.superior|| false;
      obj.lastModified = new Date(data.createdAt||new Date()).getTime()|| 0;
      obj.importantUpdate = data.importantUpdate|| null;
      obj.notificationModel = data.notificationModel|| null;
      obj.importantLevel = data.importantLevel|| 1;
      obj.yybCdKey = data.yybCdKey|| null;
      obj.appType = data.appType|| "";
      obj.protruly = true;

      return obj;
  },
};
