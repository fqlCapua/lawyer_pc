
$("#SortBox").hide();

var loadCase = function() {
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
			userid: getSession(0),
			type: 1
		},
		success: function(data) {
		   layer.close(index);var data=JSON.parse(data);;
		   
			if(data.ret == 200) {
				var caseMainList = data.data;
				
				if(caseMainList == '') {
					layer.msg("没有数据了", {
						icon: 5
					});
				} else {
					//console.log(caseMainList)
					$.each(caseMainList, function(index, ele) {
						var case1 = $("<li class='caseSingle'><div class='case_title show_tit text-left col-md-4'>" + ele.case_title + "</div><div class='case_id'>" + ele.case_id +"</div><div class='dropdown col-md-8'><a   class='dropdown-toggle' data-toggle='dropdown'>编辑<b class='caret'></b></a><ul class='dropdown-menu'><li id='del_case'><a>删除</a></li></ul></div></li>");
						$(".AJBox").append(case1);
					})
				}
			} else {
				layer.close(index);var data=JSON.parse(data);;
				layer.msg(data.msg, {
					icon: 3
				});
			}
		},
		error: function(data) {
			layer.close(index);var data=JSON.parse(data);;
			layer.msg("数据加载失败", {
				icon: 5
			})
		}

	});
};
loadCase();
/*排序*/





/*当事人获取案件详情*/

$(".AJBox").delegate("li .show_tit", "click", function() {
	var cur_timestamp = Date.parse(new Date()) / 1000;
    var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
	var case_id = $(this).siblings(".case_id").html();
var index = layer.load(1, {
		            shade: [0.1, 'darkblue']
	           });
	$.ajax({
		url: 'https://www.ls186.cn/law_api',
		type: 'post',
		data: {
			service: "Office.get_client_case",
			time: cur_timestamp,
			token: md_token,
			id: case_id,
		},
		success:function(data) {
			if(data.ret == 200) {
				layer.close(index);var data=JSON.parse(data);;
				$("#myCaseDetail").modal('show');
				var case_detail = data.data;
				$("#case_uname").html(case_detail.case_uname);
				$("#case_tel").html(case_detail.case_tel);
				$("#case_utype").children().eq(case_detail.case_status-1).attr("selected", "");
				$("#case_type").children().eq(case_detail.case_type-1).attr("selected", "");
				
				$("#case_reason").children().eq(case_detail.case_reason-1).attr("selected", "");
				$("#case_mp3").attr("src","http://www.ls186.cn"+case_detail.case_mp3);
                $("#case_explain").val(case_detail.case_explain); 
                $("#to_bbs").attr("checked",case_detail.case_to_bbs);  
                $("#case_img").attr("src",case_detail.case_img);
   
                
			}else{
				layer.msg("加载出错:"+data.msg);
			}
		},
		error: function(xhr, status) {
			layer.close(index);var data=JSON.parse(data);;
			alert(xhr.status + status);
		}

	})

})
$("#case_img").on("click",function(){


layer.photos({
	photos:'.layer-photos-demo',
	anim:5
})
})
/*当事人删除案件*/

$(document).on("click", "#del_case", function() {
	var cur_timestamp = Date.parse(new Date()) / 1000;
    var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
	var del_case_id = $(this).parent().parent().siblings(".case_id");
	
	layer.confirm('确定要删除么？',{btn:['是','否'],time:1500},function(){
		var index=layer.load(1,{shade:[0.1,'yellow']});
       
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
					layer.close(index);var data=JSON.parse(data);;
					if(data.ret == 200) {
				      layer.msg("已删除！", {
							icon: 1,
							time:1000
						})
						$(".AJBox").empty()
						//window.location.reload();
						loadCase();
					}else{
						layer.msg("删除失败！", {
							icon: 2
						})
					}
					
				},
				error:function(){
					
					
				}

			});
			$(this).parent().parent().siblings(".case_id").parent().remove();
	},function(){
		
	})

});
/*发表新帖子*/


/*图片上传*/
  var uploadImgStr="";
function imgUpload(){
	var flag;
	var cur_timestamp = Date.parse(new Date()) / 1000;
    var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
    var formData=new FormData();
	    formData.append("service","Index.upload_img");
	    formData.append("time",cur_timestamp);
        formData.append("token",md_token);
        formData.append("img",$("#file-3").get(0).files[0]);
       
	$.ajax({
		type:"post",
		url:"https://www.ls186.cn/law_api",
		async:false,
		cache: false,
        processData: false,
        contentType: false,
		data:formData,
		success:function(data){
			if(data.ret==200){
			  uploadImgStr=data.data;
			 console.log(uploadImgStr);
			 flag=true;
			}else{
				layer.msg("上传图片失败")
				flag=false;
			}
			
		},
		error:function(data,status){
			console.log(data+status);			
		}		
	});
return flag;
}

/*发布于bbs*/
//$("#to_bbs").change(function(){
//
//})
/*当事人登记新案件*/



$("#DjSubBtn").click(function(){
	
	var cur_timestamp = Date.parse(new Date()) / 1000;
    var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
	var userid=getSession(0);
	    truename=$("#djcase_uname").val();
	    telphone=$("#djcase_tel").val();
	    user_status=$("#djcase_utype").children("option:selected").index()+1;
	    case_type=$("#djcase_type").children("option:selected").index()+1;
	    case_reason=$("#djcase_reason").children("option:selected").index()+1;
	    case_mp3=$("#file-4")[0].files[0];
	    case_img=$("#file-3").get(0).files[0];
	    case_explain=$(".case_explain").val();
	    to_bbs=$("#to_bbs").is(":checked");
	    $("#myDJ").modal("hide");
	    
	    
 var formData=new FormData();
	formData.append("service","Office.add_client_case");
	formData.append("time",cur_timestamp);
    formData.append("token",md_token);
    formData.append("userid",userid);
    formData.append("truename",truename);
    formData.append("telphone",telphone);
    formData.append("user_status",user_status);
    formData.append("case_type",case_type);
    formData.append("case_mp3",case_mp3);
    formData.append("case_reason",case_reason);
    formData.append("case_explain",case_explain);
    formData.append("case_img",case_img);
    formData.append("to_bbs",to_bbs);
    formData.append('ispc',1);
	    var index = layer.load(1, {
				shade: [0.1, 'blue']
			});
	           $.ajax({
							type: 'POST',
							url: 'https://www.ls186.cn/law_api',
							data: formData,
							cache: false,
                            processData: false,
                            contentType: false,
							success: function(data) {
								layer.close(index);var data=JSON.parse(data);;
							   if(data.ret == 200) {
							    	 $("input[type=text]").val("");
							    	 $("textarea").val("");
							   	     $("input[type=file]").attr("src","");
									layer.msg("登记成功")
									$(".AJBox").empty();
									loadCase();
								} else {
									 layer.close(index);var data=JSON.parse(data);;
                                     layer.msg("登记失败" + data.msg)
                                     console.log(data.msg)
								}
							},
						});
if($("#to_bbs").is(":checked")){
	if(imgUpload()){
		var index=layer.load(2,{shade:[0.2,'red'],content:'正在同步...'});
		var cur_timestamp = Date.parse(new Date()) / 1000;
        var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
            userid=getSession(0);
            typeid=$("#djcase_reason").children("option:selected").index()+1;
            title=$("#djcase_name").val();
            content=$(".case_explain").val();;
		$.ajax({
			type:"post",
			url:"https://www.ls186.cn/law_api",
			data:{
				service:'BBS.publish_post',
				time:cur_timestamp,
				token:md_token,
				userid:userid,
				typeid:typeid,
				title:title,
				content:content,
				img:uploadImgStr
				
			},
			success:function(data){
				layer.close(index);var data=JSON.parse(data);;
				if(data.ret==200){
					//console.log(data.data);
				   layer.msg("已发表到论坛");
				}else{
					layer.msg("同步到论坛失败")
				}
				
			},error:function(data){
				layer.msg(data);
			}
		});
	}
}
	   
	   
})

/*同步案件*/
$("#case_sync").on("click",function(){
	var cur_timestamp = Date.parse(new Date()) / 1000;
    var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
	var userid=getSession(0);
		    var index = layer.load(2, {
				shade: [0.1, 'yellow']
			});
	           $.ajax({
							type: 'POST',
							url: 'https://www.ls186.cn/law_api',
							data:{
								service:"Index.data_sync",
								time:cur_timestamp,
								token:md_token,
							   userid:getSession(0)
							},
							
							success: function(data) {
								layer.close(index);var data=JSON.parse(data);;
							   if(data.ret == 200) {
							    	
									layer.msg("同步成功")
									$(".AJBox").empty();
									loadCase();
								} else {
								  layer.msg("同步失败" + data.msg)
                                  console.log(data.msg)
								}
							},
						});
		
})
