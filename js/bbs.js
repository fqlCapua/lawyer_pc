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

                var el_li=$("<li class='blog' post_id='"+el.post_id+"' post_istop='"+el.post_istop+"'><section class='userMsg'><div class='user_header_img'><img src='http://www.ls186.cn"+el.user_head_img +"'/></div><div class='user_name'>"+el.user_nickname+"</div></section><section class='userMsg2'><div class='blog_title'>"+el.post_title+" </div><div class='blog_cont'>"+el.post_des+" </section><section class='userMsg3'><div class='blog_create_time text-muted'>"+new Date(parseInt(el.post_ctime) * 1000).toLocaleString().split(":")[0]+":"+new Date(parseInt(el.post_ctime) * 1000).toLocaleString().split(":")[1]+"</div><div class='like_num fa fa-thumbs-o-up '>"+el.like_num +"</div><div class='comment_num fa fa-commenting-o '>"+el.reply_num+"</div></section></li>")

            }else{
                
            
                var el_li=$("<li class='blog'  post_id='"+el.post_id+"' post_istop='"+el.post_istop+"'><section class='userMsg'><div class='user_header_img'><img src='http://www.ls186.cn"+el.user_head_img +"'/></div><div class='user_name'>"+el.user_nickname+"</div></section><section class='userMsg2'><div class='blog_title'>"+el.post_title+" </div><div class='blog_cont'>"+el.post_des+" </section><section class='userMsg3'><div class='blog_img'><img class='blog_img_b' src='http://www.ls186.cn"+el.post_img[0]+"'/><img   src='http://www.ls186.cn"+el.post_img[0] +"' /></div> <div class='blog_create_time text-muted'>"+new Date(parseInt(el.post_ctime) * 1000).toLocaleString().split(":")[0]+":"+new Date(parseInt(el.post_ctime) * 1000).toLocaleString().split(":")[1]+"</div><div class='like_num fa fa-thumbs-o-up '>"+el.like_num +"</div><div class='comment_num   fa fa-commenting-o'>"+el.reply_num+"</div></section></li>")

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
    
    bbs_list(pageNum,bbs_type_id);
})
/*重新加载帖子列表*/
function reload_list() {
var ls = window.sessionStorage;
  if(ls.getItem('law_sign')) {
     var active_id=$(".bbs_type").find(".active").attr('bbs_type_id');
      bbs_list(pageNum,active_id);

  } else {
    layer.msg('请先登录');

  }
 
};

/*加载某条帖子的评论*/
var comNum=1;
function  load_comments(obj,blog_id,comNum){
 
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
            page:comNum
        },
        success:function(data){
            var data=JSON.parse(data);
            if(data.ret==200){
                  
                        var list=data.data;
                        
                       obj.parent().parent().find(".comment").remove();
                       $.each(list,function(i,ele){
                      
                       var comment=$("<section post_reply_id='"+ele.post_reply_id+"'  user_id='"+ele.user_id+"' class='comment'><div class='userMsg'> <div class='user_header_img'><img  src='http://www.ls186.cn"+ele.user_head_img  +"'/></div> <div class='user_name'>"+ele.user_nickname+"</div> </div><div class='comment_cont'>"+ele.post_reply_content+"</div> <div class='com_create_time text-muted'>"+new Date(parseInt(ele.post_reply_ctime)*1000).toLocaleString().split(":")[0]+":"+new Date(parseInt(ele.post_reply_ctime)*1000).toLocaleString().split(":")[1]+"</div></section>");
                       obj.parent().parent().append(comment);
                       })
layer.open({
  type: 1,
  id:obj.parent().parent().attr('post_id'),
  area:['50%','600px'],
  scrollbar:false,
  title:'帖子详情',
  offset:['10px','25%'],
  maxmin:true,
  skin: 'layui-layer-demo', //样式类名
  closeBtn: 1, //不显示关闭按钮
  anim: 1,
  shadeClose:false, //开启遮罩关闭
  content:"<div style='position:relative;padding:20px'>"+obj.parent().parent().html()+"<ul class='pagination comNum'><li class='prevNum'><a>加载更多...</a></li></ul></div>",
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
     load_comments($(this),blog_id,comNum);
      load_comments($(this),blog_id,Number(comNum)+1);

})
/*发表帖子*/

 var imgStr='';
function pubBlog_img(){
    var cur_timestamp = Date.parse(new Date()) / 1000;
        md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
    var fileList=$('#pub_blog_img')[0].files;
    var imgData=new  FormData();
   
$.each(fileList,function(i,ele){
    imgData.append('img',ele);
    imgData.append('service','Index.upload_img');
    imgData.append('time',cur_timestamp);
    imgData.append('token',md_token);
    $.ajax({
        type:'post',
        url:'http://www.ls186.cn/Law_api',
        async:false,
        cache:false,
        processData:false,
        contentType: false,
        data:imgData,
        success:function(data){
            var data=JSON.parse(data);
            if(data.ret==200){
                var imgUrl=data.data;
              
              
                   imgStr+=(imgUrl+",");
               
              

              // console.log(imgStr)
            }else{
                layer.msg(data.msg);
            }
        }

    });
})

   
    return imgStr;

   } 

function setImgStr(arrStr){
    var arr=arrStr.split(",")
    var b=[];
    $.each(arr, function(i,m) {
        if(m==""){
            
        }else{
            b.push(m);
        }
        
    });
    return b.join(",");
}



$(".sub_newBlog").click(function(){
    var index=layer.load(0,{shade:[0.1,'red']});
       var cur_timestamp = Date.parse(new Date()) / 1000;
       var   md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
          var imgStr=pubBlog_img();
        
          var Str=setImgStr(imgStr);
         $.ajax({
                    type:'post',
                    url:'http://www.ls186.cn/Law_api',
                    data:{
                        service:'BBS.publish_post',
                        time:cur_timestamp,
                        token:md_token,
                        userid:getSession(0),
                        typeid:$(".bbs_type").find(".active").attr('bbs_type_id'),
                        title:$("#pub_tit").val(),
                        content:$("#pub_cont").val(),
                        img:Str,
                    },
                    success:function(data){
                        layer.close(index);
                      var data=JSON.parse(data);
                      if(data.ret==200){
                        layer.msg('发表成功');
                        reload_list();
                      }else{
                        layer.msg(data.msg)
                      }
                    },error:function(data){
                      layer.close(index);
                    }
                })

})

/*博客点赞*/
var like_flag;
function add_like(userid,post_id){

    var cur_timestamp = Date.parse(new Date()) / 1000;
    var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
   $.ajax({
        type:'post',
        url:"http://www.ls186.cn/law_api",
        data:{
            service:"BBS.add_post_like",
            time:cur_timestamp,
            token:md_token,
            userid:userid,
            postid:post_id
        },
        success:function(data){
         var data=JSON.parse(data);
         if(data.ret==200)
         {
           //like_flag=true;
             reload_list();
         }else{
             like_flag=false;
          layer.msg(data.msg);             
         }
        },error:function(status,data){
            console.log(status+":"+data);
            like_flag=false;
        }

      })
   return like_flag;
}
$("#content").on("click","li .like_num",function(){
    var post_id=$(this).parent().parent().attr('post_id');
    var userid=getSession(0);
   
if(add_like(userid,post_id)){
 
   add_like(userid,post_id);
  var like_num=$(this).html();
  $(this).html(eval(like_num+1));
  $(this).removeClass('.fa-thumbs-o-up');
   $(this).addClass('.fa-thumbs-up');
}else{

}

})

/*博客发表评论*/

function add_comment(userid,post_id,content){
 
    var cur_timestamp = Date.parse(new Date()) / 1000;
    var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
   $.ajax({
        type:'post',
        url:"https://www.ls186.cn/law_api",
        data:{
            service:"BBS.add_post_reply",
            time:cur_timestamp,
            token:md_token,
            postid:post_id,
            userid:userid,
            content:content
        },
        success:function(data){
         var data=JSON.parse(data);
        if(data.ret==200){
          //console.log(data.data);
          layer.msg("回复成功");
          reload_list();
         }else{
                layer.msg(data.msg);     
         }
        },error:function(status,data){
cosnole.log(data);
        }
})
 }
$("#content").on("click","li .comment_num",function(){
    var post_id=$(this).parent().parent().attr('post_id');
    var userid=getSession(0);

  layer.prompt({title:"输入回复内容:",formType:2},function(content,index){
    layer.close(index);
    add_comment(userid,post_id,content);

  })

})

function next_page(pageNum) {
  // body...
  var bbs_typeid=$(".bbs_type").find(".active").attr('bbs_type_id');
  pageNum++;  
      bbs_list(pageNum,bbs_typeid);
      console.log(pageNum);    


}
function prev_page(pageNum) {
 var bbs_typeid=$(".bbs_type").find(".active").attr('bbs_type_id');
  if(pageNum>1){
      pageNum--;  
      bbs_list(pageNum,bbs_typeid);
      console.log(pageNum);     
  }else{
    layer.msg('已经是第一页了')
  }
  

}
// function  sayName() {
//   // body...
//   console.log(comNum)
// }
//  window.setInterval("sayName()",1000);
/*帖子上下页*/
$(".pageNum .prevNum").click(function() {
if(pageNum>1){
  pageNum--;
  var active_id=$(".bbs_type").find(".active").attr('bbs_type_id');
  bbs_list(pageNum,active_id);
}else{
    layer.msg("已经是第一页了")
}
   
})
$(".pageNum .nextNum").click(function() {
 pageNum++;
  var active_id=$(".bbs_type").find(".active").attr('bbs_type_id');
 bbs_list(pageNum,active_id);
})
/*评论翻页*/
$("body").on("click",".comNum .prevNum",function() {
   if($(this).siblings().length<21){
      layer.msg("没有更多评论...")
    }else{
      // comNum++;
      // var active_id=$(".bbs_type").find(".active").attr('bbs_type_id');
 
      // load_comments($(this).children(),active_id,comNum);
    }
   
   
  

   
})