/**
 * Global Variable Configuration
 * (sails.config.globals)
 *
 * Configure which global variables which will be exposed
 * automatically by Sails.
 *
 * For more information on any of these options, check out:
 * https://sailsjs.com/config/globals
 */

module.exports.globals = {

  _redis: require("redis"),

  /****************************************************************************
  *                                                                           *
  * Whether to expose the locally-installed `lodash` as a global variable     *
  * (`_`), making  it accessible throughout your app.                         *
  * (See the link above for help.)                                            *
  *                                                                           *
  ****************************************************************************/

  _: require('lodash'),

  /****************************************************************************
  *                                                                           *
  * Whether to expose the locally-installed `async` as a global variable      *
  * (`async`), making it accessible throughout your app.                      *
  * (See the link above for help.)                                            *
  *                                                                           *
  ****************************************************************************/

  async: require('async'),

  /****************************************************************************
  *                                                                           *
  * Whether to expose each of your app's models as global variables.          *
  * (See the link at the top of this file for more information.)              *
  *                                                                           *
  ****************************************************************************/

  models: true,

  /****************************************************************************
  *                                                                           *
  * Whether to expose the Sails app instance as a global variable (`sails`),  *
  * making it accessible throughout your app.                                 *
  *                                                                           *
  ****************************************************************************/

  sails: true,

  //文件上传地址
  uploadFilePath:'/usr/local/appstorefile/',
  fileUrl:'/',

  //豌豆荚的id和key
  peapodsId:'baoqianli',
  peapodsKey:'cfe71f1f06424bb186571b2414656815',
  
  //大厂新汇游的开发者数组
  developerArr:['3 Minute Games LLC','杭州网易雷火科技有限公司','Rusty Lake','Gameloft','G5 Entertainment','G5 Games',
    '北京掌趣科技股份有限公司','Chillingo','Chillingo International','CHILLINGO','上海邮通科技有限公司','成都龙渊网络科技有限公司',
    'Rebel Twins&SuperDev','Rovio Mobile Ltd.','Paradox Interactive','腾讯科技（成都）有限公司','搜狐畅游',
    '上海数龙科技有限公司','腾讯科技（上海）有限公司','腾讯科技（深圳）有限公司','腾讯&北京猎豹网络科技有限公司',
    '北京昆仑乐享网络技术有限公司','福建网龙计算机网络信息技术有限公司','北京触控科技有限公司'],

  hinst:null,
  
  //aapt命令行地址
  aaptCMD:'/usr/local/android-sdk-linux/tools/android-6.0/',
  //获取apk信息的node_apktool模块地址
  apkToolPath:'/usr/local/appstoreserver/node_modules/node_apktool'
};
