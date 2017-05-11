$(function(){
	var cur_timestamp=Date.parse(new Date())/1000;
		md_token=hex_md5("law_"+hex_md5(cur_timestamp)+"_law")
	/*获取专家库*/
	
	$.ajax({
		url: 'https://www.ls186.cn/api/public/law/',
		type: 'post',
		data: {
			service: "Service.get_export_list",
			time: cur_timestamp,
			token: md_token,
			page:1
		},
		success: function(data) {
			//layer.close(index);
			if(data.ret == 200) {
				var proList=data.data;
				$.each(proList,function(i,ele){
					var singlePro=$("<span class='"+ele.user_id+"'><img src='img/professor/pro01.png' alt='图片加载出错' title='"+ele.user_name+","+ele.user_phone+ "'/></span>")
					$(".professor_imgKu").append(singlePro);
				})
				
			}else {
				layer.msg("加载出错");
			}
		},
		error: function(xhr, status) {
			
			layer.msg(xhr.status + status);
		}

	})
	/*获取论证项目*/
	var service_type=$(".LzBox li span");
	//  console.log(service_type.length);
	
	service_type.on("click",function(){
       var service_tit=$(this).find(":last-child").html();
		$(".service_tit").html(service_tit);
		var cur_timestamp=Date.parse(new Date())/1000;
		    md_token=hex_md5("law_"+hex_md5(cur_timestamp)+"_law")
		
		 
	})
})

