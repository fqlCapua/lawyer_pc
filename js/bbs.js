var pageNum=1;

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
    	
    	if(data.ret==200){
    		
    		var list=data.data;
    		$.each(list,function(i,el){
    			var li=$("<li class='selec' bbs_type_id='"+el.bbs_type_id+"'><a href='#' title='版主："+el.user_nickname+"' cont='"+el.bbs_type_des+"'>"+el.bbs_type_name+"</a></li>");
    			$(".bbs_type").append(li);  

    		})
    		$(".bbs_type li").eq(0).addClass("active");
    		
    		
         
    	}else{
    		layer.msg(data.msg);
    		
    	}
    	
    },
    error:function(data,status){
    	console.log(data);
    }
});

}
 // var bbs_type_id=$(".bbs_type").find(".active").attr("bbs_type_id");
 //         bbs_list(pageNum,bbs_type_id);


function show_img(imgArr){
  
 for (var i = 0; i < imgArr.length; i++) {
     var imgUrl=$("<img src='http://www.ls186.cn"+imgArr[i]+"'/>")
 }
  return imgUrl;
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
            $("#content").empty();
            $(".bbs_type_tit").html($(".bbs_type").find(".active a").html());
            $(".TopBg_text").html($(".bbs_type").find(".active a").attr("cont"));
    	 //	console.log(data);
          var list=data.data;
          
    	    $.each(list,function(i,el){
                
                   
                
                if(el.post_img==""){

                var el_li=$("<li class='blog' post_id='"+el.post_id+"' post_istop='"+el.post_istop+"'><section class='userMsg'><div class='user_header_img'><img src='http://www.ls186.cn"+el.user_head_img +"'/></div><div class='user_name'>"+el.user_nickname+"</div></section><section class='userMsg2'><div class='blog_title'>"+el.post_title+" </div><div class='blog_cont'>"+el.post_des+" </section><section class='userMsg3'><div class='blog_create_time text-muted'>"+new Date(parseInt(el.post_ctime) * 1000).toLocaleString().split(":")[0]+":"+new Date(parseInt(el.post_ctime) * 1000).toLocaleString().split(":")[1]+"</div><div class='like_num fa fa-thumbs-o-up pull-right'>"+el.like_num +"</div><div class='comment_num fa fa-commenting-o pull-right'>"+el.reply_num+"</div></section></li>")

            }else{
                
            
                var el_li=$("<li class='blog'  post_id='"+el.post_id+"' post_istop='"+el.post_istop+"'><section class='userMsg'><div class='user_header_img'><img src='http://www.ls186.cn"+el.user_head_img +"'/></div><div class='user_name'>"+el.user_nickname+"</div></section><section class='userMsg2'><div class='blog_title'>"+el.post_title+" </div><div class='blog_cont'>"+el.post_des+" </section><section class='userMsg3'><div class='blog_img'><img class='blog_img_b' src='http://www.ls186.cn"+el.post_img[0]+"'/><img   src='http://www.ls186.cn"+el.post_img[0] +"' /></div> <div class='blog_create_time text-muted'>"+new Date(parseInt(el.post_ctime) * 1000).toLocaleString().split(":")[0]+":"+new Date(parseInt(el.post_ctime) * 1000).toLocaleString().split(":")[1]+"</div><div class='like_num fa fa-thumbs-o-up pull-right'>"+el.like_num +"</div><div class='comment_num  pull-right fa fa-commenting-o'>"+el.reply_num+"</div></section></li>")

            }

       
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
/*加载各级分类下的帖子列表*/
$(".bbs_type").on("click", 'li',function(){
 
    $(this).addClass("active");
    $(this).siblings().removeClass("active");
    var bbs_type_id=$(this).attr("bbs_type_id");
    console.log(bbs_type_id)
    bbs_list(pageNum,bbs_type_id);
})

/*加载某条帖子的评论*/

function  load_comments(obj,blog_id,pageNum){
 
    var cur_timestamp = Date.parse(new Date()) / 1000;
    var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
   $.ajax({
        type:'post',
        url:"https://www.ls186.cn/law_api",
        data:{
            service:"BBS.post_reply_list",
            time:cur_timestamp,
            token:md_token,
            id:blog_id,
            page:pageNum
        },
        success:function(data){
            var data=JSON.parse(data);
            if(data.ret==200){
                  
                        var list=data.data;
                       obj.parent().parent().find(".comment").remove();
                       $.each(list,function(i,ele){
                      
                       var comment=$("<section post_reply_id='"+ele.post_reply_id+"'  user_id='"+ele.user_id+"' class='comment'><div class='userMsg'> <div class='user_header_img'><img  src='http://www.ls186.cn"+ele.user_head_img  +"'/></div> <div class='user_name'>"+ele.user_nickname+"</div> </div><div class='comment_cont'>"+ele.post_reply_content+"</div> <div class='com_create_time text-muted'>"+new Date(parseInt(ele.post_reply_ctime)*1000).toLocaleString().split(":")[0]+new Date(parseInt(ele.post_reply_ctime)*1000).toLocaleString().split(":")[1]+"</div></section>");
                       obj.parent().parent().append(comment);
                       })
layer.open({
  type: 1,
  id:obj.parent().parent().attr('post_id'),
  area:['50%','600px'],
  scrollbar:true,
  title:'帖子详情',
  offset:['10px','25%'],
  maxmin:true,
  skin: 'layui-layer-demo', //样式类名
  closeBtn: 1, //不显示关闭按钮
  anim: 1,
  shadeClose:false, //开启遮罩关闭
  content:obj.parent().parent().html(),
  cancel:function(){
   obj.parent().parent().find(".comment").remove();
  }
});
    
                 }else{
               
                    layer.msg(data.msg);
                 }
       
        },error:function(status){
            console.log(status)
           
        }
});


}
$("#content").on("click","li .blog_img img",function(){


 
    
layer.open({
  type: 1,
  title: false,
  closeBtn: 0,
  area: '516px',
  skin: 'layui-layer-nobg', //没有背景色
  shadeClose: true,
  content:$(this).siblings()
});


})

/*帖子详情*/
var pageNum=1;
$("#content").on("click","li .blog_title,li .blog_cont",function(){

    var Obj= $(this).parent().parent();
    var blog_id=Obj.attr("post_id");
   // console.log(blog_id)
     load_comments($(this),blog_id,pageNum);

    



})