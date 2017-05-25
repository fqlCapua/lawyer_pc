$(function(){
	var cur_time=Math.round(new Date()/1000);
	var md_token = hex_md5("law_" + hex_md5(String(cur_time)) + "_law");
	var index=layer.load(1,{shade:[0.1,'red']});
	$.ajax({
		type:"post",
		url:"https://www.ls186.cn/law_api",
		data:{
			service:'Laws.get_laws_category',
			time:cur_time,
			token:md_token,
			
		},
		success:function(data){
			layer.close(index);
			var data=JSON.parse(data);
			console.log(data.data);
			var laws_list=data.data;
			var spans=$("#laws_menu li span");
			for (var i = 0; i < spans.length; i++) {
				spans[i].html(data.data[i].laws_cate_name);
				spans[i].attr("laws_cate_id",data.data[i].laws_cate_id);
			}
		}
	});
})
