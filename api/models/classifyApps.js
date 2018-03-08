/**
 *
 *
 * @description :: appDetails model/应用详情信息表
 * @author      :: This is Kun's holy crap.
 * @note        :: Who's ur daddy?
 */

module.exports = {
  //datastore: 'peas',
  //tableName:'classify_239',
  attributes: {
    ad: {
      type: 'string',
    },
    apks: {
      type: 'json',
    },
    appType: {
      type: 'string',
    },
    categories: {
      type: 'json',
    },
    changelog: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    developer: {
      type: 'json',
    },
    downloadCount: {
      type: 'string',
    },
    downloadCountStr: {
      type: 'string',
    },
    downloadFinishUrl: {
      type: 'string',
    },
    downloadStartUrl: {
      type: 'string',
    },
    icons: {
      type: 'json',
    },
    imprUrl: {
      type: 'string',
    },
    installFinishUrl: {
      type: 'string',
    },
    installedCount: {
      type: 'string',
    },
    installedCountStr: {
      type: 'string',
    },
    itemStatus: {
      type: 'string',
    },
    likesRate: {
      type: 'string',
    },
    packageName: {
      type: 'string',
    },
    publishDate: {
      type: 'number',
    },
    screenshots: {
      type: 'json',
    },
    start: {
      type: 'json',
    },
    tagline: {
      type: 'string',
    },
    tags: {
      type: 'json',
    },
    title: {
      type: 'string',
    },
    trusted: {
      type: 'number',
    },
    updatedDate: {
      type: 'string',
    },
    updatedAt: {
      type: 'string',
      columnType:'Date'
    },
    createdAt: {
      type: 'string',
      columnType:'Date',
    },
  },
};
