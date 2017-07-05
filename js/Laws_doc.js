/*
 * 
 * 法律文书
 * 
 * */
$(function(){
	var cur_time=Math.round(new Date()/1000);
	var md_token = hex_md5("law_" + hex_md5(String(cur_time)) + "_law");
	//var index=layer.load(1,{shade:[0.1,'red']});
	$.ajax({
		type:"post",
		url:"https://www.ls186.cn/law_api",
		data:{
			service:'Case.get_doc_type',
			time:cur_time,
			token:md_token,
			
		},
		success:function(data){
			var data=JSON.parse(data);
			if(data.ret==200){
			
			
			var laws_list=data.data;
			$.each(laws_list, function(i,laws) {
				
				var li=$("<li  ctype_id='"+laws.ctype_id+"'><a>"+laws.ctype_name +"(<i>"+laws.doc_count+"</i>)</a></li>")
			var option=$("<option ctype_id='"+laws.ctype_id+"'><a>"+laws.ctype_name +"</a></option>")
				$("#laws_menu").append(li);
			$(".Type_cate_id").append(option);
			});
			$("#laws_menu").find("li").eq(0).css("background-color","#EFEFEF");
				$("#laws_menu").find("li").eq(0).addClass("active");
	
			}else{
				
				layer.msg(data.msg);
			}
			laws_type(pageNum,1);
		
		}
	});
})
/*获取合同范本分类下列表*/
function laws_type(pageNum,cate_id) {
	var cur_time = Math.round(new Date() / 1000);
	var md_token = hex_md5("law_" + hex_md5(String(cur_time)) + "_law");
	$("#laws_cont li").hide();
	var index=layer.load(0,{shade:[0.1,'blue']})
	$.ajax({
		type: "post",
		url: "https://www.ls186.cn/law_api",
		data: {
			service: 'Case.get_doc_list',
			time: cur_time,
			token: md_token,
			cate_id: cate_id,
			page:pageNum
		},
		success: function(data) {
			layer.close(index)
			var data = JSON.parse(data);
			if(data.ret == 200) {
				//layer.msg("加载成功");
				var laws_list = data.data;
			
				$("#laws_cont").empty();
				$.each(laws_list, function(i, ele) {
				    var li = $("<li doc_type_id='" + ele.doc_type_id + "'><a class='doc_type_name'>" + ele.doc_type_name + "</a></li>");
					$("#laws_cont").append(li);
				});

			} else {
				layer.msg(data.msg);
			}
		}
	});
}
var pageNum=1;

/*获取分类下的法规详情*/
function  laws_detail(i){
	var index=layer.load(1,{shade:[0.1,'gray']});
	var cur_time = Math.round(new Date() / 1000);
	var md_token = hex_md5("law_" + hex_md5(String(cur_time)) + "_law");
	
	$.ajax({
		type: 'post',
		url: 'https://www.ls186.cn/law_api',
		data: {
			service: 'Case.get_doc_template',
			time: cur_time,
			token: md_token,
			id: i
		},
		success: function(data) {
			layer.close(index);
           $("#freshIcon").hide()
			var data = JSON.parse(data);
			if(data.ret == 200) {
				//console.log(data.data);
      	    var content="<div class='laws_content'>"+data.data+"</div>";
			layer.open({
					type: 1,
					skin: 'layui-layer-lan', //样式类名
					area:['50%','800px'],
					scrollbar:true,
					offset:['20px','25%'],
					closeBtn: 1,
					anim: 2,
					maxmin: true,
					moveOut:true,
					shadeClose: true, //开启遮罩关闭
					content: content
				});
			} else {
				layer.msg(data.msg);
			}
		},
		error: function(data) {
			console.log(data);
		}
	})
}




/*搜索法律法规*/
function laws_search(search_key,search_type,cate_id) {
	var cur_time = Math.round(new Date() / 1000);
	var md_token = hex_md5("law_" + hex_md5(String(cur_time)) + "_law");
	var index=layer.load(0,{shade:[0.3,'blue']});
	//$("#freshIcon").show()
//	console.log(cur_time+"++++"+md_token);
	$.ajax({
		type: "post",
		url: "https://www.ls186.cn/law_api",
		data: {
			service: 'Case.search_doc',
			time: cur_time,
			token: md_token,
			key: search_key,
			type:search_type,
			cate_id:cate_id
		},
		success: function(data) {
			//$("#freshIcon").hide()
			var data = JSON.parse(data);
			if(data.ret == 200) {
				layer.close(index);
				layer.msg("搜索完毕", {icon: 1});
				$("#laws_cont").empty();
				var laws_list = data.data;
			
				$.each(laws_list, function(i, ele) {
					var li=$("<li doc_type_id='"+ ele.doc_type_id +"'><a class='doc_type_name'>" + ele.doc_type_name + "</a><span class='ctype_name text-muted pull-right'>" + ele.ctype_name + "</span></li>");
					$("#laws_cont").append(li);
				});

			} else {
			       console.log(data)
				layer.msg("加载失败"+data.msg);
			}
		}
	});
}

/*分页*/
var cate_id;
function change_cate_id(){
	var cate_id=$("#laws_menu").find(".active").attr("ctype_id");
	return cate_id;
}
$(".prevPage").click(function(){
	
	var cate_id=change_cate_id();
		if(pageNum==1){
			layer.msg("已经是第一页了");
			//console.log(cate_id)
		}else{
			pageNum--;
			laws_type(pageNum,cate_id);
			//console.log(cate_id)
		}
	})
$(".nextPage").click(function(){
	
	var cate_id=change_cate_id();
	if($("#laws_cont li").length<20){
		layer.msg("已经到最后了")
	}else{
			pageNum++;
	
		laws_type(pageNum,cate_id);
	}
			
		
})

/*点击显示一级列表下内容*/

$("#laws_menu").on("click",'li',function() {
  $(this).addClass("active");
  $(this).css("background-color","#EFEFEF");
  $(this).siblings().css("background-color","#FFFFFF");
  $(this).siblings().removeClass("active");
	var cate_id = $(this).attr("ctype_id");
	laws_type(pageNum,cate_id);

})
/*显示文书详情*/
$("#laws_cont").on("click", 'li', function() {

	var laws_id = $(this).attr('doc_type_id');
	
	laws_detail(laws_id)
})

/*搜索法律法规*/
$(".Type_cate_id").append("<option ctype_id='0'>全部</option>")
$(".searchBtn").click(function(){
	var cate_id=$(".Type_cate_id").children("option:selected").attr("ctype_id");
	var cur_key=$(".searchKey").val();
	var cur_type=$('.searchType').children("option:selected").attr("name");
	console.log(cate_id+""+cur_key+cur_type);
      laws_search(cur_key,cur_type,cate_id);
})

