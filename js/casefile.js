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
				} else{
					//console.log(caseMainList)
					$.each(caseMainList, function(index, ele) {
						var case1 = $("<li class='caseSingle'><div class='case_title show_tit'>" + ele.case_title + "</div><div class='case_id'>" + ele.case_id + "</div><div class='case_uid'>" + ele.case_uid + "</div><div class='case_reason'>" + ele.case_reason + "</div><div class='case_process'>" + ele.case_process + "</div><div class='case_ctime'>" + new Date(parseInt(ele.case_ctime) * 1000).toLocaleString().split(" ")[0] + "</div><div class='case_type'>" + ele.case_type + "</div><div class='case_status'>" + ele.case_status + "</div><div class='dropdown'><a  class='dropdown-toggle' data-toggle='dropdown'>编辑<b class='caret'></b></a><ul class='dropdown-menu'><li id='del_case'><a>删除</a></li></ul></div></li>");
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

$(".AJBox").delegate("li .show_tit", "click", function() {

	var cur_timestamp = Date.parse(new Date()) / 1000;
	var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
	var case_id = $(this).siblings(".case_id").html();
	// var index = layer.load(1, {
	// 	shade: [0.1, 'darkblue']
	// });
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
			layer.close(index);
			layer.msg(xhr.status + status);
		}

	})

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

$(".evidBtn").click(function () {

    var index=layer.load(0,{shade:[0.1,'#000']});
	     /*保存证据*/
				var title = $(".evid_explain textarea").val();
				var img = $("#file-3")[0].files[0];
				var mp3 = $("#file-4")[0].files[0];
				var doc = $("#file-5")[0].files[0];
				if(title != "") {
					var form1 = new FormData();
					form1.append("service", "Case.add_evidence");
					form1.append("time", cur_timestamp);
					form1.append("token", md_token);
					form1.append("id", $("#myModalLabel").attr('class'));
					form1.append("title", title);
					if($("#file-3").val()!=""){
						form1.append("img", img);
					}
					if($("#file-4").val()!=""){
						form1.append("mp3", mp3);
					}
					if($("#file-5").val()!=""){
						form1.append("doc", doc);
					}
				
					$.ajax({
						type: "post",
						url: "https://www.ls186.cn/law_api",
						cache: false,
						processData: false,
						contentType: false,
						data: form1,
						success: function(data) {
							layer.close(index);
							var data=JSON.parse(data);
							if(data.ret == 200) {
								layer.msg("保存成功")
								
							} else {
								layer.msg('保存证据失败')
							};
						 setTimeout('window.location.reload()',500);
						}
					});

				}
				
})

//结束

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
						if($(".djevid_explain textarea").val() != '') {
							//||$("#file-6").attr("src")!=""||$("#file-3").attr("src")!=""||$("#file-6").attr("src")
							var title = $(".djevid_explain textarea").val();
							var img = $("#file-6")[0].files[0];
							var mp3 = $("#file-7")[0].files[0];
							var doc = $("#file-8")[0].files[0];
						
							var form1 = new FormData();
							form1.append("service", "Case.add_evidence");
							form1.append("time", cur_timestamp);
							form1.append("token", md_token);
							form1.append("id", id);
							form1.append("title", title);
							if($("#file-6").val()!=""){
						form1.append("img", img);
					}
					if($("#file-7").val()!=""){
						form1.append("mp3", mp3);
					}
					if($("#file-8").val()!=""){
						form1.append("doc", doc);
					}
					
							$.ajax({
								type: "post",
								url: "https://www.ls186.cn/law_api",
								cache: false,
								processData: false,
								contentType: false,
								data: form1,
								success: function(data) {
									var data = JSON.parse(data);
									if(data.ret == 200) {
										layer.msg("新增证据成功!");
										console.log(data.data);
										$(".djevid_explain textarea").val(" ");
										$(".file-input").empty();

									} else {
										layer.msg(data.msg);
									}
								}
							});
						}

						$("#djcase_uname").val("");
						$("#djcase_tel").val("");
						$("#djcase_name").val("");

						layer.msg("登记成功")
						$(".AJBox").empty();
						loadCase('1', 'time');

					} else {
						layer.msg("登记新案件失败" + data.msg)
						console.log(data.msg);
						//						
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
	var index = layer.load(2, {
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

/*新增证据*/
$(".load_icon").hide();
$(".evidence_cont").hide();
$(".process_cont").hide();
$(".remind_cont").hide();
$(".contact_cont").hide();
$(".cost_cont").hide();
$(".load_icon").hide();

//$(".caret_icon").click(function(){
//	 $(this).parent().siblings().slideToggle();
//})
/*证据列表*/
var flag = 0;
$(".evidCont .caret_icon").click(function() {
	if(flag % 2 == 0) {

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

					layer.msg('加载成功');
					$(".evidence_cont").empty();
					var list = data.data;
					$.each(list, function(i, ele) {
						var li = $("<li class='list-group-item' evid_id='"+ele.evidence_id+"'><i class='link_evid fa fa-paper-plane'></i>&nbsp;&nbsp;<span>" + ele.evidence_title + "</span><i  class='text-danger fa fa-trash pull-right del_evid'></i></li>\n");
						$(".evidence_cont").append(li);

					})

				}
			}
		});
	} else {

	}
	flag++;
	$(this).parent().siblings().slideToggle();
});

/*获取证据详情(律师版) √*/

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
			
			 var detail=data.data;
             var evid_id=detail.evidence_id;
            
              if(detail.evidence_img!=""){
              	 var img="http://www.ls186.cn"+String(detail.evidence_img);
              }else{
              	var img="";
              }
             if(detail.evidence_mp3!=""){
             	 var mp3="http://www.ls186.cn"+String(detail.evidence_mp3);
             }else{
             	var mp3="";
             }
             if(detail.evidence_doc!=""){
             	 var doc=String(detail.evidence_doc);
                 var file_name=doc.split('/')[doc.split('/').length-1];
             }else{
             	var doc="";
             }
				//$("#myCaseDetail").modal('hide');
				var open1=layer.open({
					title:"证据详情",
					type: 1,
					skin: 'layui-layer-lan', //样式类名
					area:['400px','600px'],
					offset: '25px',
					anim: 2,
					shadeClose: true, //开启遮罩关闭
                    content:"<div class='evidence_detialbox' style='padding:20px;'><div class='text-title evidence_title  text-center'>"+detail.evidence_title+"</div><img  style='margin:0 auto;' class='evidence_img' src='"+img+"' alt='无图片'/><div><label>音频内容：</label><audio controls  class='evidence_mp3' src='"+mp3+"'/></div><div><label>文件内容：</label><span class='evidence_doc'><a  target='_blank' href='http://www.ls186.cn"+doc+"'>"+file_name+"</a></span><div class='pull-right'><a style='font-weight:bold;' target='_blank' href='http://www.ls186.cn"+doc+"'>预览</a></div></div>",
				});
//<button class='btn btn-sm btn-primary'>删除</button>
				    

                 $(".del_evid").attr("name",evid_id);
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
	layer.confirm('确定要删除么？',{
		btn:['是','否']},function () {
			console.log("OK");
				$.ajax({
		type: 'POST',
		url: 'https://www.ls186.cn/law_api',
		data: {
			service: 'Case.del_evidence',
			time: t1,
			token: md_token,
			id: evid_id
		},
		dataType:'json',
		success: function(data) {

			layer.close(index);
		    //var data=JSON.parse(data);
			if(data.ret == 200) {
			 layer.msg('已删除！！')
			 setInterval('window.location.reload()',500);
			}
			else{
               layer.msg("删除失败!");
			}
		},
		error: function(data) {
		layer.close(index);
		console.log(data)
		}
	})
		},function () {
		console.log("不删除了！！");
		}
	)



})


/*新增证据*/
$(".programeBox").children().hide();
$(".programe").change(function() {
	
	$('.pro_cont').val('');
	
	var proType = $(this).children("option:selected").attr("name");
	var proType = '#My' + proType;
	$(proType).show();
	$(proType).siblings().hide();
		

})

/*流程文书*/
var flag = 0;
$(".processCont .caret_icon").click(function() {
	if(flag % 2 == 0) {

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

					layer.msg('加载成功');
					$(".evidence_cont").empty();
					var list = data.data;
					$.each(list, function(i, ele) {
						var li = $("<li class='list-group-item' evid_id='"+ele.evidence_id+"'><i class='link_evid fa fa-paper-plane'></i>&nbsp;&nbsp;<span>" + ele.evidence_title + "</span><i  class='text-danger fa fa-trash pull-right del_evid'></i></li>\n");
						$(".evidence_cont").append(li);

					})

				}
			}
		});
	} else {

	}
	flag++;
	$(this).parent().siblings().slideToggle();
});

/*获取文书类型开始*/
// $(".doc_load").hide()
// $(document).ready(function() {
// 	var t1 = Math.round(new Date() / 1000);
// 	var md_token = hex_md5("law_" + hex_md5(t1) + "_law");

// 	$(".pro_case_type").change(function() {
// 		$(".doc_load").show();
// 		var index = $(this).get(0).selectedIndex;
// 		$(".pro_doc_type").empty();
// 		$.ajax({
// 			type: "post",
// 			url: "https://www.ls186.cn/law_api",
// 			data: {
// 				service: 'Case.get_doc_type',
// 				time: t1,
// 				token: md_token,
// 				id: index
// 			},
// 			success: function(data) {
// 				$(".doc_load").hide();
// 				if(data.ret == 200) {
// 					var list = data.data;
// 					$.each(list, function(i, ele) {
// 						var type_name = $("<option name='" + ele.doc_type_id + "'>" + ele.doc_type_name + "</option>");
// 						$(".pro_doc_type").append(type_name);
// 					});

// 				} else {
// 					console.log(data.msg)
// 				}
// 			},
// 			error: function(data) {
// 				console.log(data);
// 			}

// 		});

// 	});
// });

$('.modal').modal({
			backdrop: 'static',
			show: false
		});