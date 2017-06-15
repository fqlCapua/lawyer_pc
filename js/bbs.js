
function  bbs_type_load() {

	//var index=layer.load(1,{shade:[0.1,'red']});
	var cur_timestamp = Date.parse(new Date()) / 1000;
    var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
    console.log(cur_timestamp+""+md_token);
    $.ajax({
    	type:'post',
    	url:"https://www.ls186.cn/law_api",
    	data:{
    		service:"BBS.get_bbs_type",
    		time:cur_timestamp,
    		token:md_token
    	},
    	success:function(data){

    	//layer.close(index);
    	var data=JSON.parse(data);
    	console.log(data.data);
    	if(data.ret==200){
    		
    		var list=data.data;
    		$.each(list,function(i,el){
    			var li=$("<li class='selec' bbs_type_id='"+el.bbs_type_id+"'><a href='#' title='版主："+el.user_nickname+"' cont='"+el.bbs_type_des+"'>"+el.bbs_type_name+"</a></li>");
    			$(".bbs_type").append(li);  

    		})
    		$(".TopBg_text").html($(".selec").attr('cont'));
    		$(".bbs_type li").eq(0).addClass("active");
    		var bbs_type_id=$(".bbs_type").find(".active").attr("bbs_type_id");
     
       bbs_list(pageNum,bbs_type_id);
    	}else{
    		layer.msg(data.msg);
    		
    	}
    	
    },
    error:function(data,status){
    	console.log(data);
    }
});

}


/*加载一级分类下的帖子列表*/
function bbs_list(pageNum,bbs_type_id){
	var index=layer.load(1,{shade:[0,1,'gray']})
	var cur_timestamp = Date.parse(new Date()) / 1000;
    var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
        $.ajax({
    	type:'post',
    	url:"https://www.ls186.cn/law_api",
    	data:{
    		service:"BBS.post_list",
    		time:cur_timestamp,
    		token:md_token,
    		id:bbs_type_id,
    		page:pageNum
    	},
    	success:function(data){
       layer.close(index);
        var data=JSON.parse(data);
    	
    	if(data.ret==200){
    		console.log(data);
          var list=data.data;
    	    $.each(list,function(i,el){
    	    	var el_li=$(".blog").clone();
    	    	el_li.attr("post_id",el.post_id);
    	    	el.li.find(".user_header_img img").attr("src",el.user_head_img);
    	    	el_li.find(".user_name").html(el.user_nickname);
    	    	el_li.find(".blog_title").html(el.post_des)
    	    	el_li.find(".blog_img img").attr("src",el.post_img);
    	    	el_li.find("blog_create_time").html(new Date(parseInt(ele.pact_ctime) * 1000).toLocaleString());

    	    	$("#content").append(el_li);
    	    })

    	}else{
    		layer.msg(data.msg);
    	}
    },
    error:function(data,status){
    	console.log(data);
    }
})
}
var pageNum=1;
var bbs_type_id=1;
$(function(){
	bbs_type_load();
	
	bbs_list(1,1);

	
})