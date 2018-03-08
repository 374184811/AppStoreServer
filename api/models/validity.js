
// /**
//  * validity.js
//  *
//  * @description :: 模型定义，用于表示数据有效期
//  * @docs        :: 字典文档/XXXX
//  */

module.exports = {
  //datastore: 'validity',
  attributes: {
    key: {                        //类别别名
      type: 'string'            
    },
    val: {
      type: 'json'                //横幅模块
    },
  },

  isInsert: function(key,val) {
    validity.findOne({key: key}).exec(function (err, recond) {
      if (err) return;
      console.log('m_tag1: The result of this find is shown came out. check it out: ok');

      if (_.isUndefined(recond)) {
        validity.create({key:key,val:val}).exec(function (err) {
            if (err) return;
            console.log('m_tag2: The result of this create is shown came out. check it out: ok');
        });
      }

    })
  },

  clear: function() {
    console.log('clear. delete from validity');
    var sqlDelValidity = 'delete from validity';
    validity.getDatastore().sendNativeQuery(sqlDelValidity, function(err, data){
        if (err) return;
        console.log('m_tag1: The result of this create is shown came out. check it out: ok');
    });
  },
};