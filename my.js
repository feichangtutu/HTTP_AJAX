/**
 * Created by jyn on 2018/8/7.
 */
ajax({
	url:'./test.json',
	cache : false,
	method: 'post',
	data:{
		name : 'jyn',
		age: 20
	},
	success: result => {
		console.log(result)
	}
})