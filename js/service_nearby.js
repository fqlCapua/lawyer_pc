	
/*返回附近律师列表*/
function  load_nearBy_lawyer(lng,lat){
	var curtime=Math.round(new Date()/1000);
	var md_token = hex_md5("law_" + hex_md5(String(curtime)) + "_law");
	var index = layer.load(2, {
		shade: [0.1, "#EEEEEE"],
		offset: ['50%', '50%']
	});
	$.ajax({
		type:"post",
		url:"https://www.ls186.cn/law_api",
		data: {
			service: "Office.service_nearby",
			time: curtime,
			token: md_token,
			lat:lat,
			lng:lng
		},
		success:function(data){
			layer.close(index);
			console.log(eval("'" + data+ "'"));
			var data=JSON.parse(data);
			if(data.ret==200){
				console.log(data.data);
				
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
	
	load_nearBy_lawyer(113.64964385,34.75661006);
	//load_nearBy_lawyer(r.point.lng,r.point.lat);
	// 百度地图API功能
	var map = new BMap.Map("allmap");
	var point = new BMap.Point(116.331398,39.897445);
	map.centerAndZoom(point,12);
  var posArr=[];
	var geolocation = new BMap.Geolocation();
	geolocation.getCurrentPosition(function(r){
		if(this.getStatus() == BMAP_STATUS_SUCCESS){
			var mk = new BMap.Marker(r.point);
			map.addOverlay(mk);
			map.panTo(r.point);
			posArr.push(r.point.lng);
			posArr.push(r.point.lat);
			//alert('您的位置：'+r.point.lng+','+r.point.lat);
			console.log(posArr);
			
		
		
	
    
    
    
    
    
    
    
    
    
    
    
		
		
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

	
