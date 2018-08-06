/**
 * Created by jyn on 2018/8/6.
 */
~function(){
	let box = document.getElementById('box')
	let serverTime = null
	let fn = ()=>{
		// nowTime = new Date()获取的是客户端本机时间，会受到客户端自己设置的时间影响，
		// 重要的时间参考不能基于这个完成，
		// 不管是哪一个客户都要基于相同的服务器时间进行计算
	
		/**
		 *为避免重复请求服务器，需要把第一次获取的服务器时间每隔1s进行累加
		 *getTime() 方法可返回距1970 年1 月1 日之间的毫秒数。
		 * */
		serverTime = serverTime + 1000
		let	tarTime = new Date('2018/08/06 19:00 ').getTime()
		let	spanTime = tarTime - serverTime
		if(spanTime<0){
			//	已经开抢了
			box.innerHTML='开抢'
			clearInterval(autoTimer )
			return
		}
		let hours = Math.floor(spanTime/(1000*60*60))
		spanTime-=hours*3600000
		let minites = Math.floor(spanTime/(1000*60))
		spanTime-= minites*60000
		let seconds = Math.floor(spanTime/1000)
		hours < 10 ? hours= '0'+hours : null
		minites <10 ? minites='0'+minites : null
		seconds <10 ? seconds='0'+seconds : null
		box.innerHTML=`距离开抢还剩下 ${hours}:${minites}:${seconds}`
	}
	let autoTimer = setInterval(fn, 1000)
	// 从服务器获取服务器时间
	let getServerTime = ()=>{
		let xhr = new XMLHttpRequest()
		xhr.onreadystatechange = ()=>{
			// console.log(xhr.readyState)// head请求方式没有3，不需要等待响应主体
			if(!/^(2|3)\d{2}$/.test(xhr.status)) return
			if(xhr.readyState===2){
				serverTime = (new Date(xhr.getResponseHeader('date'))).getTime()
				fn()
			}
		}
		xhr.open('head','star.xml', true)
		xhr.send(null)
		/**
		 * 获取服务器端时间会有延迟
		 * 优化目的：减少时间差
		 * 服务器返回的时间在响应头信息中有，所以只需要获取响应头
		 * 1.请求方式使用HEAD即可
		 * 2. 必须使用异步编程
		 * 同步编程无法在状态为2或3时处理
		 * 获取响应头在状态为2时就可处理，所以使用异步
		 * 3. 在状态为2时把服务器时间获取到
		 * */
	}
	getServerTime()
}()