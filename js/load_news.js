function send_to_export(tag,page){
	
	var cur_timestamp = Date.parse(new Date()) / 1000;
    var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
	var index = layer.load(2, {
		shade: [0.1, "#EEEEEE"],
		offset: ['50%', '50%']
	});
	$.ajax({
		type: "post",
		url: "https://www.ls186.cn/law_api",
		data: {
			service: "Message.news_list",
			time: cur_timestamp,
			token: md_token,
			tag:tag,
			page:page
			
		},
		success: function(data) {
		   layer.close(index);
		   var data=JSON.parse(data);;
		   if(data.ret == 200) {
				console.log(data.data);
			} else {
				layer.msg(data.msg);
			}
		},
		error: function(data) {
			layer.close(index);
			layer.msg(data);
		}
})


}
send_to_export(1,1);