/*自适应菜单*/
$("#menuBtn").click(function() {
	$(".header_nav").slideToggle();
})
/*iframe高度*/
function reinitIframe() {
	var iframe = document.getElementById("test");
	try {
		var bHeight = iframe.contentWindow.document.body.scrollHeight;
		var dHeight = iframe.contentWindow.document.documentElement.scrollHeight;

		var height = Math.max(bHeight, dHeight);
		iframe.height = height;
	} catch(e) {}
}
window.setInterval("reinitIframe()", 200);

/*设置首页*/
//设为首页
function SetHome(obj, url) {
	try {
		obj.style.behavior = 'url(#default#homepage)';
		obj.setHomePage(url);
	} catch(e) {
		if(window.netscape) {
			try {
				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
			} catch(e) {
				alert("抱歉，此操作被浏览器拒绝！\n\n请在浏览器地址栏输入“about:config”并回车然后将[signed.applets.codebase_principal_support]设置为'true'");
			}
		} else {
			alert("抱歉，您所使用的浏览器无法完成此操作。\n\n您需要手动将【" + url + "】设置为首页。");
		}
	}
}
//收藏本站
function AddFavorite(title, url) {
	try {
		window.external.addFavorite(url, title);
	} catch(e) {
		try {
			window.sidebar.addPanel(title, url, "");
		} catch(e) {
			alert("抱歉，您所使用的浏览器无法完成此操作。\n\n 请使用Ctrl+D进行添加");
		}
	}
}
//保存到桌面
function toDesktop(sUrl, sName) {
	try {
		var WshShell = new ActiveXObject("WScript.Shell");
		var oUrlLink = WshShell.CreateShortcut(WshShell.SpecialFolders("Desktop") + "\\" + sName + ".url");
		oUrlLink.TargetPath = sUrl;
		oUrlLink.Save();
	} catch(e) {
		alert("当前IE安全级别不允许操作！");
	}
}

/*注册*/



/*侧边工具栏*/

function getVerifyCode(options) {

	return function() {
		clearInterval(timer);
		if(!(options && Object.prototype.toString.call(options.callBack) == "[object Function]")) {
			throw new Error("必须传递参数及回调函数");
		}
		var that = $(this);
		if(options.isPhone) {
			var phone = options.getPhone(),
				reg = options.phoneReg || /^1[3|4|5|7|8][0-9]\d{8}$/;
			if(!reg.test(phone)) {
				//如果手机号码不正确，则执行手机号码对应的回调函数
				options.phoneCallBack && options.phoneCallBack.call(that, phone);
				return;
			} else {
				var cur_timestamp = Date.parse(new Date()) / 1000;
				md_token = hex_md5("law_" + hex_md5(cur_timestamp) + "_law");
				phone = $("#j_phone").val();
				$.ajax({
					type: 'POST',
					url: 'https://www.ls186.cn/api/public/law/',
					data: {
						service: "User.get_code",
						time: cur_timestamp,
						token: md_token,
						phone: phone
					},
					success: function(data) {
						layer.msg("发送成功");
						if(data.ret == 200) {

							$("#regBtn").click(function() {
									var pwd = $("#userPWD").val();
									pwd2 = $("#userPWD2").val();
									isRead = $("#myRegs input[type=checkbox]").is(":checked");
									tag = $("#myRegs select").find("option:selected").index() + 1;
									var PhoneCode = $(".getYzCode").prev().val();
								if(pwd2==pwd&&isRead&&PhoneCode!=""){
								if(String(data.data) == String(hex_md5("law_" + PhoneCode))) {
									//layer.msg("验证码正确");
									console.log(cur_timestamp)
									console.log(md_token)
									console.log(phone);
							
								
									//var cur_timestamp = Date.parse(new Date()) / 1000;
									//var md_token = hex_md5("law_" + hex_md5() + "_law");
									
										var index = layer.load(1, {
											shade: [0.1, '#000']
										});
										$.ajax({
											type: 'POST',
											url: 'https://www.ls186.cn/api/public/law/',
											data: {
												service: 'User.user_register',
												time: cur_timestamp,
												token: md_token,
												tag: tag,
												password: pwd2,
												phone: phone

											},
											success: function(data) {
												layer.close(index); // 关闭layer 加载层
												if(data.ret == 200) {
													layer.msg("注册成功");
													console.log(data)
												} else {
													layer.msg(data.msg);
												}
											},
										});

								} else {
									console.log(data.data)
									console.log(hex_md5("law_" + PhoneCode))
									layer.msg("验证码错误");

								}
								}else{
									layer.msg("完善信息！");
								}
								
							});

						} else {
							layer.msg(data.msg)
						}

					},
					error: function(data) {
						console.log(data)
					}
				});
			}
		}

		var timer = null,
			time = options.time || 60,
			unabledClass = options.unabledClass || "",
			timeIsUpText = options.timeIsUpText || "重新获取",
			timeRunnigText = options.timeRunnigText || " s后重新获取";
		that.off("click");
		that.addClass(unabledClass);
		timer = setInterval(function() {
			//避免重复发送
			if(time <= 0) {
				clearInterval(timer);
				/*time = 60;*/
				that.html(timeIsUpText).removeClass(unabledClass);
				that.on("click", getVerifyCode(options));
			} else {
				time--;
				that.html(time + timeRunnigText);
				//在外部可以获取到倒计时当前时间
				if(options.getCurrentTime && (Object.prototype.toString.call(options.getCurrentTime) == "[object Function]")) {
					options.getCurrentTime.call(that, time);
				}
			}
		}, 1000);
		//执行回调函数
		options.callBack.call(that);
	}
}

$("#j_getVerifyCode").on("click", getVerifyCode({
	callBack: function() { //按钮点击后的回调函数，-----必须-----
		//在这里你还是可以对你的按钮进行操作
	},
	time: 60, //定时时间，以秒为单位，默认60秒
	getCurrentTime: function(time) { //获取倒计时当前时间
		//console.log(time);
		//	console.log(this);//这里的这个this执行按钮
		//	console.log("=================================");
	},
	isPhone: true, //是否为发送手机验证码，如果是则会验证手机号格式，-----必须-----
	getPhone: function() { //获取手机号，此处一定要return

		return $("#j_phone").val();
	},
	//phoneReg: /^1[34578]\d{9}$/,//手机号验证正则
	phoneCallBack: function() { //当手机号有误时的回调，默认会中止操作
		layer.msg("您输入的手机号有误");
	},
	timeIsUpText: "重新发送", //倒计时时间到了后按钮所显示文字
	timeRunnigText: "s后重新发送", //倒计时时间正在走的时候按钮所显示文字。默认为"xxs后重新获取"
	unabledClass: "unlabed" //按钮不能用的样式，即点击按钮后的样式
}));

/*登录*/
var ls = window.sessionStorage;
/*注销*/

$("#clearUser").click(function() {
	layer.confirm('确定注销么?', {
		icon: 3,
		title: '提示'
	}, function() {
		ls.clear();
		window.location.reload();

	});

})

/*写入存储*/
$(".AJGL").click(function() {

	if(ls.getItem('law_sign')) {
		if(getSession(2) == 6) {
			window.location.href = 'AJGL_user.html';
		} else {
			window.location.href = 'AJGL_lawyer.html';
		}

	} else {
		layer.msg('只有注册用户才能使用本功能', {
			icon: 4,
			time: 3000
		});

	}

})

if(ls.getItem("law_sign")) {
	var jsonTxt = JSON.parse(ls.getItem('law_sign'));
	var jsonStr = jsonTxt[jsonTxt.length - 1].law_law;
	if(jsonStr.split("_")[2] == 6) {
		$("#showBox_tit b").html("附近律所");
		$("#showBox").children("iframe").attr("src", "visitor.html");
		var time2 = window.setTimeout("reinitIframe()", 200);
		var carousel=$("<img src='img/carousel/user/user_1.jpg' /><img src='img/carousel/user/user_2.jpg' />");
   	                            $("#slider").html(carousel);
	} else {
		$("#showBox_tit b").html("案件管理");
		$("#showBox").children("iframe").attr("src", "ajgl_index.html");
		var timer1 = window.setTimeout("reinitIframe()", 200);
		var carousel=$("<img src='img/carousel/lawyer/lawyer_1.jpg' /><img src='img/carousel/lawyer/lawyer_2.jpg' />");
     	                      $("#slider").html(carousel);
	}

	$(".login,.login1").addClass("hide");
	$(".Ylogin").removeClass("hide");

} else {
	var law_sign = [];
	$("#showBox_tit b").html("附近律所");
	$("#showBox").children("iframe").attr("src", "visitor.html");
	var time2 = window.setTimeout("reinitIframe()", 200);
	var carousel=$("<img src='img/carousel/ulogin/ulogin_1.jpg' title='#htmlcaption' /><img src='img/carousel/ulogin/ulogin_2.jpg' /><img src='img/carousel/ulogin/ulogin_3.jpg' /><img src='img/carousel/ulogin/ulogin_4.jpg' />");
        $("#slider").html(carousel)
}

/*登录信息*/

var cur_timestamp = Date.parse(new Date()) / 1000;
var md_token = hex_md5("law_" + hex_md5(cur_timestamp) + "_law");
new Vue({
	el: '#app',
	data: {
		user: {
			service: "User.user_login",
			time: cur_timestamp,
			token: md_token,
			username: '',
			password: '',
		}
	},
	methods: {
		submit: function() {

			//加载层
			var index = layer.load(0, {
				shade: [0.6, '#000'] //0.1透明度的白色背景
			});
			$("#myLogin").modal('hide')

			// jquery ajax
			$.ajax({
				type: 'POST',
				url: 'https://www.ls186.cn/api/public/law/',
				data: this.user,
				success: function(data) {
					if(data.ret == 200) {
						var userlist = {
							law_law: data.data.user_id + "_" + md_token + "_" + data.data.user_tag,

						};
                     window.location.reload();
						//check user_type
						if(data.data.user_tag == 6) {
							$("#showBox_tit b").html("附近律所");
							$("#showBox").children("iframe").attr("src", "visitor.html");
							var time2 = window.setTimeout("reinitIframe()", 200);
							var carousel=$("<img src='img/carousel/user/user_1.jpg' /><img src='img/carousel/user/user_2.jpg' />");
   	                            $("#slider").html(carousel);
   	                            
						} else {
							$("#showBox_tit b").html("案件管理");
							$("#showBox").children("iframe").attr("src", "ajgl_index.html");
							var timer1 = window.setTimeout("reinitIframe()", 200);
							var carousel=$("<img src='img/carousel/lawyer/lawyer_1.jpg' /><img src='img/carousel/lawyer/lawyer_2.jpg' />");
     	                      $("#slider").html(carousel);
						}
						layer.close(index); // 关闭layer 加载层
						//$(".cover").hide();
						layer.msg('登录成功', {
							icon: 1
						});

						$("#clearUser").show();

						$(".login,.login1").addClass("hide");
						$(".Ylogin").removeClass("hide");

						law_sign.push(userlist);
						var law_signStr1 = JSON.stringify(law_sign);
						ls.setItem("law_sign", law_signStr1);

					} else {

						layer.msg(data.msg, {
							icon: 2
						})
						layer.close(index); // 关闭layer 加载层
					}
				},
			});
		}
	}
})

/*注册*/