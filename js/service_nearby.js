	
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
function addMarker(lng,lat,law_msg){
	var point = new BMap.Point(lng,lat);
	  var marker = new BMap.Marker(point);
	  map.addOverlay(marker);
    var opts = {
	  width : 200,     // 信息窗口宽度
	  height: 50,     // 信息窗口高度
	  title : '信息详情' , // 信息窗口标题
	  enableMessage:true,//设置允许信息窗发送短息
	  message:" "
	}
    var infoWindow = new BMap.InfoWindow(law_msg, opts);
    marker.addEventListener("click", function(){          
		map.openInfoWindow(infoWindow,point); //开启信息窗口
	});
	}	
/*返回附近律师列表*/
function  load_nearBy_lawyer(lng,lat){
	var curtime=Math.round(new Date()/1000);
	var md_token = hex_md5("law_" + hex_md5(String(curtime)) + "_law");
	
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
//				     console.log(list);
				  $.each(list, function(i,ele){
				     
				  	if(ele.tag==0){
				  		 //addMarker(ele.user_lng,ele.user_lat);
				  		 var li=$("<li class='blog' lng='"+ele.user_lng+"' lat='"+ele.user_lat+"' tag='"+ele.tag+"' user_id='"+ele.user_id+"'><section class='userMsg' title='"+ele.user_desc+"'><div class='user_header_img'><img src='http://www.ls186.cn"+ele.user_head_img+"'/></div><div class='user_name'><div class='user_name1'>"+ele.user_truename+"</div><div class='user_des'>"+ele.user_desc+"</div></div><div class='lawyer_distance text-muted pull-right'>"+returnFloat(ele.distance)+"km</div></section></li>");
				         $("#content").append(li);
				         addMarker(ele.office_lng,ele.user_lat,ele.user_desc);
				  	}else{
				  		
				  		var li=$("<li class='blog' tag='"+ele.tag+"' lng='"+ele.office_lng+"' lat='"+ele.office_lat+"'  office_id='"+ele.office_id+"'><section class='userMsg' title='"+ele.office_desc+"'><div class='office_ad'><img src='"+ele.office_ad+"'/></div><div class='user_name'><div class='user_name1'>"+ele.office_title+"</div><div class='office_des'>"+ele.office_desc+"</div></div><div class='lawyer_distance text-muted pull-right'>"+returnFloat(ele.distance)+"km</div></section></li>");
				        $("#content").append(li);
				        addMarker(ele.office_lng,ele.office_lat,ele.office_desc);
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
	var index = layer.load(1, {
		shade: [0.1, "orange"],
	});
	var map = new BMap.Map("allmap");
	var point = new BMap.Point(116.331398,39.897445);
	map.centerAndZoom(point,15);
  var posArr=[];
    map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
	map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
	var geolocation = new BMap.Geolocation();
	geolocation.getCurrentPosition(function(r){
		layer.close(index);
		if(this.getStatus() == BMAP_STATUS_SUCCESS){
			var mk = new BMap.Marker(r.point);
			map.addOverlay(mk);
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
	function appendImg(arr,pObj){
        		for (var i = 0; i < arr.length; i++) {
        		 var img=$("<img style='width:50px;height: 50px; margin-right:5px;display: inline-block;'  src='"+arr[i]+"'/>");
        		 $(pObj).append(img);
        	}
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
			console.log(data.data)
			var data=JSON.parse(data);
			if(data.ret==200){
				var msg=data.data;
			  	layer.open({
			  		title:msg.office_title,
					type: 1,
					skin: 'layui-layer-lan',
					area: ['500px', '600px'],
					offset:'15px',
                    anim: 2,
                    content:"<div class='office' style='padding:20px;'><div><img style='width:450px;height:250px;' src='"+msg.office_ad+appendImg(msg.users,'.office')+ "'/></div><hr/><div>地址:<a href='#'>"+msg.office_address+"</a></div><div>电话:<a href='#'>"+msg.office_tel+"</a></div><div style='padding-top:10px'>简介：<div style='text-indent:20px'>"+msg.office_desc+"</div></div></div>"
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
				//console.log(msg)
			  	layer.open({
			  		title:'个人信息',
					type: 1,
					skin: 'layui-layer-lan',
					area: ['500px', '600px'],
					offset:'15px',
                    anim: 2,
                    content:"<div user_id='"+msg.user_id+"' style='padding:20px;'><div style='width:100%;height:50px;'><span><img  style='border-radius:50%;width:50px;height:50px;display:inline-block' src='img/member1.jpg' /></span><span style='display:inline-block;height:50px;line-height:50px;vertical-align:end;'>已认证</span></div><br /><div>昵称："+msg.user_nickname+"</div><div>真实姓名："+msg.user_truename+"</div><div>律师证号："+msg.user_lawyer_id+"</div><div>地址:<a href='#'>"+msg.user_work_place+"</a></div><div>电话:<a href='#'>"+msg.user_phone+"</a></div><div style='padding-top:10px'>简介：<div style='text-indent:20px'>"+msg.user_desc+"</div></div></div>"
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

$("#content").on('click','.blog',function(){
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
