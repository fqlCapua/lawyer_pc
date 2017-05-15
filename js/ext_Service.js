var pro_index = 0;

function startPro() {
	if(pro_index <window.innerWidth) {

		pro_index++;
		var lLength = -pro_index  + 'px';
		$(".professor_imgKu").css("margin-left",lLength);
	} else {
		pro_index = 0;
		$(".professor_imgKu").css("margin-left",0);

	}

}
$(function() {
	var cur_timestamp = Date.parse(new Date()) / 1000;
	md_token = hex_md5("law_" + hex_md5(cur_timestamp) + "_law")
	/*获取专家库*/

	$.ajax({
		url: 'https://www.ls186.cn/api/public/law/',
		type: 'post',
		data: {
			service: "Service.get_export_list",
			time: cur_timestamp,
			token: md_token,
			page: 1
		},
		success: function(data) {
			//layer.close(index);
			if(data.ret == 200) {
				var i = data.data.length;
				//console.log(i);
		

				var proList = data.data;
				$.each(proList, function(i, ele) {
					var singlePro = $("<span class='img_" + ele.user_id + "'><img  src='img/professor/pro01.png' alt='图片加载出错' title='" + ele.user_name + " " + ele.user_phone + "'/></span>")
					$(".professor_imgKu").append(singlePro);

				})
				
	setInterval("startPro()",50)
			} else {
				layer.msg("加载出错");
			}
		},
		error: function(xhr, status) {

			layer.msg(xhr.status + status);
		}

	})
	/*获取论证项目*/
	var service_type = $(".LzBox li span");
	//  console.log(service_type.length);

	service_type.on("click", function(){
			var service_tit = $(this).find(":last-child").html();
			$(".service_tit").html(service_tit);
			
			/*专家轮播*/
			
	});
	
	
	
/*表单验证*/
			function TestBlank(name) {
				var flag;
				if($(name).val() != "") {
					flag = true;
				} else {
					
					flag = false;

				}
				return flag;
			};
			
			
			

			function TestPhone(name) {
				var flag;
				testPwd = /^1[3|5|7|8]\d{9}$/;
				if(testPwd.test($(name).val()) && $(name).val() != "") {
					flag = true;
				} else {
					layer.msg("手机格式不正确", {
						time: 700
					});
					flag = false;
				}
				return flag;
			};
           
        $("#userNum").blur(function(){
        	if($(this).val()!=""){
        		TestPhone($(this))
        	}else{
        		TestBlank($(this))
        	}
        	
        	})
        $("#userName").blur(function(){
        	TestBlank($(this))
        })
          $("#case_explain").blur(function(){
        	TestBlank($(this))
        })
            $("#name").blur(function(){
        	TestBlank($(this))
        })
			/*提交论证*/

			$("#submit_serviceBtn").on("click", function() {
					if(TestBlank("#userName")&&TestBlank("#userNum")&&TestBlank("#name")&&TestBlank("#case_explain")&&TestPhone("#userNum")){
					
			
						var index = layer.load(1, {
							shade: [0.1, '#000']
						});
						var title = $("#name").val();
						telphone = $("#userNum").val();
						username = $("#userName").val();
						case_mp3 = $("#file-4")[0].files[0];
						case_img = $("#file-3").get(0).files[0];
						case_explain = $("#case_explain").val();
                     var formData = new FormData();
						formData.append("service", "Office.ext_service");
						formData.append("time", cur_timestamp);
						formData.append("token", md_token);
						formData.append("title", title)
						formData.append("userid", getSession(0));
						formData.append("contact_name", username);
						formData.append("telphone", telphone);
						formData.append("case_mp3", case_mp3);
						formData.append("case_img", case_img);
						formData.append("case_explain", case_explain);
                      
						$.ajax({
							type: 'POST',
							url: 'https://www.ls186.cn/api/public/law/',
							cache: false,
							processData: false,
							contentType: false,
							data: formData,
							success: function(data) {
								layer.close(index); // 关闭layer 加载层
								if(data.ret == 200) {
									layer.msg("提交论证成功");
								//	console.log(data.data);
									 $("input[type=text]").val("");
							    	 $("textarea").val("");
							   	     $("input[type=file]").attr("src","");
								} else {

								}
							},
						});

					}else{
						layer.msg("填写信息不正确");
					}
			})
	

})