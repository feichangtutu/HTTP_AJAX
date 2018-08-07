/**
 * Created by jyn on 2018/8/6.
 */
~function(){
	class ajaxClass {
		// 4 steps =>send ajax
		init() {
			let xhr = new XMLHttpRequest()
			xhr.onreadystatechange = ()=>{
				if(!/^[23]\d{2}$/.test(xhr.status)) return
				if(xhr.readyState === 4){
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
					this.success(result)
				}
			}
			// deal cache, get才会处理cache
			this.isGet ? this.dealCache() : null
			// deal data
			if(this.data !== null){
				this.formatData()
				if(this.isGet){
					this.url += this.querySymbol() + this.data
					this.data = null
				}
			}
			xhr.open(this.method, this.url, this.async)
			xhr.send(this.data)
		}
		dealCache(){
			!this.cache ? this.url+= `${this.querySymbol()}_${Math.random()}`: null
		}
		querySymbol () {
			return this.url.indexOf('?')>-1 ? '&' : '?'
		}
		// obj -> str
		formatData(){
			if(Object.prototype.toString.call(this.data)==='[object Object]'){
				let obj = this.data
				let str = ''
				for(let key in obj){
					if(obj.hasOwnProperty(key)){
						str+=`${key}=${obj[key]}&`
					}
				}
				str = str.replace(/&$/g,'')
				this.data = str
			}
		}
	}
	// => init parameters
	window.ajax = function({
		url=null,
		method = 'GET',
		type = null,
		data = null,
		dataType = 'JSON',
		cache = true,
		async = true,
		success = null } = {})
	{
		let example = new ajaxClass()
		example.url = url
		example.method = type === null? method : type
		example.data = data
		example.dataType = dataType
		example.cache = cache
		example.async = async
		example.success = (typeof(success) === 'function') ? success : new Function()
		// 等价优化
		/**
			['url','method','data','dataType','cache','async','success'].forEach( item =>{
			if(item === 'method'){
				example.method = type === null? method : type
				return
			}
			if(item === 'success'){
				example.success = typeof(success) === 'function' ? success : new Function()
				return
			}
			example[item] = eval(item)
		})
		*/
		example.isGet = /^(GET|DELETE|HEAD)$/i.test(example.method)
		example.init()
		return example
	}
}()
