//		$(":file").filestyle();
$('.modal').modal({
	backdrop: 'static',
	show: false
});



/*主页加载案件主要内容*/

var ruleName = 'type';
var pageNum=1;
var index = layer.load(2, {
	shade: [0.1, '#337AB7'],
	offset:['50%','50%']
	
});

$(document).ready(function() {
	var cur_timestamp = Math.round(new Date()/ 1000);
    var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
            
        
		$.ajax({
			type: "post",
			url: "https://www.ls186.cn/law_api/",
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
				layer.close(index);var data=JSON.parse(data);;
				
				if(data.ret==200) {
					var caseMainList = data.data;
					
					$.each(caseMainList, function(index, ele) {
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


