### AJAX封装
> JQ的AJAX
```javascript
    $.ajax({
        url:'',//=>请求api地址
        method: 'get',    //=>请求方式 get/post  老版本用type,效果相同
        
        dataType: 'json', //=>预设的获取结果的类型，不会影响服务器的返回，
                          // json 会把服务器返回的数据转换为json
                          // text直接拿过来操作, 预设还可以是xml
                          
        cache: true,      //=>设置是否清除缓存，只对get系列请求起作用，默认值true
                          // jq会在url末尾加随机数清除缓存
                          
        data:null,        //=>通过data把一些信息传递给服务器。
                          // GET系列请求会把data拼接到url末尾传递给服务器
                          // POST系列请求会把data放到请求主体中传递给服务器
                          // data的值有两种形式：字符串 对象，
                          // 如果是字符串，设置的值是什么，传递给服务器的就是什么 
                          // 如果是对象，JQ会把对象变为 xxx=xxx&xx=xx这样的字符串传递给服务器
        async:true,       // 默认true，异步
        success: function(result){
        	// d当ajax请求成功（readyState === 4 & status =2|3开头）
        	// 请求成功后，JQ会把传递的回调函数执行,并且把获取的结果当做实参传递给回调函数（result就是从服务器获取的结果）
        },
        error: function(msg){},//请求错误触发回调函数
        complete: function(){},//不管请求是正确的还是错误的都会触发回调函数 完成
        //...
    })
    
```
实现上述功能