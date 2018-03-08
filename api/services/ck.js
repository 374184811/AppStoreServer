
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


/**
 * create check components object
 *
 */
var ck = module.exports = function() {
    console.log('create: function')
    return this;
};

/**
 * Initialize the internal ck components object
 *
 */
ck.initialize = function() {
  console.log('initialize: function');
};


/**
 * Returns the value of all parameters sent in the request,
 * merged together into a single object. Includes parameters 
 * parsed from the url path.
 *
 * @param {object} allParams
 * @return {boolean} true or false  
 */
 ck.isForbidden = function(allParams) {
    var o = Object.assign({},allParams);

    for(var k in o ) {
        // if (o[k] === '') {
        //     return true;
        // }else
        if (o[k] === NaN) {
            return true;
        }else
        if (o[k] === null) {
            return true;
        }else
        if (o[k] === undefined) {
            return true;
        }
    }
    return false;
 };

 /**
 * 
 * Transfers control to a target instruction if 
 * value is '', a null reference, or NaN,undefined.
 * 
 *
 * @param {string} key
 * @return {map}  map  
 */
 ck.isResetKey = function(k,map) {

   var forbidden = {'undefined':true, '':true, 'null':true, 'NaN':true};
    if ( forbidden[map.get(k)] ? true : false )  map.set(k,0);

    return map;
 };

/**
 * 
 * Synthesis of an array of strings
 * 
 *
 * @param {string} key
 * @return {map}  map  
 */
 ck.hashToString = function(arr) {
    if (!Array.isArray(arr)) return false;

    var s = '',l = 0;
    while(l<arr.length) {
        s = l < arr.length -1 ? s += arr[l] + ':' : s += arr[l];
        l++;
    }

    return s;
 };


 /**
 * 
 * A star time,end time B, T is boolean, it is a Boolean value, true that gets the time stamp for Today, 
 * false timestamp representing the Get a. this function is to caclulate the numbe of milliseconds
 * between them,finally,returns a timestamp.   
 * 
 * @param {Boolean} t
 * @param {Date} a
 * @param {Date} b
 * @return {Date}  p   
 */
ck.calcPretime = function(t,a,b) {
    try {
        var p, tt, tb, st, et;
        b = b ? b : a;
        tb = t ? true : false;
        tt = new Date().getTime();
        st = b ? new Date(a).getTime() : tt;
        et = b ? new Date(b).getTime() : 0;
        return  (p = tb ? et - tt : et - st) > 0 ? p : 0;
    }catch (e) {
        console.log('calcPretime err: ',e);
    }
 };

 /**
 *
 *  这个函数是过滤用户传过来的所有参数，可以是空对象，
 *  如果参数中有undefined,null,NaN都返回true,返回false
 *  表示参数全部通过检测，可以继续访问。
 *  
 *  @param {session} session
 */
 ck.isPass = function(allParams) {
    var allparams = Object.assign({},allParams);
    return this.isForbidden(allparams);
 };


 /**
 *
 *  这个函数检测对象是否为空，如果对象为空，返回false。
 *  这里面只是要有一个对象，否则都是为false,如果要过滤
 *  用户传过来的参数是否为空，可以调用此函数检查。
 *  
 *  @param {session} session
 */
 ck.isValid = function(allParams) {
    var allparams = Object.assign({},allParams);
    var keycount = 0;
    for(var key in allparams) {
        keycount = keycount + 1;
    }
    return keycount===0 ? true : false;
 };
 
 /**
 *
 *  这个函数是检测session是否为空，如果为空返回true,否则false.
 *  这个函数用于检测用户登录，如果为空表示没有登录。
 *  
 *  @param {session} session
 */
 ck.isMine = function(session) {
    if (!session) {
        return true;
    }
    return false;
 };


/**
 *
 *  这个函数是检测session里面存储的storeid是不是管理员，如果
 *  storeid为0返回true,反之为false. 如果要检查是否是管理员可
 *  以调用这个函数
 *  
 *  @param {session} session
 */
ck.isAdmin = function(session) {
    var mesession = Object.assign({},session);
    if (!mesession) {
        return true;
    }
    return mesession.storeid ===0?true:false;
};

/**
 *
 *  这是一个检查是否可以继续访问的函数，他可以检查是否登录，
 *  参数错误，参数为空，管理员操作，权限不足，如果你需要检查
 *  用户是否登录，请在map里面set把他的key值设置为mine_check,
 *  value除了-1以为可以是任何数值，如果你要检测参数是否为空
 *  请把valid_check在map里设置即可，admin_check ！==-1,如果
 *  你要检查是否是管理员操作，admin_check同上，如果你要检查
 *  当前用户是否有权限，把adminid_check设置即可。是的，他们都
 *  不能为-1,并且你还要把商品的SKU传过来，在map里面设置,参考
 *  eg：mpa.set('sku','U5OP-4-1478747472954')。
 *  
 *  @param {req} req
 *  @param {res} res
 *  @param {Map} map
 */
ck.isAccess = function(req,res,map) {
    
    console.log('isAccess. check it out. ',req.path);
    
    if (!map || !map.size) {
        throw new TypeError('isAccess', "ck.js", 228);
        return;
    }

    var self = this;
    const _MINE_CHECK = map.get('MINE_CHECK') || -1;
    const _PASS_CHECK = map.get('PASS_CHECK') || -1;
    const _VALID_CHECK = map.get('VALID_CHECK') || -1;
    const _ADMIND_CHECK = map.get('ADMIND_CHECK') || -1;
    const _OPTION_CHECK = map.get('OPTION_CHECK') || -1;
    const _ADMINDID_CHECK = map.get('ADMINDID_CHECK') || -1;
    const _SERCURITY_CHECK = map.get('SERCURITY_CHECK') || -1;

    if (_MINE_CHECK !== -1) {
        console.log('登录: √');
    }

    if (_PASS_CHECK !== -1) {
        console.log('参数: √');
    }

    if (_OPTION_CHECK !== -1) {
        console.log('控制器验证: √');
    }
    // console.log('_MINE_CHECK: ', _MINE_CHECK);
    // console.log('_PASS_CHECK: ', _PASS_CHECK);
    // console.log('_VALID_CHECK: ', _VALID_CHECK);
    // console.log('_ADMIND_CHECK: ', _ADMIND_CHECK);
    // console.log('_OPTION_CHECK: ', _OPTION_CHECK);
    // console.log('_ADMINDID_CHECK: ', _ADMINDID_CHECK);
    // console.log('_SERCURITY_CHECK: ', _SERCURITY_CHECK);


    var option = req.options;
    var mine = req.session.mine;
    var allParams = req.allParams();


    var skuObj = skuObj || -1;
    if (typeof(allParams.sku) === 'string') {
        skuObj = self.revertSku(allParams.sku);
    }

    if (_MINE_CHECK !== -1&&self.isMine(mine)) {

        /**
        * isMine 检测session是否存在当前用户，如果session
        * 为空，表示当前用户没有登录，返回一个Msg:'用户未登录'
        * 
        */

        return self.resJson(res,{
            msg:'用户未登录'
        })
    }

    if (_PASS_CHECK !== -1&&self.isPass(allParams)) {

        /**
        * isPass 检测客户端传过来的所有参数，默认是可以{},
        * {}没有参数默认是通过，若要检测{},请调用isValid方法.
        * 若是undefined,NaN,返回一个Msg: '参数错误'
        */

        return self.resJson(res,{
            msg:'参数错误'
        }) 
    }

    if (_VALID_CHECK !== -1&&self.isValid(allParams)) {

        /**
        * isValid 检测客户端传过来的所有参数并且不能是{},
        * 如果是{}，返回一个Msg: '参数为空'，isValid检测
        * 比较严格，{}必须要有内容。
        */

        return self.resJson(res,{
            msg:'参数为空'
        })  
    }

    if (_ADMIND_CHECK !== -1&&self.isAdmin(mine)) {

        /**
        * isAdmin 检测session是否是管理员，如果要限制管理员
        * 操作或检测管理员越界操作。返回一个Msg:'管理员您好'
        * 
        */

        return self.resJson(res,{
            msg:'管理员您好'
        }) 
    }

    if (_OPTION_CHECK !== -1) {

        /**
        * option_check 默认非-1值，如果为 -1，表示不检查。
        * 如果req.options方法为null,表示请求无效，会返回一个
        * Msg:'未知请求'.
        * 
        */

        //console.log('option. check it out. ',option,'\n skuObj. check it out. ',skuObj);
        if (!option) {
           return self.resJson(res,{
                msg:'未知请求'
            })  
        }
    }

    if (_ADMINDID_CHECK !== -1) {

        /**
        * adminid_check 默认非-1值，如果为 -1，表示不检查。
        * 要执行这个检查，请在map里面设置sku，这个检查非管
        * 理员人员越界操作，如果不是管理员操作，会返回一个
        * Msg:'权限不足'.
        * 
        */

        console.log('mine. check it out. ',mine,'\n skuObj. check it out. ',skuObj);
        var mine_id = parseInt(mine.storeid); 
        var storeid = parseInt(skuObj.storeid);

        if (mine_id>0&&mine_id!=storeid) {
           return self.resJson(res,{
                msg:'权限不足'
            })  
        }
    }

    if (_SERCURITY_CHECK !== -1) {

        /**
        * sercurity_check 默认非-1值，如果为 -1，表示不检查。
        * 要执行这个检查，请在map里面设置 sercurity_check，这
        * 这个输入不能包含非法字符，如果有非法字符输入，则提示
        * Msg:'非法字符'.
        * 
        */

        //console.log('mine. check it out. ',mine,'\n skuObj. check it out. ',skuObj);
        // var valArray = Object.values(allParams);
        // for(var i = 0; i<valArray.length; i++) {
        //     var val = valArray[i];
        //     if (self.againstInjecting(val)) {
        //         return self.resJson(res,{
        //             msg:'非法字符'
        //         })  
        //     }
        // }
    }

    const code = 200;
    console.log('code: 200');
    /**
    * code：200检测通过，可以继续访问
    */
    
    return code;
};

/**
 *
 *  这个集中处理访问接口（isAccess）返回的信息，
 *  如果有检查条件不通过，会返回一个json,它包含
 *  code:400,data:[],msg:ojb.msg信息。
 *  
 *  @param {req} req
 *  @param {res} res
 *  @param {Map} map
 */
ck.resJson = function(res,obj) {
    return res.json({
        code: 400,
        data: [],
        msg:obj.msg
    });
};

ck.againstInjecting = function(serch) {
    
    if (!_.isString(serch)) {
        return false;
    }else{
         //过滤URL非法SQL字符
        var sUrl = serch;
        var sQuery = sUrl.substring(sUrl.indexOf("=")+1);
        re=/select|update|delete|truncate|join|union|exec|insert|drop|count|’|"|;|>|<|%/i;
        if(re.test(sQuery)){
            return true;
        }
        return false;
    }
};