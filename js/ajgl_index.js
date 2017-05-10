//		$(":file").filestyle();
$('.modal').modal({
	backdrop: 'static',
	show: false
});



/*主页加载案件主要内容*/
var cur_timestamp = Date.parse(new Date()) / 1000;
var md_token = hex_md5("law_" + hex_md5(cur_timestamp) + "_law");
var ruleName = 'type';
var pageNum=1;
var index = layer.load(2, {
	shade: [0.1, '#337AB7'],
	
});

$(document).ready(function() {
		$.ajax({
			type: "post",
			url: "https://www.ls186.cn/api/public/law/",
			data: {
				service: "Case.case_list",
				time: cur_timestamp,
				token: md_token,
				userid: getSession(0),
				page: pageNum,
				rule: ruleName,
				type: 1
			},
			success: function(data) {
				layer.close(index);
				if(data.ret == 200) {
					var caseMainList = data.data;
					$.each(caseMainList, function(index, ele) {
						//var  time=getLocalTime(1492996644);
						var sgcase = $("<li class='col-md-6'><div class='show_tit'>" + ele.case_title + "<span class='pull-right text-muted'>" + new Date(parseInt(ele.case_ctime) * 1000).toLocaleString().split(' ')[0] + "</span></div></li>");
					    $(".AJBox_main").append(sgcase);
					})

				} else {
					layer.msg(data.msg, {
						icon: 3
					});
				}
			},
			error: function(data) {
				layer.msg("数据加载失败", {
					icon: 5
				})
			}

		});
	})


