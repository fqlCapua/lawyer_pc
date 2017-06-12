/*
 
 * 
 * 
 * 典型
 * 
 * */

/*加载典型判例一级分类*/

$(function(){
	var cur_time=Math.round(new Date()/1000);
	var md_token = hex_md5("law_" + hex_md5(String(cur_time)) + "_law");
	//var index=layer.load(1,{shade:[0.1,'red']});
	$.ajax({
		type:"post",
		url:"https://www.ls186.cn/law_api",
		data:{
			service:'Laws.get_examples_category',
			time:cur_time,
			token:md_token,
			
		},
		success:function(data){
			var data=JSON.parse(data);
			if(data.ret==200){
			
			
			var laws_list=data.data;
			$.each(laws_list, function(i,laws) {
				
				var li=$("<li examples_cate_id='"+laws.examples_cate_id+"'><a>"+laws.examples_cate_name +"(<b>"+laws.examples_count+"</b>)</a></li>")
				
				$("#laws_menu").append(li);
			
			});
			
				
	
			}else{
				
				layer.msg(data.msg);
			}
			
		
		}
	});
})



/*获取法律法规分类*/
function laws_type(pageNum,cate_id) {
	var cur_time = Math.round(new Date() / 1000);
	var md_token = hex_md5("law_" + hex_md5(String(cur_time)) + "_law");
	$("#laws_cont li").hide();
	var index=layer.load(0,{shade:[0.1,'blue']})
	$.ajax({
		type: "post",
		url: "https://www.ls186.cn/law_api",
		data: {
			service: 'Laws.get_examples_list',
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
				    var li = $("<li laws_id='" + ele.examples_id + "'><a class='examples_title'>" + ele.examples_title + "</a><span class='laws_ctime text-muted pull-right'>" + new Date(parseInt(ele.examples_ctime) * 1000).toLocaleString().split(" ")[0] + "</span></li>");
					$("#laws_cont").append(li);
				});

			} else {
				layer.msg(data.msg);
			}
		}
	});
}
var pageNum=1;
cate_id=1;
laws_type(pageNum,cate_id);
/*获取分类下的法规详情*/
function  laws_detail(i){
	var index=layer.load(1,{shade:[0.1,'gray']});
	var cur_time = Math.round(new Date() / 1000);
	var md_token = hex_md5("law_" + hex_md5(String(cur_time)) + "_law");
	$("#freshIcon").show()
	$.ajax({
		type: 'post',
		url: 'https://www.ls186.cn/law_api',
		data: {
			service: 'Laws.get_examples_detail',
			time: cur_time,
			token: md_token,
			examples_id: i
		},
		success: function(data) {
			layer.close(index);
           $("#freshIcon").hide()
			var data = JSON.parse(data);
			if(data.ret == 200) {
				//console.log(data.data);
      	var content="<div class='laws_content'>"+data.data.examples_content+"</div>";
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
			service: 'Laws.search_examples',
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
				layer.msg("搜索成功", {icon: 1});
				$("#laws_cont").empty();
				var laws_list = data.data;
			
				$.each(laws_list, function(i, ele) {
					var li=$("<li laws_id='"+ ele.examples_id +"'><a class='laws_title'>" + ele.examples_title + "</a><span class='laws_ctime text-muted pull-right'>" + new Date(parseInt(ele.examples_ctime) * 1000).toLocaleString().split(" ")[0] + "</span></li>");
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
	var cate_id=$("#laws_menu").find(".active").parent().parent().index()+1;
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
	pageNum++;
	
			laws_type(pageNum,cate_id);
			
			
		
})

/*默认打开第一页*/

$("#laws_menu").on("click",'li',function() {
	$(this).addClass("active");
  $(this).css("background-color","#EFEFEF");
  $(this).siblings().css("background-color","#FFFFFF");
  $(this).siblings().removeClass("active");
	var cate_id = $(this).index() + 1;
	laws_type(pageNum,cate_id);

})
$("#laws_cont").on("click", 'li', function() {

	var laws_id = $(this).attr('laws_id');
	
	laws_detail(laws_id)
})

/*搜索法律法规*/
$(".searchBtn").click(function(){
	var cate_id=$(".Type_cate_id").children("option:selected").index()+1;
	var cur_key=$(".searchKey").val();
	var cur_type=$('.searchType').children("option:selected").attr("name");
      laws_search(cur_key,cur_type,cate_id);
})

