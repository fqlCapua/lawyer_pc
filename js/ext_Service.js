$('.service1').click(function() {
	layer.open({
		type: 2,
		title: '服务详情',
		shadeClose: true,
		shade: 0.8,
		area: ['580px', '70%'],
		content: 'laws_professor.html'
	});
});
//加载案件列表
function case_lawyer(n, s, userid) {
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
			service: "Case.case_list",
			time: cur_timestamp,
			token: md_token,
			userid: userid,
			page: n,
			rule: s,
			type: 1
		},
		success: function(data) {
			layer.close(index);
			var data = JSON.parse(data);
			if(data.ret == 200) {
				var caseMainList = data.data;

				if(caseMainList == '') {
					layer.msg("没有数据了", {
						icon: 5
					});
				} else {
					$.each(caseMainList, function(index, ele) {
						var tr = $("<tr class='paCase'  case_id='" + ele.case_id + "'><td><input class='childcase' type='checkbox' /></td><td>" + ele.case_title + "</td></tr>");
						$(".caseSelect table").append(tr);
					})
				}
			} else {
				layer.msg(data.msg, {
					icon: 3
				});
			}
		},
		error: function(data) {
			layer.close(index);
			layer.msg("数据加载失败");
		}

	});
}

function case_client(userid) {
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
			service: "Office.client_case_list",
			time: cur_timestamp,
			token: md_token,
			userid: userid,
			type: 1
		},
		success: function(data) {
			layer.close(index);
			var data = JSON.parse(data);;
			if(data.ret == 200) {
				var caseMainList = data.data;
				if(caseMainList == '') {
					layer.msg("没有数据", {
						icon: 5
					});
				} else {
					cosnole.log(caseMainList)
					$.each(caseMainList, function(index, ele) {
						var tr = $("<tr class='paCase'  case_id='" + ele.case_id + "'><td><input class='childcase'  type='checkbox' /></td><td>" + ele.case_title + "</td></tr>");
						$(".caseSelect table").append(tr);
					})
				}
			} else {

				layer.msg(data.msg, {
					icon: 3
				});
			}
		},
		error: function(data) {
			layer.close(index);
			layer.msg("数据加载失败");
		}

	});
}
$(function() {
	$(".caseSelect").show();
	var userid = getSession(0);
	var ss = window.sessionStorage;
	if(ss.getItem("law_sign")) {
		var jsonTxt = JSON.parse(ls.getItem('law_sign'));
		var jsonStr = jsonTxt[jsonTxt.length - 1].law_law;
		$(".caseSelect table").find(".paCase").remove();
		if(jsonStr.split("_")[2] == 6) {
			case_client(userid);

		} else {
			case_lawyer(1, 'time', userid);
		}

	} else {
		layer.msg('请先登录');
	}
})

$(function() {

})
$('.caseSend').click(function() {
	$(".caseSelect").show();
	var userid = getSession(0);
	var ss = window.sessionStorage;
	if(ss.getItem("law_sign")) {
		var jsonTxt = JSON.parse(ls.getItem('law_sign'));
		var jsonStr = jsonTxt[jsonTxt.length - 1].law_law;
		$(".caseSelect table").find(".paCase").remove();
		if(jsonStr.split("_")[2] == 6) {
			case_client(userid);

		} else {
			case_lawyer(1, 'time', userid);
		}

	} else {
		layer.msg('请先登录');
	}

})
//$(".caseSelect .table").delegate('tr','click',function(){
//	console.log('OK');
//});
//加载个人信息

function load_user() {
	var userObj = {};
	var curtime = Math.round(new Date() / 1000);
	var md_token = hex_md5("law_" + hex_md5(String(curtime)) + "_law");
	$.ajax({
		type: "post",
		url: "https://www.ls186.cn/law_api",
		async: false,
		data: {
			service: "User.get_user_info",
			time: curtime,
			token: md_token,
			async: false,
			id: getSession(0)

		},
		success: function(data) {
			var data = JSON.parse(data);
			if(data.ret == 200) {

				return userObj = data.data;
				//$('.UserInfo').html(data.data);

			} else {

			}
		},
		error: function() {

		}
	});
	if(userObj.office_title){
		
	}else{
		
	}
}

function send_to_export(caseString) {
	var cur_timestamp = Date.parse(new Date()) / 1000;
	var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
	console.log(cur_timestamp+"——————————————————"+md_token);
	var index = layer.load(2, {
		shade: [0.1, "#EEEEEE"],
		offset: ['50%', '50%']
	});
	$.ajax({
		type: "post",
		url: "https://www.ls186.cn/law_api",
		
		data: {
			service: "Case.send_to_export",
			time: cur_timestamp,
			token: md_token,
			id: caseString,
		},
		success: function(data) {
			
			layer.close(index);
			var data = JSON.parse(data);;
			if(data.ret == 200) {
				layer.msg('已发送');
			} else {
				layer.msg(data.msg);
			}
		},
		error: function(data) {
			layer.close(index);

		}
	})
};

//发送给律所审批
function send_to_office(caseString) {
	var cur_timestamp = Date.parse(new Date()) / 1000;
	var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
	var index = layer.load(2, {
		shade: [0.1, "#EEEEEE"],
		offset: ['50%', '50%']
	});
	$.ajax({
		type: "post",
		url: "http://www.ls186.cn/law_api",
		
		data: {
			service: "Case.submit_for_check",
			time: cur_timestamp,
			token: md_token,
			id: caseString,

		},
		success: function(data) {
			layer.close(index);
			var data = JSON.parse(data);;
			if(data.ret == 200) {
				layer.msg('已发送');
			} else {
				layer.msg(data.msg);
			}
		},
		error: function(data) {
			layer.close(index);

		}
	})
}

var idArr = new Array();

//选中单个案件

$('.send_export').click(function() {

	var tr = $(this).parents().siblings('.table').find('.paCase');
     for(var i = 0; i < tr.length; i++) {
		if($(tr[i]).find('.childcase').is(':checked')) {
			var id = $(tr[i]).attr('case_id');
			idArr.push(id);
            
		}
    
	}
	var caseString = idArr.join(',');
	   console.log(caseString);
	send_to_export(caseString);

})
//发送审批事件
$('.send_office').click(function() {

	if(load_user().office_title!=undefined) {
	var tr = $(this).parents().siblings('.table').find('.paCase');

	for(var i = 0; i < tr.length; i++) {
		if($(tr[i]).find('.childcase').is(':checked')) {
			var id = $(tr[i]).attr('case_id');
			idArr.push(id)

		}

	}
	var caseString = idArr.join(',');
	send_to_office(caseString);
	} else {
		layer.msg('你还未加入任何律所');
	}
	

})