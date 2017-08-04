var loadCase = function(n, s) {
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
			userid: getSession(0),
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
					//console.log(caseMainList)
					$.each(caseMainList, function(index, ele) {
						var case1 = $("<li class='caseSingle'><div class='case_title show_tit'>" + ele.case_title + "</div><div class='case_id'>" + ele.case_id + "</div><div class='case_uid'>" + ele.case_uid + "</div><div class='case_reason'>" + ele.case_reason + "</div><div class='case_process'>" + ele.case_process + "</div><div class='case_ctime'>" + new Date(parseInt(ele.case_ctime) * 1000).toLocaleString().split(" ")[0] + "</div><div class='case_type'>" + ele.case_type + "</div><div class='case_status'>" + ele.case_status + "</div><div class='dropdown'><a  class='dropdown-toggle' data-toggle='dropdown'>操作<b class='caret'></b></a><ul class='dropdown-menu'><li id='show_case'><a>浏览</a></li><li id='del_case'><a>删除</a></li></ul></div></li>");
						$(".AJBox").append(case1);
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
			layer.msg("数据加载失败", {
				icon: 5
			})
		}

	});
};
loadCase('1', 'time');
/*排序*/
var pageNum = 1;

$("#SortBox").change(function() {
	var SortStr = $("#SortBox option:selected").attr('name');
	var ruleName = String(SortStr.split('SortBy')[1]);

	$(".AJBox").empty()
	loadCase(pageNum, ruleName);
})
$(".prevPage").click(function() {
	var SortStr = $("#SortBox option:selected").attr('name');
	var ruleName = String(SortStr.split('SortBy')[1]);
	if(pageNum == 1) {
		layer.msg("已经是第一页啦！", {
			icon: 0
		})
	} else {
		pageNum -= 1;
		$(".AJBox").empty()
		loadCase(pageNum, ruleName);
	}
})

$(".nextPage").click(function() {
	var SortStr = $("#SortBox option:selected").attr('name');
	var ruleName = String(SortStr.split('SortBy')[1]);
	var isEnd = $(".AJBox li").length;
	if(isEnd < 20) {
		layer.msg("已经到结尾啦！", {
			icon: 0
		})
	} else {
		pageNum += 1;
		$(".AJBox").empty()
		loadCase(pageNum, ruleName);
	}
})

/*获取案件详情*/
function case_detial(case_id) {
	var cur_timestamp = Date.parse(new Date()) / 1000;
	var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
	$.ajax({
		url: 'https://www.ls186.cn/law_api',
		type: 'post',
		data: {
			service: "Case.case_detail",
			time: cur_timestamp,
			token: md_token,
			id: case_id,
		},
		success: function(data) {
			// layer.close(index);
			var data = JSON.parse(data);
			if(data.ret == 200) {

				$("#myCaseDetail").modal('show');
				var case_detail = data.data;
				$("#userID").html(case_detail.case_uname);
				$("#userNum").html(case_detail.case_tel);
				$("#userType").children().eq(case_detail.case_status - 1).attr("selected", "");
				$("#thingtypeNum").children().eq(case_detail.case_case_type - 1).attr("selected", "");
				$("#ThingName").val(case_detail.case_title);
				$("#myModalLabel").attr("class", case_detail.case_id);

			} else {
				layer.msg("加载出错");
			}
		},
		error: function(xhr, status) {

			layer.msg(xhr.status + status);
		}

	})
}

$(".AJBox").delegate("li .show_tit", "click", function() {

	var case_id = $(this).siblings(".case_id").html();
	case_detial(case_id);

})
$(".AJBox").on("click", "li #show_case", function() {

	var case_id = $(this).parent().parent().siblings(".case_id").html();
	case_detial(case_id);

})

//保存案件
$("#save").on("click", function() {
	var cur_timestamp = Date.parse(new Date()) / 1000;
	var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
	var index = layer.load(1, {
		shade: [0.1, 'green']
	});

	$.ajax({
		type: "post",
		url: "https://www.ls186.cn/law_api",
		data: {
			service: "Case.save_case",
			time: cur_timestamp,
			token: md_token,
			id: $("#myModalLabel").attr('class'),
			truename: $("#userID").html(),
			telphone: $("#userNum").html(),
			case_title: $("#ThingName").val(),
			client_tag: getSession(2),
			case_type: $("#thingtypeNum").children("option:selected").index() + 1,
			case_record: cur_timestamp,

		},
		success: function(data) {
			layer.close(index);
			var data = JSON.parse(data);
			if(data.ret == 200) {
				$("#myCaseDetail").modal('hide');
				$(".AJBox").empty();
				loadCase('1', 'time');
			}

		},
		error: function(xhr, status) {
			layer.close(index);

			console.log(xhr.status + status)
		}
	});

});

/*删除案件*/

$(document).on("click", "#del_case", function() {
	var cur_timestamp = Date.parse(new Date()) / 1000;
	var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
	var del_case_id = $(this).parent().parent().siblings(".case_id");

	layer.alert('确定要删除么？', {
		skin: 'layui-layer-molv',
		anim: 4
	}, function() {
		var index = layer.load(1, {
			shade: [0.1, 'blue']
		});
		$.ajax({
			type: "post",
			url: 'https://www.ls186.cn/law_api',
			data: {
				service: "Case.del_case",
				time: cur_timestamp,
				token: md_token,
				id: del_case_id.html()
			},
			success: function(data) {
				layer.close(index);
				var data = JSON.parse(data);
				if(data.ret == 200) {
					$(this).parent().parent().siblings(".case_id").parent().remove();
					layer.msg("已删除！", {
						icon: 1,
						time: 1000
					})
					$(".AJBox").empty()
					//window.location.reload();
					loadCase('1', 'time');
				} else {

					layer.msg("删除失败！", {
						icon: 2
					})
				}

			},
			error: function() {
				layer.close(index);
				layer.msg("删除失败！", {
					icon: 2
				})
			}

		});
	}, function() {

	})

});

/*律师登记新案件*/

$("#DjSubBtn").click(function() {
	var cur_timestamp = Date.parse(new Date()) / 1000;
	var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
	var djcase_uname = $("#djcase_uname").val();
	djcase_tel = $("#djcase_tel").val();
	djcase_name = $("#djcase_name").val();
	djcase_utype = $("#djcase_utype").children("option:selected").index() + 1;
	djcase_type = $("#djcase_type").children("option:selected").index() + 1;
	$("#myDJ").modal("hide");
	var index = layer.load(1, {
		shade: [0.1, 'blue']
	});
	$.ajax('https://www.ls186.cn/law_api', {
		type: 'post',
		data: {
			service: "Case.get_new_id",
			time: cur_timestamp,
			token: md_token,
			id: getSession(0),
			ispc: 1
		},
	}).done(function(data) {
		var data = JSON.parse(data);
		if(data.ret == 200) {

			var id = data.data;

			$.ajax({
				type: 'POST',
				url: 'https://www.ls186.cn/law_api',
				data: {
					service: "Case.save_case",
					time: cur_timestamp,
					token: md_token,
					id: id,
					truename: djcase_uname,
					telphone: djcase_tel,
					case_title: djcase_name,
					client_tag: djcase_utype,
					case_type: djcase_type,

				},
				success: function(data) {
					layer.close(index);
					var data = JSON.parse(data);
					if(data.ret == 200) {
						$("#myDJ").modal('hide');
						layer.msg("登记成功")
						$(".AJBox").empty();
						loadCase('1', 'time');
						$("#djcase_uname").val("");
						$("#djcase_tel").val("");
						$("#djcase_name").val("");

					} else {

						console.log(data.msg);

					}
				},
			});

		} else {
			layer.msg(data.msg)
		}

	}).fail(function(xhr, status) {
		layer.msg(xhr.status + "\n" + status);
	}).always(function() {

	});

})

/*同步案件*/
$("#case_sync").on("click", function() {
	var cur_timestamp = Date.parse(new Date()) / 1000;
	var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
	var userid = getSession(0);
	var index = layer.load(1, {
		shade: [0.1, 'yellow']
	});
	$.ajax({
		type: 'POST',
		url: 'https://www.ls186.cn/law_api',
		data: {
			service: "Index.data_sync",
			time: cur_timestamp,
			token: md_token,
			userid: getSession(0)
		},

		success: function(data) {
			layer.close(index);
			var data = JSON.parse(data);
			if(data.ret == 200) {

				layer.msg("同步成功")
				$(".AJBox").empty();
				loadCase(1, 'time');
			} else {
				layer.msg("同步失败" + data.msg)
				console.log(data.msg)
			}
		},
	});

})

$(".load_icon").hide();
$(".evidence_cont").hide();
$(".process_cont").hide();
$(".remind_cont").hide();
$(".contact_cont").hide();
$(".cost_cont").hide();
$(".writ_cont").hide();
$(".load_icon").hide();
//  ========== 
//  = 证据 = 
//  ========== 

//$("#file-4").eq(0).pause();
//上传
var fileArr = new Array();

function returnStr(obj, case_id) {
	fileArr = [];
	var cur_timestamp = Date.parse(new Date()) / 1000;
	var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
	var fileNum = obj[0].files;
	// console.log(fileNum);
	$.each(fileNum, function(i, ele) {
		var fileData = new FormData();
		// var fileobj=obj[0].files[i];
		fileData.append('service', "Index.upload_file");
		fileData.append('time', cur_timestamp);
		fileData.append('token', md_token);
		fileData.append('file', ele);
		fileData.append('user_id', getSession(0));
		fileData.append('case_id', case_id);
		$.ajax({
			type: "post",
			url: "https://www.ls186.cn/law_api",
			async: false,
			cache: false,
			processData: false,
			contentType: false,
			data: fileData,
			success: function(data) {
				var data = JSON.parse(data);;
				if(data.ret == 200) {
					var str = data.data;

					fileArr.push(str);
				} else {
					layer.msg(data.msg);
				}
			},
			error: function(data) {

				layer.msg(data);
			}
		})

	});
	return fileArr.join(",");
}

$(".evidBtn").click(function() {

	var imgStr = returnStr($('#file-3'));
	var case_id = $("#myModalLabel").attr('class');
	/*保存证据*/
	var title = $(".evid_explain textarea").val();
	var img = returnStr($('#file-3'), case_id);
	var mp3 = returnStr($('#file-4'), case_id);
	var doc = returnStr($('#file-5'), case_id);
	if(title != "") {
		var index = layer.load(1, {

			area: ['100px', '100px'],
			shade: [0.1, 'gray']
		});
		$.ajax({
			type: "post",
			url: "https://www.ls186.cn/law_api",
			data: {
				service: 'Case.add_evidence',
				time: cur_timestamp,
				token: md_token,
				id: $("#myModalLabel").attr('class'),
				title: title,
				img: img,
				mp3: mp3,
				doc: doc
			},
			success: function(data) {
				layer.close(index);
				var data = JSON.parse(data);
				if(data.ret == 200) {
					layer.msg("保存成功")
					$(".programe").children().eq(0).attr('selected', true);
					$(".programeBox").children().hide();
					$("input[type='text']").val('');
					$("input[type='file']").val('');
					$('textarea').val('');
				} else {
					layer.msg(data.msg);
				};
				//setTimeout('window.location.reload()', 500);
			},
			error: function(data) {
				layer.close(index);
			}
		});

	} else {
		layer.msg('描述不能为空');
	}

})

//$(".caret_icon").click(function(){
//	 $(this).parent().siblings().slideToggle();
//})
/*证据列表*/
var flag1 = 0;
$(".evidCont .caret_icon").click(function() {
	if(flag1 % 2 == 0) {

		var cur_timestamp = Date.parse(new Date()) / 1000;
		var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
		var case_id = $("#myModalLabel").attr('class');

		$(this).children(".load_icon").show();
		$(".evidence_cont").empty();
		$.ajax({
			type: "post",
			url: "https://www.ls186.cn/law_api",
			data: {
				service: 'Case.evidence_list',
				time: cur_timestamp,
				token: md_token,
				id: case_id,
			},
			success: function(data) {
				$(".load_icon").hide();
				var data = JSON.parse(data);
				if(data.ret == 200) {

					$(".evidence_cont").empty();
					var list = data.data;
					$.each(list, function(i, ele) {
						var li = $("<li class='list-group-item' evid_id='" + ele.evidence_id + "'><a href='#' class='link_evid'>预览</a>&nbsp;&nbsp;<span>" + ele.evidence_title + "</span><i  class='text-danger fa fa-trash pull-right del_evid'></i></li>\n");
						$(".evidence_cont").append(li);

					})

				}
			}
		});
	} else {

	}
	flag1++;
	$(this).parent().siblings().slideToggle();
});

/*获取证据详情(律师版) √*/
//返回图片元素

function appendImg(imgArr) {
	//var imgArr=imgStr.split(",");
	var objArr = [];
	for(var i = 0; i < imgArr.length; i++) {
		var img = "<img  style='height:150px;height:150px;margin:5px;'  src='http://www.ls186.cn" + imgArr[i] + "'/>";
		objArr.push(img)
	}
	var objStr = objArr.join("");
	return objStr;
}

//返回音视频元素
function appendV(VArr) {
	//var imgArr=imgStr.split(",");
	var objArr = [];
	for(var i = 0; i < VArr.length; i++) {
		var file = "<div ><a href='#'>" + VArr[i].split('/')[VArr[i].split('/').length - 1] + "</a><a target='_blank'  class='pull-right' href='http://www.ls186.cn" + VArr[i] + "'>预览</a></div>";
		objArr.push(file)
	}
	var objStr = objArr.join("");
	return objStr;
}
//返回音视频元素
function appendTxt(txtArr) {
	//var imgArr=imgStr.split(",");
	var objArr = [];
	for(var i = 0; i < txtArr.length; i++) {
		//var file="<div  class=''><a class='pull-left' href='#'>"+txtArr[i].split('/')[txtArr[i].split('/').length - 1]+"</a><a target='_blank'  class='pull-right' href='http://www.ls186.cn"+txtArr[i]+"'>预览</a></div>";
		var file = "<div style=''><a  href='#'>" + txtArr[i].split('/')[txtArr[i].split('/').length - 1] + "</a><a target='_blank'  class='pull-right' href='http://www.ls186.cn" + txtArr[i] + "'>&nbsp;&nbsp;&nbsp;&nbsp;预览</a></div>";
		objArr.push(file)
	}
	var objStr = objArr.join("");
	return objStr;
}
$(".evidence_cont").delegate("li .link_evid", "click", function() {
	var index = layer.load(1, {
		shade: [0.2, 'gray']
	});
	var evid_id = $(this).parent().attr("evid_id");
	var t1 = Date.parse(new Date()) / 1000;
	var md_token = hex_md5("law_" + hex_md5(String(t1)) + "_law");
	$.ajax({
		type: 'POST',
		url: 'https://www.ls186.cn/law_api',
		data: {
			service: 'Case.get_evidence',
			time: t1,
			token: md_token,
			id: evid_id
		},
		dataType: 'json',
		success: function(data) {

			layer.close(index);
			//var data=JSON.parse(data);
			if(data.ret == 200) {
				var detail = data.data;

				var evid_id = detail.evidence_id;

				if(detail.evidence_img != "") {
					var img = appendImg(detail.evidence_img);
				} else {
					var img = "无图片";
				}
				if(detail.evidence_mp3 != "") {
					var mp3 = appendV(detail.evidence_mp3);
				} else {
					var mp3 = "无多媒体文件";
				}
				if(detail.evidence_doc != "") {
					var doc = appendTxt(detail.evidence_doc);
				} else {
					var doc = "无文档";
				}

				layer.open({
					type: 1,
					skin: 'layui-layer-lan', //样式类名
					area: ['50%', '800px'],
					scrollbar: true,
					offset: ['20px', '25%'],

					anim: 2,
					maxmin: true,
					moveOut: true,
					shadeClose: true, //开启遮罩关闭
					content: "<div class='evidence_detialbox' style='padding:20px;'><div  style='margin:0 auto;display:flex;'  class='evidence_img'><label  class='text-info'>图片：</label>" + img + "</div><div><label class='text-info'>音/视频内容：</label>" + mp3 + "</div><div  ><label  class='text-info'>文档内容：</label>" + doc + "</div></div>"
				})
				//<button class='btn btn-sm btn-primary'>删除</button>

				$(".del_evid").attr("name", evid_id);
				//               $(".layui-layer-page  .layui-layer-content").delegate(".del_evid",'click',function(){
				//               	console.log("OK");
				//               })
			} else {
				layer.msg("加载失败，请刷新页面");
			}
		},
		error: function(data) {

		}
	})
})

/*删除证据*/

$(".evidence_cont").delegate("li .del_evid", "click", function() {
	var index = layer.load(1, {
		shade: [0.2, 'gray']
	});
	var evid_id = $(this).parent().attr("evid_id");
	var t1 = Date.parse(new Date()) / 1000;
	var md_token = hex_md5("law_" + hex_md5(String(t1)) + "_law");
	layer.confirm('确定要删除么？', {
		btn: ['是', '否']
	}, function() {
		//console.log("OK");
		$.ajax({
			type: 'POST',
			url: 'https://www.ls186.cn/law_api',
			data: {
				service: 'Case.del_evidence',
				time: t1,
				token: md_token,
				id: evid_id
			},
			dataType: 'json',
			success: function(data) {
				layer.close(index);
				//var data=JSON.parse(data);
				if(data.ret == 200) {
					layer.msg('已删除！！')
					setInterval('window.location.reload()', 500);
				} else {
					layer.msg("删除失败!");
				}
			},
			error: function(data) {
				layer.close(index);
				console.log(data)
			}
		})
	}, function() {
		layer.close(index);

	})

})

/*新增项目样式*/
$(".programeBox").children().hide();
$(".programe").change(function() {

	var proType = $(this).children("option:selected").attr("name");
	if(proType == '') {
		$(".programeBox").children().hide();
	}
	var proType = '#My' + proType;
	if(proType == '') {

	}
	$(proType).show();
	$(proType).siblings().hide();

})
//  ========== 
//  = 流程文书 = 
//  ========== 

/*加载富文本*/
var wangTxt = window.wangEditor;
var editor = new wangTxt('#editor');
editor.customConfig.menus = [
	'head', // 标题
	'bold', // 粗体
	'italic', // 斜体
	'underline', // 下划线
	'strikeThrough', // 删除线
	'foreColor', // 文字颜色

	'link', // 插入链接
	'list', // 列表
	'justify', // 对齐方式
	'quote', // 引用
	'emoticon', // 表情
	'table', // 表格
	'undo', // 撤销

];
// 或者 var editor = new E( document.getElementById('#editor') )
editor.create();
/*加载文书类型*/
$('.load_pro_btn').click(function() {
	parent.editor.txt.html('');
	var iframe_doc = layer.open({
		type: 2,
		area: ['60%', '700px'],
		skin: 'layui-layer-rim',
		title: '文书类型',
		fixed: true, //固定
		maxmin: true,
		content: 'Laws_doc.html'
	});
})
/*新增文书类型*/
$('.save_pro_btn').click(function() {
	var index = layer.load(1, {
		shade: [0.1, 'red']
	});
	var pro_txt = editor.txt.html();
	if(pro_txt != '') {
		var t1 = Date.parse(new Date()) / 1000;
		var md_token = hex_md5("law_" + hex_md5(String(t1)) + "_law");
		// console.log(pro_txt);
		var case_id = $("#myModalLabel").attr('class');
		type_id = $(pro_txt).attr('type_id');
		//console.log(case_id + "  " + type_id);
		name = $(pro_txt).attr('tit');
		$.ajax({
			type: "post",
			url: "https://www.ls186.cn/law_api",

			data: {
				service: 'Case.add_process',
				case_id: case_id,
				type_id: type_id,
				name: name,
				content: pro_txt,
			},

			success: function(data) {
				layer.close(index);
				var data = JSON.parse(data);
				if(data.ret == 200) {
					layer.msg('添加成功');
					$(".programe").children().eq(0).attr('selected', true);
					$(".programeBox").children().hide();
					$("input[type='text']").val('');
					$("input[type='file']").val('');

					$('textarea').val('');
				} else {
					layer.msg(data.msg)
				}
			},
			error: function(data) {
				console.log(data);
			}

		});
	}

})

/*加载流程文书列表*/
var flag2 = 0;
$(".processCont .caret_icon").click(function() {
	if(flag2 % 2 == 0) {
		var cur_timestamp = Date.parse(new Date()) / 1000;
		var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
		var case_id = $("#myModalLabel").attr('class');
		$(this).children(".load_icon").show();
		$(".process_cont").empty();
		$.ajax({
			type: "post",
			url: "https://www.ls186.cn/law_api",
			data: {
				service: 'Case.process_list',
				time: cur_timestamp,
				token: md_token,
				id: case_id,
			},
			success: function(data) {
				$(".load_icon").hide();
				var data = JSON.parse(data);
				if(data.ret == 200) {

					//	console.log('加载成功');
					$(".process_cont").empty();
					var list = data.data;

					$.each(list, function(i, ele) {
						var li = $("<li class='list-group-item' doc_id='" + ele.case_doc_id + "'><a href='#' class='link_doc'>预览</a>&nbsp;&nbsp;<span>" + ele.case_doc_name + "</span><i  class='text-danger fa fa-trash pull-right del_doc'></i></li>\n");
						$(".process_cont").append(li);

					})

				}
			}
		});
	} else {

	}
	flag2++;
	$(this).parent().siblings().slideToggle();
});

/*获取文书详情(律师版) √*/

$('.pro_btn2').hide();
$(".process_cont").delegate("li .link_doc", "click", function() {
	var doc_id = $(this).parent().attr('doc_id');
	//console.log(doc_id);
	$('.save_pro_btn').hide();
	$('.pro_btn2').show();
	editor.txt.html("");
	var index = layer.load(1, {
		shade: [0.2, 'gray']
	});
	var doc_id = $(this).parent().attr("doc_id");
	var t1 = Date.parse(new Date()) / 1000;
	var md_token = hex_md5("law_" + hex_md5(String(t1)) + "_law");
	$.ajax({
		type: 'POST',
		url: 'https://www.ls186.cn/law_api',
		data: {
			service: 'Case.get_doc_data',
			time: t1,
			token: md_token,
			id: doc_id
		},
		dataType: 'json',
		success: function(data) {
			layer.close(index);
			if(data.ret == 200) {
				var detail = data.data;
				var content = detail.case_doc_content;
				$('#Myprocess1').show();
				var content = $("<div></div>");
				// content.attr('doc_id',doc_id);

				content.html(detail.case_doc_content);
				var contentText = content.text();
				editor.txt.html(contentText);
				$('#editor').attr('doc', doc_id);
				$(".del_doc").attr("name", doc_id);

			} else {
				layer.msg("加载失败，请刷新页面");
			}
		},
		error: function(data) {

		}
	})
})
//保存流程文书
$('.pro_btn2').click(function() {
	var doc_id = $('#editor').attr('doc');
	//console.log(doc_id);
	save_doc(doc_id);
})

function save_doc(doc_id) {
	var pro_txt = editor.txt.html();
	if(pro_txt != '') {
		var t1 = Date.parse(new Date()) / 1000;
		var md_token = hex_md5("law_" + hex_md5(String(t1)) + "_law");
		var case_id = $("#myModalLabel").attr('class');
		name = $(pro_txt).attr('tit');
		$.ajax({
			type: "post",
			url: "https://www.ls186.cn/law_api",

			data: {
				service: 'Case.save_process',
				doc_id: doc_id,
				name: name,
				content: pro_txt,
			},

			success: function(data) {

				var data = JSON.parse(data);
				if(data.ret == 200) {
					layer.msg('保存成功');
					$(".programe").children().eq(0).attr('selected', true);
					$(".programeBox").children().hide();
					$('.pro_btn2').hide();
					$('.save_pro_btn').show();
					$("input[type='text']").val('');
					$("input[type='file']").val('');
					$('textarea').val('');

				} else {
					layer.msg(data.msg)
				}
			},
			error: function(data) {
				console.log(data);
			}

		});
	}

}

/*删除流程文书*/

$(".process_cont").delegate("li .del_doc", "click", function() {
	var index = layer.load(1, {
		shade: [0.2, 'gray']
	});
	var evid_id = $(this).parent().attr("doc_id");
	var t1 = Date.parse(new Date()) / 1000;
	var md_token = hex_md5("law_" + hex_md5(String(t1)) + "_law");
	layer.confirm('确定要删除么？', {
		btn: ['是', '否']
	}, function() {

		$.ajax({
			type: 'POST',
			url: 'https://www.ls186.cn/law_api',
			data: {
				service: 'Case.del_case_doc',
				time: t1,
				token: md_token,
				id: evid_id
			},
			dataType: 'json',
			success: function(data) {
				layer.close(index);
				//var data=JSON.parse(data);
				if(data.ret == 200) {
					layer.msg('已删除！！')
					setInterval('window.location.reload()', 500);
				} else {
					layer.msg("删除失败!");
				}
			},
			error: function(data) {
				layer.close(index);
				console.log(data)
			}
		})
	}, function() {
		layer.close(index);

	})

})

//  ========== 
//  = 费用 = 
//  ========== 

/*检验非空*/
var Nullflag;

function checkNull(name) {
	var val = name.val();
	if(val == '') {
		Nullflag = false;
		layer.msg('此项不能为空');
	} else {
		Nullflag = true;
	}
	return Nullflag;
}

/*新增费用*/
$('.cost_tit').blur(function() {
	checkNull($(this))
});
$('.cost_sum').blur(function() {
	checkNull($(this))
})
$('.cost_img').blur(function() {
	checkNull($(this))
})
$('.save_cost_btn').click(function() {
	if(checkNull($('.cost_sum')) && checkNull($(this)) && checkNull($('.cost_img'))) {
		var index = layer.load(1, {
			shade: [0.1, 'red']
		});
		var t1 = Date.parse(new Date()) / 1000;
		var md_token = hex_md5("law_" + hex_md5(String(t1)) + "_law");
		var case_id = $("#myModalLabel").attr('class');
		title = $('.cost_tit').val();
		sum = $(".cost_sum").val();
		content = $('.cost_comment').val();
		img = $('.cost_img').get(0).files[0];
		var costForm = new FormData();
		costForm.append('service', 'Case.add_cost');
		costForm.append('time', 't1');
		costForm.append('token', md_token);
		costForm.append('id', case_id);
		costForm.append('title', title);
		costForm.append('sum', sum);
		costForm.append('comment', content);
		costForm.append('img', img);
		$.ajax({
			type: "post",
			url: "https://www.ls186.cn/law_api",
			cache: false,
			processData: false,
			contentType: false,
			data: costForm,
			success: function(data) {
				layer.close(index);
				var data = JSON.parse(data);
				if(data.ret == 200) {
					layer.msg('添加成功');
					$(".programe").children().eq(0).attr('selected', true);
					$(".programeBox").children().hide();

				} else {
					layer.msg(data.msg)
				}
			},
			error: function(data) {
				layer.close(index);
				console.log(data);
			}

		});
	} else {

	}

})

/*费用列表*/

var flag3 = 0;
$(".costCont .caret_icon").click(function() {
	if(flag3 % 2 == 0) {
		var cur_timestamp = Date.parse(new Date()) / 1000;
		var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
		var case_id = $("#myModalLabel").attr('class');
		$(this).children(".load_icon").show();

		$.ajax({
			type: "post",
			url: "https://www.ls186.cn/law_api",
			data: {
				service: 'Case.cost_list',
				time: cur_timestamp,
				token: md_token,
				id: case_id,
			},
			success: function(data) {
				$(".load_icon").hide();
				var data = JSON.parse(data);
				if(data.ret == 200) {
					//console.log('加载成功');
					$(".cost_cont").empty();
					var list = data.data;
					$.each(list, function(i, ele) {
						var li = $("<li class='list-group-item' cost_id='" + ele.cost_id + "'><a href='#' class='link_cost'>预览</a>&nbsp;&nbsp;<span>" + ele.cost_title + "</span><i  class='text-danger fa fa-trash pull-right del_cost'></i></li>\n");
						$(".cost_cont").append(li);

					})

				}
			}
		});
	} else {

	}
	flag3++;
	$(this).parent().siblings().slideToggle();
});

/*费用详情*/
$(".cost_cont").delegate("li .link_cost", "click", function() {
	var index = layer.load(1, {
		shade: [0.2, 'gray']
	});
	var cost_id = $(this).parent().attr("cost_id");
	var t1 = Date.parse(new Date()) / 1000;
	var md_token = hex_md5("law_" + hex_md5(String(t1)) + "_law");
	$.ajax({
		type: 'POST',
		url: 'https://www.ls186.cn/law_api',
		data: {
			service: 'Case.get_cost',
			time: t1,
			token: md_token,
			id: cost_id
		},
		dataType: 'json',
		success: function(data) {
			layer.close(index);
			if(data.ret == 200) {

				var detail = data.data;

				layer.open({
					title: detail.cost_title,
					type: 1,
					skin: 'layui-layer-lan',
					area: ['600px', '600px'],
					offset: '25px',
					anim: 2,
					shade: false, //开启遮罩关闭
					content: "<div style='padding:10px 20px;'><div style='line-height:30px'>金额：" + detail.cost_sum + "</div><div style='line-height:40px'>描述：" + detail.cost_comment + "</div><div><img   src='http://www.ls186.cn" + detail.cost_img + "'</div></div>"
				});
				$(".del_doc").attr("name", cost_id);

			} else {
				layer.msg("加载失败，请刷新页面");
			}
		},
		error: function(data) {
			layer.close(index);
		}
	})
})

/*删除费用*/
$(".cost_cont").delegate("li .del_cost", "click", function() {
	var index = layer.load(1, {
		shade: [0.2, 'gray']
	});
	var cost_id = $(this).parent().attr("cost_id");
	var t1 = Date.parse(new Date()) / 1000;
	var md_token = hex_md5("law_" + hex_md5(String(t1)) + "_law");
	layer.confirm('确定要删除么？', {
		btn: ['是', '否']
	}, function() {

		$.ajax({
			type: 'POST',
			url: 'https://www.ls186.cn/law_api',
			data: {
				service: 'Case.del_cost',
				time: t1,
				token: md_token,
				id: cost_id
			},
			dataType: 'json',
			success: function(data) {
				layer.close(index);
				//var data=JSON.parse(data);
				if(data.ret == 200) {
					layer.msg('已删除！！')
					setInterval('window.location.reload()', 500);
				} else {
					layer.msg("删除失败!");
				}
			},
			error: function(data) {
				layer.close(index);
				console.log(data)
			}
		})
	}, function() {
		layer.close(index);

	})

})
$('.modal').modal({
	backdrop: 'static',
	show: false
});
//  ========== 
//  = 通讯录相关联系人 = 
//  ========== 

/*新增联系人*/
var cur_timestamp = Date.parse(new Date()) / 1000;
var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");

new Vue({
	el: '#Mycontact1',
	data: {
		contact: {
			service: "Case.add_contact",
			time: Date.parse(new Date()) / 1000,
			token: hex_md5("law_" + hex_md5(String(Date.parse(new Date()) / 1000)) + "_law"),
			id: '',
			name: '',
			mobile: '',
			phone: '',
			email: '',
			address: '',
			comment: '',
		}
	},
	methods: {
		submit: function() {
			this.contact.id = $("#myModalLabel").attr('class');
			var index = layer.load(1, {
				shade: [0.1, 'red']
			});
			$.ajax({
				type: "post",
				url: 'http://www.ls186.cn/Law_api',
				data: this.contact,
				success: function(data) {
					layer.close(index);
					var data = JSON.parse(data);
					if(data.ret == 200) {
						layer.msg('添加成功');
						$(".programe").children().eq(0).attr('selected', true);
						$(".programeBox").children().hide();
						$("input[type='text']").val('');
						$("input[type='file']").val('');
						$('textarea').val('');
					} else {
						layer.msg(data.msg);
					}
				},
				error: function(data, status) {
					layer.close(index);
					layer.msg(status + data);
				}
			});
		}
	}
});
/*联系人列表*/
var flag4 = 0;
$(".contactCont .caret_icon").click(function() {
	if(flag4 % 2 == 0) {
		var cur_timestamp = Date.parse(new Date()) / 1000;
		var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
		var case_id = $("#myModalLabel").attr('class');
		$(this).children(".load_icon").show();

		$.ajax({
			type: "post",
			url: "https://www.ls186.cn/law_api",
			data: {
				service: 'Case.contact_list',
				time: cur_timestamp,
				token: md_token,
				id: case_id,
			},
			success: function(data) {
				$(".load_icon").hide();
				var data = JSON.parse(data);
				if(data.ret == 200) {

					$(".contact_cont").empty();
					var list = data.data;
					$.each(list, function(i, ele) {
						var li = $("<li class='list-group-item' contact_id='" + ele.contact_id + "'><a href='#' class='link_cost'>预览</a>&nbsp;&nbsp;<span>" + ele.contact_name + "</span><i  class='text-danger fa fa-trash pull-right del_contact'></i></li>\n");
						$(".contact_cont").append(li);

					})

				}
			}
		});
	} else {

	}
	flag4++;
	$(this).parent().siblings().slideToggle();
});
/*联系人详情*/
$(".contact_cont").delegate("li .link_cost", "click", function() {
	var index = layer.load(1, {
		shade: [0.2, 'gray']
	});
	var contact_id = $(this).parent().attr("contact_id");
	var t1 = Date.parse(new Date()) / 1000;
	var md_token = hex_md5("law_" + hex_md5(String(t1)) + "_law");
	$.ajax({
		type: 'POST',
		url: 'https://www.ls186.cn/law_api',
		data: {
			service: 'Case.get_contact',
			time: t1,
			token: md_token,
			id: contact_id
		},
		dataType: 'json',
		success: function(data) {
			layer.close(index);
			if(data.ret == 200) {

				var detail = data.data;
				layer.open({
					title: '联系人详情',
					type: 1,
					skin: 'layui-layer-lan',
					area: ['600px', '600px'],
					offset: '25px',
					anim: 2,
					shade: false, //开启遮罩关闭
					content: "<div style='padding:10px 20px;'><div style='line-height:30px'>联系人：" + detail.contact_name + "</div><div style='line-height:30px'>手机：" + detail.contact_phone + "</div><div style='line-height:30px'>E-mail：" + detail.contact_email + "</div><div style='line-height:30px'>住址：" + detail.contact_address + "</div></div>"
				});
				$(".del_contact").attr("name", contact_id);

			} else {
				layer.msg("加载失败，请刷新页面");
			}
		},
		error: function(data) {
			layer.close(index);
		}
	})
})
/*提醒列表*/
var flag5 = 0;
$(".remindCont .caret_icon").click(function() {
	if(flag5 % 2 == 0) {
		var cur_timestamp = Date.parse(new Date()) / 1000;
		var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
		var case_id = $("#myModalLabel").attr('class');
		$(this).children(".load_icon").show();

		$.ajax({
			type: "post",
			url: "https://www.ls186.cn/law_api",
			data: {
				service: 'Case.case_remind',
				time: cur_timestamp,
				token: md_token,
				id: case_id,
			},
			success: function(data) {
				$(".load_icon").hide();
				var data = JSON.parse(data);
				if(data.ret == 200) {

					$(".remind_cont").empty();
					var list = data.data;
					$.each(list, function(i, ele) {
						var li = $("<li class='list-group-item' remind_comment='" + ele.remind_comment + "' remind_first='" + ele.remind_first + "' remind_second='" + ele.remind_second + "' remind_first_isoff='" + ele.remind_first_isoff + "' remind_second_isoff='" + ele.remind_second_isoff + "' remind_third_isoff='" + ele.remind_third_isoff + "' remind_third='" + ele.remind_third + "' remind_id='" + ele.remind_id + "'><a href='#' class='link_remind'>预览</a>&nbsp;&nbsp;<span>" + ele.remind_title + "</span><i  class='text-danger fa fa-trash pull-right del_remind'></i></li>\n");
						$(".remind_cont").append(li);

					})

				}
			}
		});
	} else {

	}
	flag5++;
	$(this).parent().siblings().slideToggle();
});
/*新增提醒*/
var cur_timestamp = Date.parse(new Date()) / 1000;
var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
new Vue({
	el: '#Myremind1',
	data: {
		remind: {
			service: "Case.add_remind",
			time: Date.parse(new Date()) / 1000,
			token: hex_md5("law_" + hex_md5(String(Date.parse(new Date()) / 1000)) + "_law"),
			id: '',
			title: '',
			comment: '',
			first: '',
			second: '',
			third: ''

		}
	},
	methods: {
		submit: function() {
			this.remind.id = $("#myModalLabel").attr('class');
			this.remind.first = new Date($('.remindfirst').val()).getTime() / 1000;
			var index = layer.load(1, {
				shade: [0.1, 'red']
			});
			$.ajax({
				type: "post",
				url: 'http://www.ls186.cn/Law_api',
				data: this.remind,
				success: function(data) {
					layer.close(index);
					var data = JSON.parse(data);
					if(data.ret == 200) {
						layer.msg('添加成功');
						$(".programe").children().eq(0).attr('selected', true);
						$(".programeBox").children().hide();
						$("input[type='text']").val('');

						$('textarea').val('');
					} else {
						layer.msg(data.msg);
					}
				},
				error: function(data, status) {
					layer.close(index);
					layer.msg(status + data);
				}
			});
		}
	}
});

function getLocalTime(nS) {
	return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
}
/*提醒详情*/
$(".remind_cont").delegate("li .link_remind", "click", function() {
	var obj = $(this).parent();
	var remind_title = obj.find('span').html();
	remind_comment = obj.attr('remind_comment');
	remind_first = getLocalTime(obj.attr('remind_first'));
	remind_second = getLocalTime(obj.attr('remind_first'));
	remind_third = getLocalTime(obj.attr('remind_first'));
	remind_first_isoff = obj.attr('remind_first_isoff');
	remind_second_isoff = obj.attr('remind_second_isoff');
	remind_third_isoff = obj.attr('remind_third_isoff');
	if(remind_first_isoff == '0') {
		remind_first_isoff = '关闭';
	} else {
		remind_first_isoff = '开启';
	};

	//	if(remind_second=='1'){
	//		remind_second==''
	//	}
	if(remind_second_isoff == '1') {
		remind_second_isoff = '开启';

	} else {
		remind_second_isoff = '关闭';
	};

	if(remind_third_isoff == '0') {
		remind_third_isoff = '开启';
	} else {

		remind_third_isoff = '关闭';
	};

	var content = "<div style='padding:10px;'><div><label class='col-md-2'>标题：</label><span class='col-md-10'>" + remind_title + "</span></div><div class='clearfix'><label class='col-md-2'>说明:</label><span classs='col-md-10'>" + remind_comment + "</span></div><div><label class='col-md-3'>第一次提醒：</label><span class='col-md-5'>" + remind_first + "</span><label class='col-md-4'>" + remind_first_isoff + "</label></div><div><label class='col-md-3'>第二次提醒：</label><span class='col-md-5' >" + remind_second + "</span><label class='col-md-4'>" + remind_second_isoff + "</label></div><div><label class='col-md-3'>第三次提醒：</label> <span class='col-md-5' >" + remind_third + "</span><label class='col-md-4'>" + remind_third_isoff + "</label></div> </div>";

	layer.open({
		type: 1,
		title: '提醒详情',
		closeBtn: 1,
		area: ['600px', '500px'],
		shadeClose: true,
		content: content
	});

})

/*删除提醒*/
$(".remind_cont").delegate("li .del_remind", "click", function() {
	var index = layer.load(1, {
		shade: [0.2, 'gray']
	});
	var remind_id = $(this).parent().attr("remind_id");
	var t1 = Date.parse(new Date()) / 1000;
	var md_token = hex_md5("law_" + hex_md5(String(t1)) + "_law");
	layer.confirm('确定要删除么？', {
		btn: ['是', '否']
	}, function() {

		$.ajax({
			type: 'POST',
			url: 'https://www.ls186.cn/law_api',
			data: {
				service: 'Case.del_remind',
				time: t1,
				token: md_token,
				id: remind_id
			},
			dataType: 'json',
			success: function(data) {
				layer.close(index);
				//var data=JSON.parse(data);
				if(data.ret == 200) {
					layer.msg('已删除！！')
					setInterval('window.location.reload()', 500);
				} else {
					layer.msg("删除失败!");
				}
			},
			error: function(data) {
				layer.close(index);
				console.log(data)
			}
		})
	}, function() {
		layer.close(index);

	})

})

//文书列表
var flag6 = 0;
$(".writCont .caret_icon").click(function() {
	if(flag6 % 2 == 0) {
		var cur_timestamp = Date.parse(new Date()) / 1000;
		var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
		var case_id = $("#myModalLabel").attr('class');
		$(this).children(".load_icon").show();

		$.ajax({
			type: "post",
			url: "https://www.ls186.cn/law_api",
			data: {
				service: 'Case.writ_list',
				time: cur_timestamp,
				token: md_token,
				id: case_id,
			},
			success: function(data) {
				$(".load_icon").hide();
				var data = JSON.parse(data);
				if(data.ret == 200) {

					$(".writ_cont").empty();
					var list = data.data;
				
					$.each(list, function(i, ele) {
						var li = $("<li class='list-group-item' writ_id='" + ele.writ_id + "'><a href='#' class='link_writ'>预览</a>&nbsp;&nbsp;<span>" + ele.writ_title + "</span><i  class='text-danger fa fa-trash pull-right del_writ'></i></li>");
						$(".writ_cont").append(li);

					})

				} else {
					layer.msg(data.msg);
				}
			}
		});
	} else {

	}
	flag6++;
	$(this).parent().siblings().slideToggle();
});

//  ========== 
//  = 新增法律文书 = 
//  ========== 

$(".writ_btn").click(function(){
			var cur_timestamp = Date.parse(new Date()) / 1000;
			var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
			var case_id = $("#myModalLabel").attr('class');
			var title = $('.writ_title').val();
			if(title != '' && $('.writ_file').val() != '') {
				var writ = returnStr($('#law_pic_file'), case_id);
			
				$.ajax({
						type: "post",
						url: "https://www.ls186.cn/law_api",
						data: {
							service: "Case.add_writ",
							time: cur_timestamp,
							token: md_token,
							id:case_id,
							title: title,
							img:writ

						},
						success: function(data) {
							
							var data = JSON.parse(data);;
							if(data.ret == 200) {
                                 layer.msg('提交成功');
                                       $(".programe").children().eq(0).attr('selected', true);
						                $(".programeBox").children().hide();
					       	              $("input[type='text']").val('');
					       	               $("input[type='file']").val('');
							} else {
								layer.msg(data.msg);
							}
						},
						error: function(data) {
							
							layer.msg(data);
						}

					});
				    
					
				} else {
						layer.msg('请完善内容..');
					}
				})

//法律文书详情		

$(".writ_cont").delegate("li .link_writ", "click", function() {
	var index = layer.load(1, {
		shade: [0.2, 'gray']
	});
	var writ_id = $(this).parent().attr("writ_id");
	var t1 = Date.parse(new Date()) / 1000;
	var md_token = hex_md5("law_" + hex_md5(String(t1)) + "_law");
	$.ajax({
		type: 'POST',
		url: 'https://www.ls186.cn/law_api',
		data: {
			service: 'Case.writ_detail',
			time: t1,
			token: md_token,
			id: writ_id
		},
		dataType: 'json',
		success: function(data) {
			layer.close(index);
			if(data.ret == 200) {
                 var detail = data.data;
                
                 var content="<div style='padding:10px 20px;'><div style='line-height:30px'>标题：" + detail.writ_title + "</div><div>副本："+ appendImg(detail.writ_img)+ "</div><div>";    
				layer.open({
					title: '文书详情',
					type: 1,
					skin: 'layui-layer-lan',
					area: ['600px', '600px'],
					offset: '25px',
					anim: 2,
					shade: false, //开启遮罩关闭
					content:content                                                                                       
				});
				$(".del_writ").attr("name", writ_id);

			} else {
				layer.msg(data.msg);
			}
		},
		error: function(data) {
			layer.close(index);
		}
	})
})

/*删除文书*/
$(".writ_cont").delegate("li .del_writ", "click", function() {
	var index = layer.load(1, {
		shade: [0.2, 'gray']
	});
	var writ_id = $(this).parent().attr("writ_id");
	var t1 = Date.parse(new Date()) / 1000;
	var md_token = hex_md5("law_" + hex_md5(String(t1)) + "_law");
	layer.confirm('确定要删除么？', {
		btn: ['是', '否']
	}, function() {

		$.ajax({
			type: 'POST',
			url: 'https://www.ls186.cn/law_api',
			data: {
				service: 'Case.del_writ',
				time: t1,
				token: md_token,
				id: writ_id
			},
			dataType: 'json',
			success: function(data) {
				layer.close(index);
				//var data=JSON.parse(data);
				if(data.ret == 200) {
					layer.msg('已删除！！')
					setInterval('window.location.reload()', 500);
				} else {
					layer.msg("删除失败!");
				}
			},
			error: function(data) {
				layer.close(index);
				console.log(data)
			}
		})
	}, function() {
		layer.close(index);

	})

})
