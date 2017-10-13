$('.icon').click(function(){
	window.location.href='http://www.ls186.cn'
})	;
$('.search_office').hide();

/*返回搜索城市*/
	 function showArea(){
			var Str1= $('#s_province').val()+$('#s_city').val()+$('#s_county').val();
			
				return Str1;
		}
		//Gid('search_place').setAttribute('onchange', 'showArea()');
		$(".UrPlaceBtn").attr('onclick','showArea()');
/*格式化距离*/
function returnFloat(value){
 var value=Math.round(parseFloat(value)*100)/100;
 var xsd=value.toString().split(".");
 if(xsd.length==1){
 value=value.toString()+".00";
 return value;
 }
 if(xsd.length>1){
 if(xsd[1].length<2){
  value=value.toString()+"0";
 }
 return value;
 }
}


//  ========== 
//  = 添加标记点 = 
//  ========== 
function addMarker(lng,lat,username,phone){
	var point = new BMap.Point(lng,lat);
	  var marker = new BMap.Marker(point);
	  map.addOverlay(marker);
    var opts = {
	  width : 200,     // 信息窗口宽度
	  height: 100,     // 信息窗口高度
	  title : '信息详情' , // 信息窗口标题
	  enableMessage:true,//设置允许信息窗发送短息
	  message:" "
	}
    var msg='<a>姓名：&nbsp;'+ username +'</a><p  /><a>电话： &nbsp;  '+phone+'</a>';
   var infoWindow = new BMap.InfoWindow(msg,opts);
    
    marker.addEventListener("click", function(){          
		map.openInfoWindow(infoWindow,point); //开启信息窗口
	});
	}	
/*返回附近律师列表*/
function  load_nearBy_lawyer(lng,lat){
	var curtime=Math.round(new Date()/1000);
	var md_token = hex_md5("law_" + hex_md5(String(curtime)) + "_law");
	console.log(curtime+"/"+md_token);
	$.ajax({
		type:"post",
		url:"https://www.ls186.cn/law_api",
		async:false,
		data: {
			service: "Office.service_nearby",
			time: curtime,
			token: md_token,
			lat:lat,
			lng:lng
		},
		success:function(data){
			 var JSONStr=data;
			var data=JSON.parse(data);
			if(data.ret==200){
   
       
			
				  var list=data.data;
              $.each(list, function(i,ele){
              	$('.search_office').show();

              	//console.log(ele)
//				     console.log(ele)
				  	if(ele.tag==0){
				  		 //addMarker(ele.user_lng,ele.user_lat);
				  		 var li=$("<li class='blog' lng='"+ele.user_lng+"' lat='"+ele.user_lat+"' tag='"+ele.tag+"' user_id='"+ele.user_id+"'><section class='userMsg' title='"+ele.user_desc+"'><div class='user_header_img'><img src='http://www.ls186.cn"+ele.user_head_img+"'/></div><div class='user_name'><div class='user_name1'>"+ele.user_truename+"</div><div class='user_des'>"+ele.user_desc+"</div></div><div class='lawyer_distance text-muted pull-right'>"+returnFloat(ele.distance)+"km</div></section></li>");
				         $("#content").append(li);
				         
				         addMarker(ele.user_lng,ele.user_lat,ele.user_truename,ele.user_phone);
				  	}else{
				  		
				  		var li=$("<li class='blog' tag='"+ele.tag+"' lng='"+ele.office_lng+"' lat='"+ele.office_lat+"'  office_id='"+ele.office_id+"'><section class='userMsg' title='"+ele.office_desc+"'><div class='office_ad'><img src='"+ele.office_ad+"'/></div><div class='user_name'><div class='user_name1'>"+ele.office_title+"</div><div class='office_des'>"+ele.office_desc+"</div></div><div class='lawyer_distance text-muted pull-right'>"+returnFloat(ele.distance)+"km</div></section></li>");
				        $("#content").append(li);
				        var cont=ele.office_desc;
				        
				        addMarker(ele.office_lng,ele.office_lat,ele.office_title,ele.office_tel);
				  	}
				
				  
				  });
			$('#content').kkPages({
		    PagesClass:'.blog', //需要分页的元素
		    PagesMth:10, //每页显示个数		
		    PagesNavMth:4 //显示导航个数
		 });
				
			}else{
				layer.msg(data.msg);
				
			}
			
		},
		error:function(data){
				layer.close(index);
				console.log(data);
			}
	});
	
}


	// 百度地图API功能
//	var index = layer.load(1, {
//		shade: [0.1, "orange"],
//	});
	var map = new BMap.Map("allmap");
	var point = new BMap.Point(116.331398,39.897445);
	map.centerAndZoom(point,13);
  var posArr=[];
    map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
	map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
	var geolocation = new BMap.Geolocation();
	geolocation.getCurrentPosition(function(r){
		//layer.close(index);
		if(this.getStatus() == BMAP_STATUS_SUCCESS){
			var mk = new BMap.Marker(r.point);
			//map.addOverlay(mk);
			map.panTo(r.point);
			posArr.push(r.point.lng);
			posArr.push(r.point.lat);
			//console.log(posArr);
			
	      load_nearBy_lawyer(r.point.lng,r.point.lat);

    
		
		
		}
		else {
			alert('failed'+this.getStatus());
		}        
	},{enableHighAccuracy: true})
	
	//关于状态码
	//BMAP_STATUS_SUCCESS	检索成功。对应数值“0”。
	//BMAP_STATUS_CITY_LIST	城市列表。对应数值“1”。
	//BMAP_STATUS_UNKNOWN_LOCATION	位置结果未知。对应数值“2”。
	//BMAP_STATUS_UNKNOWN_ROUTE	导航结果未知。对应数值“3”。
	//BMAP_STATUS_INVALID_KEY	非法密钥。对应数值“4”。
	//BMAP_STATUS_INVALID_REQUEST	非法请求。对应数值“5”。
	//BMAP_STATUS_PERMISSION_DENIED	没有权限。对应数值“6”。(自 1.1 新增)
	//BMAP_STATUS_SERVICE_UNAVAILABLE	服务不可用。对应数值“7”。(自 1.1 新增)
	//BMAP_STATUS_TIMEOUT	超时。对应数值“8”。(自 1.1 新增)

	
//  ========== 
//  = 用户信息详情点击事件 = 
//  ========== 
/*加载律所信息*/
  //加载图片数组
	function appendImg(arr){
		var imgArr=[];
        		for (var i = 0; i < arr.length; i++) {
        	   var img="<img userid='"+arr[i].user_id+"' style='border:2px solid #BABABA;width:50px;border-radius:50%;height: 50px;margin:5px;display:inline-block;'  src='http://www.ls186.cn"+arr[i].user_head_img+"'/>";
        		imgArr.push(img)
        		}
        		var imgStr= imgArr.join("");
        		return imgStr;
        	}
function load_office(officeid){
	var curtime=Math.round(new Date()/1000);
	var md_token = hex_md5("law_" + hex_md5(String(curtime)) + "_law");
	$.ajax({
		type:"post",
		url:"https://www.ls186.cn/law_api",
		async:false,
		data: {
			service: "Office.office_info",
			time: curtime,
			token: md_token,
			officeid:officeid
		},
		success:function(data){
			
			var data=JSON.parse(data);
			if(data.ret==200){
				var msg=data.data;
				//console.log(msg)
			  	layer.open({
			  		title:msg.office_title,
					type: 1,
					skin: 'layui-layer-lan',
					area: ['500px', '600px'],
					offset:'15px',
                    anim: 2,
                    content:"<div class='office' style='padding:20px;'><div><img style='width:450px;height:250px;' src='"+msg.office_ad+ "'/>"+appendImg(msg.users)+"</div><hr/><div>地址:<a href='#'>"+msg.office_address+"</a></div><div>电话:<a href='#'>"+msg.office_tel+"</a></div><div style='padding-top:10px'>简介：<div style='text-indent:20px'>"+msg.office_desc+"</div></div></div>"
			  	})
			}else{
				layer.msg(data.msg)
			}
			
		},
		error:function(data){
			layer.msg(data)
		}
	});
}

/*加载个人信息*/
function load_user(userid){
	
	var curtime=Math.round(new Date()/1000);
	var md_token = hex_md5("law_" + hex_md5(String(curtime)) + "_law");
	$.ajax({
		type:"post",
		url:"https://www.ls186.cn/law_api",
		async:false,
		data: {
			service: "User.get_user_info",
			time: curtime,
			token: md_token,
			id:userid
		},
		success:function(data){
			var data=JSON.parse(data);
			if(data.ret==200){
				
				var msg=data.data;
//			 console.log(msg);
			     if(msg.user_isverify==1){
			     	isverify="<div class='vip'></div>"
			     }else{
			     	isverify='';
			     };
			     if(msg.user_head_img==""){
			     	head_img="http://www.ls186.cn"+"/data/upload/head_img/20170516/file_65.jpg";
			     }else{
			     	head_img="http://www.ls186.cn"+msg.user_head_img;
			     };
			      if(msg.user_isexport==1){
			     	var pro='是';
			     }else{
			     	 var pro='否';
			     }
			      
			  	layer.open({
			  		title:'个人信息',
					type: 1,
					skin: 'layui-layer-lan',
					area: ['500px', '600px'],
					offset:'15px',
                    anim: 2,
                    content:"<div user_id='"+msg.user_id+"' style='padding:20px;'><div class='header_img'><div class='head_img'><img src='"+head_img+"'/>"+isverify+" </div></div><br /><div>星级："+msg.user_level+"星</div><div>昵称："+msg.user_nickname+"</div><div>真实姓名："+msg.user_truename+"</div><div>律师证号："+msg.user_lawyer_id+"</div><div>地址:<a href='#'>"+msg.user_work_place+"</a></div><div>邮箱:<a href='#'>"+msg.user_email+"</a></div><div>是否为专家辅助人:<a href='#'>"+pro+"</a></div><div>电话:<a href='#'>"+msg.user_phone+"</a></div><div style='padding-top:10px'>简介：<div style='text-indent:20px'>"+msg.user_desc+"</div></div></div>"
			  	})
			}else{
				layer.msg(data.msg)
			}
			
		},
		error:function(data){
			layer.msg(data)
		}
	});
}

$(".blog_box #content").on('click','.blog',function(){
    var img=$(this).find('img').attr('src');
	var tag=$(this).attr('tag');
    var des=$(this).find('.user_des').html();
	if(tag=='0'){
//		  layer.open({
//					title:$(this).find('.user_name1').html(),
//					type: 1,
//					skin: 'layui-layer-lan',
//					area: ['400px', '400px'],
//                  anim: 2,
//                  content:"<div style='padding:20px;'><img style='width:250px;height:250px' src='"+img+"'/><div style='padding-top:10px'>"+des+"</div></div>"
//				});
 var userid=$(this).attr('user_id')
      
		load_user(userid);
		
	}else if(tag=='1'){
		var officeid=$(this).attr('office_id')
		load_office(officeid);
	}
	
	
	      
})
//查找律所

new Vue({
 el:'#search_office',
 data:{
 	  user:{
 		service:'Index.search_office',
 		time:Date.parse(new Date())/1000,
 		token:hex_md5("law_" + hex_md5(String(Date.parse(new Date()) / 1000)) + "_law"),
 		key_word:''
 	  }
 },
 methods:{
 	  Fn_search:function(){
 		 var index = layer.load(1, {
				shade: [0.1, "#EEEEEE"],
                area:'100px',
                offset:'50%',
			});
			$.ajax({
				type:"post",
				url:"http://www.ls186.cn/law_api",
				data:this.user,
				success:function(res){
					
					layer.close(index);
					var data=JSON.parse(res);
					if(data.ret==200){
						 $("#content").empty();
						 console.log(data.data);
						 var list=data.data;
						 $.each(list, function(i,ele) {
						 	 var li=$("<li class='blog search_data'  office_id='"+ele.office_id+"'><section class='userMsg' title='"+'名称：'+ele.office_title+',\n描述：'+ele.office_desc+',\n地址：'+ele.office_address+',\n负责人：'+ele.office_director_name+',\n电话：'+ele.office_tel+"'><div class='user_header_img hide'><img src=''/></div><div class='user_name'><div class='user_name1'>"+ele.office_title+"</div><div class='user_des'>"+ele.office_desc+"</div></div></section></li>");
				               $("#content").append(li);
						 });
						          
					}else{
						layer.msg(data.msg);
					}
				},
				fail:function(err){
					
				}
			});
 	}
 }
 
});

//绑定点击详情事件、
$('#content').on('click','.search_data',function(){
	var con=String($(this).find('.userMsg').attr('title'));
	var conArr=con.split(",");
	var conStr='';
	$.each(conArr,function(i,ele){
	   var el="<div>"+ele+"</div>";
	   conStr+=el;
	})
	console.log(conStr);
	layer.open({
		skin: 'layui-layer-molv',
		title:'律所详情',
		content:"<div style='padding:15px'>"+conStr+"</div>",
		area:['300px','320px'],
		
		
	})
})
