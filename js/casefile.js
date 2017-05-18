

var loadCase = function(n, s) {
	var cur_timestamp = Date.parse(new Date()) / 1000;
var md_token = hex_md5("law_" + hex_md5(cur_timestamp) + "_law");
	var index = layer.load(2, {
		shade: [0.1, "#EEEEEE"],
		offset: ['50%', '50%']
	});
	$.ajax({
		type: "post",
		url: "https://www.ls186.cn/api/public/law/",
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
		   layer.close(index)
			if(data.ret == 200) {
				var caseMainList = data.data;
				
				if(caseMainList == '') {
					layer.msg("没有数据了", {
						icon: 5
					});
				} else {
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

$(".AJBox").delegate("li .show_tit", "click", function() {
	alert($(this).siblings(".case_id").html())//案件

	var cur_timestamp = Date.parse(new Date()) / 1000;
    var md_token = hex_md5("law_" + hex_md5(cur_timestamp) + "_law");
	var case_id = $(this).siblings(".case_id").html();

	
	var index = layer.load(1, {
		            shade: [0.1, 'darkblue']
	           });
	$.ajax({
		url: 'https://www.ls186.cn/api/public/law/',
		type: 'post',
		data: {
			service: "Case.case_detail",
			time: cur_timestamp,
			token: md_token,
			id: case_id,
		},
		success: function(data) {
			layer.close(index);
			if(data.ret == 200) {
				
				$("#myCaseDetail").modal('show');
				var case_detail = data.data;
				$("#userID").html(case_detail.case_uname);
				$("#userNum").html(case_detail.case_tel);
				$("#userType").children().eq(case_detail.case_status-1).attr("selected", "");
				$("#thingtypeNum").children().eq(case_detail.case_case_type-1).attr("selected", "");
				$("#ThingName").val(case_detail.case_title);
				$("#myModalLabel").attr("class",case_detail.case_id);
				
	
			} else {
				layer.msg("加载出错");
			}
		},
		error: function(xhr, status) {
			layer.close(index);
			alert(xhr.status + status);
		}

	})

})

//保存案件
				$("#save").on("click", function() {
					
	                   var index = layer.load(1, {
		                  shade: [0.1, 'green']
	                }); 
	                
	                $.ajax({
	                	type:"post",
	                	url:"https://www.ls186.cn/api/public/law/",
	                	data:{
	                		service: "Case.save_case",
			                time: cur_timestamp,
			                token: md_token,
			                id: $("#myModalLabel").attr('class'),
			                truename:$("#userID").html(),
			                telphone:$("#userNum").html(),
			                case_title:$("#ThingName").val(),
			                client_tag:getSession(2),
			                case_type:$("#thingtypeNum").children("option:selected").index()+1,
			                case_record:cur_timestamp,
			                
	                	},
	                	success:function(data){
	                		layer.close(index);
	                		$("#myCaseDetail").modal('hide');
	                		loadCase('1','time');
	                		console.log(data);
	                	},
	                	error:function(xhr, status){
	                		layer.close(index);
	                		console.log(xhr.status + status)
	                	}
	                });
	              
                 });
//结束

/*删除案件*/

$(document).on("click", "#del_case", function() {
	var cur_timestamp = Date.parse(new Date()) / 1000;
    var md_token = hex_md5("law_" + hex_md5(cur_timestamp) + "_law");
	var del_case_id = $(this).parent().parent().siblings(".case_id");
	
	layer.alert('确定要删除么？',{skin:'layui-layer-molv',anim:4},function(){
         var index=layer.load(1,{shade:[0.1,'blue']});
		$.ajax({
				type: "post",
				url: 'https://www.ls186.cn/api/public/law/',
				data: {
					service: "Case.del_case",
					time: cur_timestamp,
					token: md_token,
					id: del_case_id.html()
				},
				success: function(data) {
					layer.close(index);
					if(data.ret == 200) {
				    $(this).parent().parent().siblings(".case_id").parent().remove();
						layer.msg("已删除！", {
							icon: 1,
							time:1000
						})
						$(".AJBox").empty()
						//window.location.reload();
						loadCase('1','time');
					}else{
						layer.close(index);
					   layer.msg("删除失败！", {
							icon: 2
						})
					}
					
				},
				error:function(){
					layer.close(index);
					layer.msg("删除失败！", {
							icon: 2
						})
				}

			});
	},function(){
		
	})

});

/*律师登记新案件*/


$("#DjSubBtn").click(function(){
	var cur_timestamp = Date.parse(new Date()) / 1000;
    var md_token = hex_md5("law_" + hex_md5(cur_timestamp) + "_law");
	var djcase_uname=$("#djcase_uname").val();
	    djcase_tel=$("#djcase_tel").val();
	    djcase_name=$("#djcase_name").val();
	   djcase_utype=$("#djcase_utype").children("option:selected").index()+1;
	   djcase_type=$("#djcase_type").children("option:selected").index()+1;
	   $("#myDJ").modal("hide");
	   var index = layer.load(1, {
				shade: [0.1, 'blue']
			});
			$.ajax('https://www.ls186.cn/api/public/law/', {
				type: 'post',
				data: {
					service: "Case.get_new_ID",
					time: cur_timestamp,
					token: md_token,
					id:getSession(0),
					ispc:1
				},
			}).done(function(data) {
            if(data.ret == 200) {
					$.ajax({
							type: 'POST',
							url: 'https://www.ls186.cn/api/public/law/',
							data: {
								service: "Case.save_case",
								time: cur_timestamp,
								token: md_token,
								id:data.data,
								truename: djcase_uname,
								telphone: djcase_tel,
								case_title:  djcase_name,
								client_tag:  djcase_utype,
								case_type: djcase_type,
								

							},
							success: function(data) {
							   if(data.ret == 200) {
							   	$("#djcase_uname").val("");
							   	$("#djcase_tel").val("");
	                            $("#djcase_name").val("");
							   	  layer.close(index);
									layer.msg("登记成功")
									$(".AJBox").empty();
									loadCase('1','time');
								} else {
                                  layer.msg("登记失败" + data.msg)
								}
							},
						});

				} else {
					layer.msg(data.msg)
				}

			}).fail(function(xhr, status) {
				layer.msg(xhr.status + status);
			}).always(function() {
				
			});

		
	   
	   
})
/*同步案件*/
$("#case_sync").on("click",function(){
	var cur_timestamp = Date.parse(new Date()) / 1000;
    var md_token = hex_md5("law_" + hex_md5(cur_timestamp) + "_law");
	var userid=getSession(0);
		    var index = layer.load(2, {
				shade: [0.1, 'yellow']
			});
	           $.ajax({
							type: 'POST',
							url: 'https://www.ls186.cn/api/public/law/',
							data:{
								service:"Index.data_sync",
								time:cur_timestamp,
								token:md_token,
							   userid:getSession(0)
							},
							
							success: function(data) {
								layer.close(index);
							   if(data.ret == 200) {
							    	
									layer.msg("同步成功")
									$(".AJBox").empty();
									loadCase(1,'time');
								} else {
								  layer.msg("同步失败" + data.msg)
                                  console.log(data.msg)
								}
							},
						});
		
})
$(".load_icon").hide();
/*箭头*/
//$(".caret_icon").toggle(function(){
//	//$(this).removeClass("fa-caret-down");
//	//$(this).addClass("fa-caret-right");
//	$(this).siblings(".load_icon").show();
//	//$(this).parent().parent().siblings().slideDown()
//},function(){
//	$(this).removeClass("fa-caret-right");
//	$(this).addClass("fa-caret-down");
//	$(this).siblings(".load_icon").hide();
//	//$(this).parent().parent().siblings().slideUp()
//})
$(".evidence_cont").hide();
$(".caret_icon").click(function(){
	$(this).parent().parent().siblings().slideToggle()
	$(".load_icon").toggle();
})
