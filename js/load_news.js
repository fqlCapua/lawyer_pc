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
				var newsList=data.data;
				$.each(newsList, function(i,ele){
				        var news=$("<div news_tag='"+ele.news_tag+"' news_views='"+ele.news_views+"' news_id='"+ele.news_id+"' class='media'><a class='pull-left' href='#'><img style='width:200px;height:100px;margin:5px;' class='media-object' src='"+ele.news_small_thumb+"' alt='Media Object'></a><div class='media-body'><h4 class='media-heading'>"+ele.news_title+"</h4><div class='media-desc'>"+ele.news_desc+"</div><div class='news_ctime text-muted pull-right news_ctime'>"+new Date(parseInt(ele.news_ctime) * 1000).toLocaleString().split(" ")[0]+"</div></div></div>");
					$('#home').append(news);
				});
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