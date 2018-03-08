
module.exports = {
  attributes: {
    packageName: {//广告应用包名
      type: 'string',
    },
    name: {//广告应用的所属类别名称
      type: 'string',
    },
    price: {//广告应用单价
      type: 'number',
      columnType:'decimal',
    },
    adstype: {//广告应用类型
      type: 'string',
    },
    createdAt: {
      type: 'string',
    },
  },
};
