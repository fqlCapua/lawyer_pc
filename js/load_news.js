function send_to_export(tag, page) {
	var cur_timestamp = Date.parse(new Date()) / 1000;
	var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
	var index = layer.load(2, {
		shade: [0.1, "#EEEEEE"],
		offset: ['50%', '50%']
	});
	$.ajax({
		type: "post",
		url: "https://www.ls186.cn/law_api",
		async: false,
		data: {
			service: "Message.news_list",
			time: cur_timestamp,
			token: md_token,
			tag: tag,
			page: page

		},
		success: function(data) {
			layer.close(index);
			var data = JSON.parse(data);;
			if(data.ret == 200) {
				var newsList = data.data;

				$.each(newsList, function(i, ele) {
					var news = $("<div news_tag='" + ele.news_tag + "' news_views='" + ele.news_views + "' news_id='" + ele.news_id + "' class='media'><a class='pull-left' href='#'><img style='width:200px;height:100px;margin:5px;' class='media-object' src='" + ele.news_small_thumb + "' alt='Media Object'></a><div class='media-body'><h4 class='media-heading'>" + ele.news_title + "</h4><div class='media-desc'>" + ele.news_desc + "</div><div class='news_ctime text-muted pull-right news_ctime'>" + new Date(parseInt(ele.news_ctime) * 1000).toLocaleString().split(" ")[0] + "</div></div></div>");
					var obj = '#news_' + tag;
					$(obj).append(news)

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

//send_to_export(1,1);
//滚动加载

var news_type = 1;

function load_news(news_type) {
	for(var i = 1; i < 5; i++) {
		send_to_export(news_type, i);
	}

}

function refresh_news(news_type) {
	for(var i = 5; i < 10; i++) {
		send_to_export(news_type, 1);
	}

}
$(function() {
	load_news(news_type)

});
$('#myTab li').one('click', function() {
	var news_type = $(this).attr('tag');
	load_news(news_type);
	//setTimeout("load_news("+news_type+")",5000);
});

//  ========== 
//  = 新闻详情 = 
//  ========== 
$('#myTabContent ').on('click','.media',function() {

	var news_id=$(this).attr('news_id');
	var imgurl=$(this).find('.media-object').attr('src');
		console.log(imgurl);
	var cur_timestamp = Date.parse(new Date()) / 1000;
	var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
	var index = layer.load(2, {
		shade: [0.1, "#EEEEEE"],
		area: ['150px', '80px']
	});
	$.ajax({
		type: "post",
		url: "https://www.ls186.cn/law_api",
		data: {
			service: "Message.news_detail",
			time: cur_timestamp,
			token: md_token,
			news_id: news_id,

		},
		success: function(data) {
			layer.close(index);
			var data = JSON.parse(data);;
			if(data.ret == 200) {
				var ele=data.data;
				var content="<div class='media1'><img  class='media-object' src='" + imgurl + "' alt='Media Object'><div class=''><h4 class='media-heading'>" + ele.news_title + "</h4><div class='"+ele.news_author+"'></div><div class='media-desc'>" + ele.news_content + "</div><div class='news_ctime text-muted pull-right news_ctime'>" + new Date(parseInt(ele.news_ctime) * 1000).toLocaleString().split(" ")[0] + "</div></div></div>";
					layer.open({
						type: 1,
						skin: 'layui-layer-lan', //样式类名
						area:['800px','800px'],
						maxmin: true,
						closeBtn: 1, //不显示关闭按钮
						anim: 2,
						shadeClose: true, //开启遮罩关闭
						content: content
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

})