>*引*：最近面试面试官让我把ajax封装成axios形式，当时居然没写出来。
回来研究promise后觉得可以实现。</br>现分享如下.
 ### axios部分源码学习：
 [axios](https://github.com/axios/axios)的自我介绍：`Promise based HTTP client for the browser and node.js`
 翻译成一句不太恰当的中文就是： 我，axios，就是基于Promise,服务于浏览器和node.js的的HTTP客户端。
 
 下面重点看我想了解的ajax部分。
 #### axios中的adapters模块
 >The modules under adapters/ are modules that handle dispatching a request and settling a returned Promise once a response is received.
 -->此模块主要处理分发请求，并在返回的Promise一旦有响应被接收的情况下进行处理。
 
 源码中查看：`axios/lib/adapters/xhr.js`有这样一段让我眼前一亮：
 
 ```javascript
module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
  })
}
```
  果然采用的是promise处理，继续看源码，接下来就是Promise内部处理ajax重要的 `open`, `onreadystatechange`, `send`几处实现，照样循规蹈矩，挑出来看：
  ```javascript
    // =>...omit config...
    // step1=>
    var request = new XMLHttpRequest();
    // step2=>
    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);
    // step3=>
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }
    
      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }
    
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };
    
      settle(resolve, reject, response);
      // Clean up request
      request = null;
    };
    // =>...omit handle process...
    // step4=>
    request.send(requestData);
```
 以上只是ajax的实现，但核心的then链式调用并没有实现，真正的实现来看`axios/lib/core/settle.js`下的settle方法：
                              
 ```javascript
/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};
```
关键的`resolve`和`reject`解决后，按照规定（[Promise A+ 规范 ](https://juejin.im/post/5b6161e6f265da0f8145fb72) ）
>promise必须提供then方法来存取它当前或最终的值或者原因。

此时可以根据`promise.then(onFulfilled, onRejected)`，利用其中的两个方法对返回做处理。
以上已经基本实现了ajax的功能。

下面仿照axios的思想封装自己的promise_ajax
### 初步实现自己的P_ajax
```javascript
function pajax({
    url= null,
	method = 'GET',
	dataType = 'JSON',
	async = true})
{
	return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest()
		xhr.open(method, url, async)
		xhr.responseType = dataType
		xhr.onreadystatechange = () => {
			if(!/^[23]\d{2}$/.test(xhr.status)) return
			if(xhr.readyState === 4) {
				let result = xhr.responseText
				resolve(result)
			}
		}
		xhr.onerror = (err) => {
			reject(err)
		}
		xhr.send()
	})
}
```
默认调用JSON格式并测试成功
```javascript
	ajax({
		url:'./test.json',
		method: 'get'
	}).then((result)=>{
		console.log(result)
    },()=>{

    })
```
#### 升级优化
针对不同请求类型，文件类型，做不同的处理
+ 添加判断请求类型，请求为get时，针对缓存做不同处理
cache为false即不设置缓存，利用最简单的加 _***解决，***为随机数

```javascript
    // 判断请求类型是否为GET
	let isGet = /^(GET|DELETE|HEAD)$/i.test(method)
	// 判断url有没有？，有的话就添加&
    let symbol = url.indexOf('?')>-1 ? '&' : '?'
    // GET系列请求才处理cache
    if(isGet){
        !cache ? url+= `${symbol}_${Math.random()}`: null
    }
```
+ 根据返回类型对result做不同处理

```javascript
    let result = xhr.responseText
    // DATA TYPE 对服务器端返回的结果进行二次处理
    switch(this.dataType.toUpperCase()){
        case 'TEXT':
        case 'HTML':
            break;
        case 'JSON':
            result = JSON.parse(result)
            break;
        case 'XML':
            result = xhr.responseXML
    }   
```

+ 处理data
 当data为对象时转化为str，方面get请求传参
 ```javascript
    function formatData(data){
        if(Object.prototype.toString.call(data)==='[object Object]'){
            let obj = data
            let str = ''
            for(let key in obj){
                if(obj.hasOwnProperty(key)){
                    str+=`${key}=${obj[key]}&`
                }
            }
            // 去掉最后多加的&
            str = str.replace(/&$/g,'')
            return str
        }
    }
    if(data !== null){
        data = formatData(data)
        if(isGet){
            url += symbol + data
            data = null
        }
    }
```

简单测试结果：
```javascript
pajax({
		url:'./test.json',
		method: 'get',
        cache: false,
        data:{
			name:'jyn',
            age:20
        }
	}).then((result)=>{
		console.log(result)
    },(err)=>{
        console.log(err)
    })
```
运行结果为：
`Request URL: http://localhost:63342/june/HTTP_AJAX/test.json?_0.6717612341262227?name=jyn&age=20
`
目前靠谱，且`then`方法也能获取到文件数据。
cache设置为false时，每次刷新获取都是200，不走304，功能正常。

以上，基于Promise的简易ajax就完工大吉啦！

> Author: Yanni Jia</br>
Nickname: 非常兔