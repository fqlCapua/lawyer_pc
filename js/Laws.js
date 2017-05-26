
/*加载法律法规一级分类*/
//var flag;
//$(function(){
//	var cur_time=Math.round(new Date()/1000);
//	var md_token = hex_md5("law_" + hex_md5(String(cur_time)) + "_law");
//	//var index=layer.load(1,{shade:[0.1,'red']});
//	$.ajax({
//		type:"post",
//		url:"https://www.ls186.cn/law_api",
//		data:{
//			service:'Laws.get_laws_category',
//			time:cur_time,
//			token:md_token,
//			
//		},
//		success:function(data){
//			//layer.close(index);
//			
//			var data=JSON.parse(data);
//			if(data.ret==200){
//				flag==true;
//			console.log(data.data);
//			var laws_list=data.data;
//			var lis=$("#laws_menu li");
//			for (var i = 0; i < lis.length; i++) {
//				//spans.eq(i).html(data.data[i].laws_cate_name);
//				lis.eq(i).attr("laws_cate_id",data.data[i].laws_cate_id);
//			}
//			}else{
//				flag==false;
//				layer.msg(data.msg);
//			}
//			
//		
//		}
//	});
//})


function laws_type(cate_id){
 var cur_time=Math.round(new Date()/1000);
	var md_token = hex_md5("law_" + hex_md5(String(cur_time)) + "_law");
   var index=layer.load(1,{shade:[0.1,'red']});
   $.ajax({
   	type:"post",
   	url:"https://www.ls186.cn/law_api",
    data:{
    	service:'Laws.get_laws_list',
    	time:cur_time,
    	token:md_token,
    	cate_id:cate_id
    },
    success:function(data){
    	layer.close(index);
    	var data=JSON.parse(data);
    	if(data.ret==200){
    		var laws_list=data.data;
    	$.each(laws_list, function(i,ele) {
    		$("#laws_cont").empty();
    		var li=$("<li laws_id='"+ele.laws_id+"'><a class='laws_title'>"+ele.laws_title+"</a><span class='laws_ctime text-muted pull-right'>"+new Date(parseInt(ele.laws_ctime) * 1000).toLocaleString().split(" ")[0]+"</span></li>");
    		$("#laws_cont").append(li);
    	});
    		
    	}else{
    		layer.msg("加载失败");
    	}
    }
   });
}
/*获取分类Id的*/
$(".nav li").click(function(){
	var cate_id=$(this).index()+1;
	laws_type(cate_id);
	
})
$("#laws_cont li").on("click",function(){
	alert("OK");
})
