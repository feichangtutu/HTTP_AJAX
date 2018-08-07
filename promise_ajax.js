/**
 * Created by jyn on 2018/8/7.
 */
function pajax({
	               url=null,
	               method = 'GET',
	               type = null,
	               data = null,
	               dataType = 'JSON',
	               cache = true,
	               async = true,
	               success = null })
{
	return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest()
		
		// deal cache
		let isGet = /^(GET|DELETE|HEAD)$/i.test(method)
		let symbol = url.indexOf('?')>-1 ? '&' : '?'
		// GET系列请求才处理cache
		if(isGet){
			!cache ? url+= `${symbol}_${Math.random()}`: null
		}
		if(data !== null){
			data = formatData(data)
			if(isGet){
				url += symbol + data
				data = null
			}
		}
		xhr.open(method, url, async)
		xhr.responseType = dataType
		xhr.onreadystatechange = () => {
			if(!/^[23]\d{2}$/.test(xhr.status)) return
			if(xhr.readyState === 4) {
				let result = xhr.responseText
				// deal dataType
				switch (dataType.toUpperCase()) {
					case 'TEXT':
					case 'HTML':
						break;
					case 'JSON':
						result = JSON.parse(result)
						break;
					case 'XML':
						result = xhr.responseXML
				}
				resolve(result)
			}
		}
		xhr.onerror = (err) => {
			reject(err)
		}
		xhr.send()
	})
}
function formatData(data){
	if(Object.prototype.toString.call(data)==='[object Object]'){
		let obj = data
		let str = ''
		for(let key in obj){
			if(obj.hasOwnProperty(key)){
				str+=`${key}=${obj[key]}&`
			}
		}
		str = str.replace(/&$/g,'')
		return str
	}
}
