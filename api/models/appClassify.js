
/**
 * appClassify.js
 *
 * @description :: 模型定义，用于表示App类别结构关系
 * @docs        :: 字典文档/XXXX
 */

module.exports = {
  // datastore: 'peas',
  // tableName:'classify_37'
  attributes: {
    alias: {                        //类别别名
      type: 'string'            
    },
    banner: {
      type: 'string'                //横幅模块
    },
    defaultAppCount: {
      type: 'number'                //默认数量
    },
    groupName: {
      type: 'string'                //类别组名
    },
    icon: {
      type: 'string'                //类别图标
    },
    inactiveIcon: {
      type: 'string'                //活动图标
    },
    name: {
      type: 'string'                //类别名称
    },
    parentId: {
      type: 'number'                //父类标记
    },
    relatedIds: {
      type: 'string'                //关联标记
    },
    status: {
      type: 'number'                //状态标记
    },
    type: {
      type: 'string'                //类型标记
    },
    level: {
      type: 'number'                //等级标记
    },
    themetype: {
      type: 'string'                //子类标记
    },
    weight: {
      type: 'number'                //权重标记
    },
    slogan: {
      type: 'string'                //标语字段
    },
    thumbnail: {
      type: 'string'                //预览标记
    },
  },

  /**
   * 创建豆子数据
   * 
   * 这个函数仅用于第一次建表完成后，填充
   * 应用类别表，类别表里没有对应的类别数据，
   * 故用豆子的数据来补充数据表，便于后期同步
   * 更新数据。
   *
   * 无返回值
   */
  createPeas: function () {

    // appClassify.count({ id: { '>': 0 }}).exec(function countCB(error, found) {
    //     if (error) return;
    //     console.log("cb_tag1: The result of this count is shown came out. check it out: ",found);

    //     if(found){
    //         return found;
    //     }
    //     else{

    //         //获取豆子
    //         common.httpServer('api.wandoujia.com','/v1/categories',null,null,function (err,peas) {    
    //             if (err) {
    //                 console.log('createPeas. err: ',err);
    //                 return;
    //             }

    //             var i,j,k,peas;

    //             console.log('peas. ',peas.length);
    //             for(var i = 0; i<peas.length; i++) {
    //                 var e = peas[i];
                    
    //                 //构造数据
    //                 var categoryObj = {};

    //                 categoryObj.id =  e.id;
    //                 categoryObj.icon =  e.icon;
    //                 categoryObj.type =  e.type;
    //                 categoryObj.name =  e.name;
    //                 categoryObj.alias =  e.alias;
    //                 categoryObj.weight =  e.weight;
    //                 categoryObj.banner =  e.banner;
    //                 categoryObj.intent =  e.intent;
    //                 categoryObj.slogan =  e.slogan;
    //                 categoryObj.parentId =  e.parentId;
    //                 categoryObj.thumbnail =  e.thumbnail;
    //                 categoryObj.groupName =  e.groupName;
    //                 categoryObj.relatedIds =  e.relatedIds;
    //                 categoryObj.level =  e.categoryName.level;
    //                 categoryObj.inactiveIcon =  e.inactiveIcon;
    //                 categoryObj.themetype =  e.categoryName.type;
    //                 categoryObj.defaultAppCount =  e.defaultAppCount;
                    
    //                 categoryObj.createdAt =  m.format1();
    //                 categoryObj.updatedAt =  m.format1();

    //                 categoryObj.id || delete categoryObj.id;
    //                 categoryObj.icon || delete categoryObj.icon; 
    //                 categoryObj.type || delete categoryObj.type; 
    //                 categoryObj.name || delete categoryObj.name;

    //                 categoryObj.alias || delete categoryObj.alias;
    //                 categoryObj.level || delete categoryObj.level;  
    //                 categoryObj.weight || delete categoryObj.weight; 
    //                 categoryObj.banner || delete categoryObj.banner; 
    //                 categoryObj.intent || delete categoryObj.intent; 
    //                 categoryObj.slogan || delete categoryObj.slogan;

    //                 categoryObj.parentId || delete categoryObj.parentId; 
    //                 categoryObj.thumbnail || delete categoryObj.thumbnail; 
    //                 categoryObj.groupName || delete categoryObj.groupName;
    //                 categoryObj.themetype || delete categoryObj.themetype;  
    //                 categoryObj.relatedIds || delete categoryObj.relatedIds; 
    //                 categoryObj.inactiveIcon || delete categoryObj.inactiveIcon; 
    //                 categoryObj.defaultAppCount || delete categoryObj.defaultAppCount; 

    //                 console.log('categoryObj. check it out. ',categoryObj);
    //                 appClassify.create(categoryObj).exec(function (err) {
    //                     if (err) return;
    //                     console.log('cb_tag2: The result of this create is shown came out. check it out: ok');
    //                 });

    //                 var subEleArray = e.subCategories || []; 
    //                 for(j = 0; j<subEleArray.length; j++) {
    //                     var _e = subEleArray[j];

    //                     //构造数据
    //                     var _categoryObj = {};

    //                     _categoryObj.id =  _e.id;
    //                     _categoryObj.icon =  _e.icon;
    //                     _categoryObj.type =  _e.type;
    //                     _categoryObj.name =  _e.name;
    //                     _categoryObj.alias =  _e.alias;
    //                     _categoryObj.weight =  _e.weight;
    //                     _categoryObj.banner =  _e.banner;
    //                     _categoryObj.intent =  _e.intent;
    //                     _categoryObj.slogan =  _e.slogan;
    //                     _categoryObj.parentId =  _e.parentId;
    //                     _categoryObj.groupName =  _e.groupName;
    //                     _categoryObj.thumbnail =  _e.thumbnail;
    //                     _categoryObj.relatedIds =  _e.relatedIds;
    //                     _categoryObj.level =  _e.categoryName.level;
    //                     _categoryObj.inactiveIcon =  _e.inactiveIcon;
    //                     _categoryObj.themetype =  _e.categoryName.type;
    //                     _categoryObj.defaultAppCount =  _e.defaultAppCount;
                        
    //                     _categoryObj.createdAt =  m.format1();
    //                     _categoryObj.updatedAt =  m.format1();

    //                     _categoryObj.id || delete _categoryObj.id;
    //                     _categoryObj.icon || delete _categoryObj.icon; 
    //                     _categoryObj.type || delete _categoryObj.type; 
    //                     _categoryObj.name || delete _categoryObj.name;

    //                     _categoryObj.alias || delete _categoryObj.alias;
    //                     _categoryObj.level || delete _categoryObj.level;  
    //                     _categoryObj.weight || delete _categoryObj.weight; 
    //                     _categoryObj.banner || delete _categoryObj.banner; 
    //                     _categoryObj.intent || delete _categoryObj.intent; 
    //                     _categoryObj.slogan || delete _categoryObj.slogan;

    //                     _categoryObj.parentId || delete _categoryObj.parentId; 
    //                     _categoryObj.thumbnail || delete _categoryObj.thumbnail; 
    //                     _categoryObj.groupName || delete _categoryObj.groupName;
    //                     _categoryObj.themetype || delete _categoryObj.themetype;  
    //                     _categoryObj.relatedIds || delete _categoryObj.relatedIds; 
    //                     _categoryObj.inactiveIcon || delete _categoryObj.inactiveIcon; 
    //                     _categoryObj.defaultAppCount || delete _categoryObj.defaultAppCount;

    //                     console.log('_categoryObj. check it out. ',_categoryObj);
    //                     appClassify.create(_categoryObj).exec(function (err) {
    //                         if (err) return;
    //                         console.log('cb_tag3: The result of this create is shown came out. check it out: ok');
    //                     });
    //                 }
    //             }
    //             console.log('To add a completion step');
    //             return found;
    //         })
    //     }
    // });
  },

  /**
   * 更新豆子数据
   * 
   * 这个函数用于比对豆子的数据和我们的类别
   * 数据的差异性，比对完成最后以豆子的数据
   * 为准，更新到类别表中，保持和豆子的数据
   * 一致。
   *
   * 无返回值
   */
  updatePeas: function() {

    // //获取豆子
    // common.httpServer('api.wandoujia.com','/v1/categories',null,'type=APP',function (err,peas) {

    //     if (err) {
    //         console.log('updatePeas. err: ',err);
    //         return;
    //     }

    //     var i,j,k,peas;

    //     console.log('peas. ',peas.length);
    //     for(var i = 0; i<peas.length; i++) {
    //         var e = peas[i];
            
    //         //构造数据
    //         var categoryObj = {};

    //         categoryObj.id =  e.id;
    //         categoryObj.icon =  e.icon;
    //         categoryObj.type =  e.type;
    //         categoryObj.name =  e.name;
    //         categoryObj.alias =  e.alias;
    //         categoryObj.weight =  e.weight;
    //         categoryObj.banner =  e.banner;
    //         categoryObj.intent =  e.intent;
    //         categoryObj.slogan =  e.slogan;
    //         categoryObj.parentId =  e.parentId;
    //         categoryObj.thumbnail =  e.thumbnail;
    //         categoryObj.groupName =  e.groupName;
    //         categoryObj.relatedIds =  e.relatedIds;
    //         categoryObj.level =  e.categoryName.level;
    //         categoryObj.inactiveIcon =  e.inactiveIcon;
    //         categoryObj.themetype =  e.categoryName.type;
    //         categoryObj.defaultAppCount =  e.defaultAppCount;
            
    //         categoryObj.createdAt =  m.format1();
    //         categoryObj.updatedAt =  m.format1();

    //         categoryObj.id || delete categoryObj.id;
    //         categoryObj.icon || delete categoryObj.icon; 
    //         categoryObj.type || delete categoryObj.type; 
    //         categoryObj.name || delete categoryObj.name;

    //         categoryObj.alias || delete categoryObj.alias;
    //         categoryObj.level || delete categoryObj.level;  
    //         categoryObj.weight || delete categoryObj.weight; 
    //         categoryObj.banner || delete categoryObj.banner; 
    //         categoryObj.intent || delete categoryObj.intent; 
    //         categoryObj.slogan || delete categoryObj.slogan;

    //         categoryObj.parentId || delete categoryObj.parentId; 
    //         categoryObj.thumbnail || delete categoryObj.thumbnail; 
    //         categoryObj.groupName || delete categoryObj.groupName;
    //         categoryObj.themetype || delete categoryObj.themetype;  
    //         categoryObj.relatedIds || delete categoryObj.relatedIds; 
    //         categoryObj.inactiveIcon || delete categoryObj.inactiveIcon; 
    //         categoryObj.defaultAppCount || delete categoryObj.defaultAppCount; 

    //         console.log('categoryObj. check it out. ',categoryObj);
    //         appClassify.update({id:e.id}).set(categoryObj).exec(function (err, recond) {
    //             if (err) return;
    //             console.log('cb_tag1: The result of this update is shown came out. check it out: ok');
    //         });

    //         var subEleArray = e.subCategories || []; 
    //         for(j = 0; j<subEleArray.length; j++) {
    //             var _e = subEleArray[j];

    //             //构造数据
    //             var _categoryObj = {};

    //             _categoryObj.id =  _e.id;
    //             _categoryObj.icon =  _e.icon;
    //             _categoryObj.type =  _e.type;
    //             _categoryObj.name =  _e.name;
    //             _categoryObj.alias =  _e.alias;
    //             _categoryObj.weight =  _e.weight;
    //             _categoryObj.banner =  _e.banner;
    //             _categoryObj.intent =  _e.intent;
    //             _categoryObj.slogan =  _e.slogan;
    //             _categoryObj.parentId =  _e.parentId;
    //             _categoryObj.groupName =  _e.groupName;
    //             _categoryObj.relatedIds =  _e.relatedIds;
    //             _categoryObj.level =  _e.categoryName.level;
    //             _categoryObj.inactiveIcon =  _e.inactiveIcon;
    //             _categoryObj.themetype =  _e.categoryName.type;
    //             _categoryObj.defaultAppCount =  _e.defaultAppCount;
                
    //             _categoryObj.createdAt =  m.format1();
    //             _categoryObj.updatedAt =  m.format1();

    //             _categoryObj.id || delete _categoryObj.id;
    //             _categoryObj.icon || delete _categoryObj.icon; 
    //             _categoryObj.type || delete _categoryObj.type; 
    //             _categoryObj.name || delete _categoryObj.name;

    //             _categoryObj.alias || delete _categoryObj.alias;
    //             _categoryObj.level || delete _categoryObj.level;  
    //             _categoryObj.weight || delete _categoryObj.weight; 
    //             _categoryObj.banner || delete _categoryObj.banner; 
    //             _categoryObj.intent || delete _categoryObj.intent; 
    //             _categoryObj.slogan || delete _categoryObj.slogan;

    //             _categoryObj.parentId || delete _categoryObj.parentId;
    //             _categoryObj.thumbnail || delete _categoryObj.thumbnail;  
    //             _categoryObj.groupName || delete _categoryObj.groupName;
    //             _categoryObj.themetype || delete _categoryObj.themetype;  
    //             _categoryObj.relatedIds || delete _categoryObj.relatedIds; 
    //             _categoryObj.inactiveIcon || delete _categoryObj.inactiveIcon; 
    //             _categoryObj.defaultAppCount || delete _categoryObj.defaultAppCount;

    //             console.log('_categoryObj. check it out. ',_categoryObj);
    //             appClassify.update({id:_e.id}).set(_categoryObj).exec(function (err, recond) {
    //                 if (err) return;
    //                 console.log('cb_tag2: The result of this update is shown came out. check it out: ok');
    //             });
    //         }
    //     }
    //     console.log('To update a completion step');
    // })
  },
};