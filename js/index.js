//$(".login a").eq(2).hide();
//$(".login1 a").eq(2).hide();
/*自适应菜单*/
$("#menuBtn").click(function() {
	$(".header_nav").slideToggle();
})
$('.icon').click(function() {
	window.location.href = 'http://www.ls186.cn'
})

function user_ismoderator() {

	var cur_timestamp = Date.parse(new Date()) / 1000;
	var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
	var index = layer.load(1, {
		shade: [0.1, "#EEEEEE"],
		offset: ['50%', '50%']
	});
	$.ajax({
		type: "post",
		url: "https://www.ls186.cn/law_api",
		data: {
			service: "User.get_user_info",
			time: cur_timestamp,
			token: md_token,
			id: getSession(0),

		},
		success: function(data) {
			layer.close(index);
			var data = JSON.parse(data);;
			if(data.ret == 200) {
				var userinfo = data.data;
				if(userinfo.user_ismoderator == '') {
					$(".blog_menu").find('.set_blog').hide();;

				} else {

					$(".blog_menu").find('.set_blog').css('display', 'block');
					var redict_url = 'https://www.ls186.cn/index.php?g=Law&m=Post&a=hurt&user_ismoderator=' + userinfo.user_ismoderator;
					//	var SetBtn="<section  class ='master' ><a href='"+redict_url+"' class ='caseIcon fa fa-cog fa-spin'></a><a  href='"+redict_url+"' class='text-center'>帖子管理 </a></section>";
					//$("").append(SetBtn);

					//					$('.set_blog').attr("onclick", "window.location.href='" + redict_url + "'");
					$('.set_blog').attr("href", redict_url);
				}

			} else {
				console.log(data.msg);
			}
		},
		error: function(data) {
			layer.close(index);
			console.log(data);
		}
	})
}
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

function pwdTest() {
	var flag;
	testPwd = /^\S{6,}$/;
	if($("#userPWD").val() != "") {
		if(testPwd.test($("#userPWD").val())) {
			flag = true;
		} else {
			layer.msg("格式不正确");
			flag = false;
		}
	} else {
		layer.msg("不能为空");
		flag = false;
	}
	return flag;
};

function pwdAgain() {
	var flag;
	if($("#userPWD2").val() != "") {
		if($("#userPWD2").val() == $("#userPWD").val()) {
			flag = true;
		} else {
			layer.msg("密码不一致");
			flag = false;
		}

	} else {
		layer.msg("不能为空");
		flag = false;
	}
	return flag;
};
$("#userPWD").blur(function() {
	pwdTest()
});
$("#userPWD2").blur(function() {
	pwdAgain()
});
/*环信*/
var conn = {};
conn = new WebIM.connection({
	isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
	https: typeof WebIM.config.https === 'boolean' ? WebIM.config.https : location.protocol === 'https:',
	url: WebIM.config.xmppURL,
	isAutoLogin: true,
	heartBeatWait: WebIM.config.heartBeatWait,
	autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
	autoReconnectInterval: WebIM.config.autoReconnectInterval
});

function reg(userid) {
	var options = {
		username: userid,
		password: userid,
		nickname: '用户' + userid,
		appKey: '1144161101115205#lawyer',
		success: function() {
			alert("成功");
		},
		error: function() {
			alert("失败");
		},
		apiUrl: WebIM.config.apiURL
	};
	conn.registerUser(options);
}

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
				md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
				phone = $("#j_phone").val();
				$.ajax({
					type: 'POST',
					url: 'https://www.ls186.cn/law_api',
					data: {
						service: "User.get_code",
						time: cur_timestamp,
						token: md_token,
						phone: phone
					},
					success: function(data) {
						var data = JSON.parse(data);
						layer.msg("发送成功", {
							icon: 1
						});

						if(data.ret == 200) {

							$("#regBtn").click(function() {

								var index = layer.load(1, {
									shade: [0.1, '#000']
								});
								var pwd = $("#userPWD").val();
								pwd2 = $("#userPWD2").val();
								isRead = $("#myRegs input[type=checkbox]").is(":checked");
								tag = $("#myRegs select").find("option:selected").index() + 1;
								var PhoneCode = $(".getYzCode").prev().val();

								if(pwd2 == pwd && isRead && PhoneCode != "") {
									if(String(data.data) == String(hex_md5("law_" + PhoneCode))) {
										layer.msg("验证码正确");

										var cur_timestamp = Date.parse(new Date()) / 1000;
										var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");

										$.ajax({
											type: 'POST',
											url: 'https://www.ls186.cn/law_api',
											data: {
												service: 'User.user_register',
												time: cur_timestamp,
												token: md_token,
												tag: tag,
												password: pwd2,
												phone: phone

											},
											success: function(data) {
												layer.close(index);
												var data = JSON.parse(data);; // 关闭layer 加载层
												if(data.ret == 200) {

													/*环信注册*/
													var conn = {};
													conn = new WebIM.connection({
														isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
														https: typeof WebIM.config.https === 'boolean' ? WebIM.config.https : location.protocol === 'https:',
														url: WebIM.config.xmppURL,
														isAutoLogin: true,
														heartBeatWait: WebIM.config.heartBeatWait,
														autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
														autoReconnectInterval: WebIM.config.autoReconnectInterval
													});

													function reg(userid) {
														var options = {
															username: userid,
															password: userid,
															nickname: '用户' + userid,
															appKey: '1144161101115205#lawyer',
															success: function() {
																layer.msg("注册成功");
															},
															error: function() {
																layer.msg("注册失败");
															},
															apiUrl: WebIM.config.apiURL
														};
														conn.registerUser(options);
													}
													reg(data.data.user_id);

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
								} else {
									layer.msg("完善信息！");
								}
								//								
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
		user_ismoderator();

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
	if(jsonStr.split("_")[3] == '1') {
		if($("#leftsead1 ul").children().length == 6) {
			var li = $("<li class='btn btn-primary btn-block fzren'><span><i  class='fa fa-copy fa-2x'></i><a target='_blank' href='https://www.ls186.cn/index.php?g=Law&m=Ext&a=export_index&user_isexport=1'>专家辅助人</a></span></li>");
			$("#leftsead1 ul").append(li);
		}
	} else {

	}
	if(jsonStr.split("_")[2] == 6) {
		$("#showBox_tit b").html("附近律所");
		$("#showBox").children("iframe").attr("src", "visitor.html");
		var time2 = window.setTimeout("reinitIframe()", 200);
		var carousel = $("<img src='img/carousel/user/user_1.jpg' /><img src='img/carousel/user/user_2.jpg' />");
		$("#slider").html(carousel);
	} else {
		$("#showBox_tit b").html("案件管理");
		$("#showBox").children("iframe").attr("src", "ajgl_index.html");
		var timer1 = window.setTimeout("reinitIframe()", 200);
		var carousel = $("<img src='img/carousel/lawyer/lawyer_1.jpg' /><img src='img/carousel/lawyer/lawyer_2.jpg' />");
		$("#slider").html(carousel);
	}

	$(".login,.login1").addClass("hide");
	$(".Ylogin").removeClass("hide");

} else {
	var law_sign = [];
	$("#showBox_tit b").html("附近律所");
	$("#showBox").children("iframe").attr("src", "visitor.html");
	var time2 = window.setTimeout("reinitIframe()", 200);
	var carousel = $("<img src='img/carousel/ulogin/ulogin_1.jpg' title='#htmlcaption' /><img src='img/carousel/ulogin/ulogin_2.jpg' /><img src='img/carousel/ulogin/ulogin_3.jpg' /><img src='img/carousel/ulogin/ulogin_4.jpg' />");
	$("#slider").html(carousel)
}

function pro_refresh() {
	if(ls.getItem("law_sign")) {
		var jsonTxt = JSON.parse(ls.getItem('law_sign'));
		var jsonStr = jsonTxt[jsonTxt.length - 1].law_law;
		if(jsonStr.split("_")[3] == 1) {
			if($("#leftsead1 ul").children().length == 6) {
				var li = $("<li class='btn btn-primary btn-block fzren'><span><i  class='fa fa-copy fa-2x'></i><a target='_blank' href='https://www.ls186.cn/index.php?g=Law&m=Ext&a=export_index&user_isexport=1'>专家辅助人</a></span></li>");
				$("#leftsead1 ul").append(li);
			}
		};
		if(jsonStr.split("_")[4] == 1) {
			var newsNum = $("#leftsead1 ul").find('.master_news').length;

			if(newsNum == 0) {
				var masterUrl = 'https://www.ls186.cn/index.php?g=Law&m=News&a=index&user_news=' + jsonStr.split("_")[4];
				var li = $("<li class='btn btn-primary btn-block master_news'><span><i  class='fa fa-copy fa-2x'></i><a target='_blank' href='" + masterUrl + "'>新闻管理</a></span></li>");
				$("#leftsead1 ul").append(li);
			} else {

			}

		};
		if(jsonStr.split("_")[5] == 1){
			
			var itemNum = $("#leftsead1 ul").find('.officeCheck').length;
			var case_url = "http://www.ls186.cn/index.php?g=Law&m=Office&a=case_list&id=" +jsonStr.split("_")[6]+ "&is_office_manager=1";
			var lawyer_url = "http://www.ls186.cn/index.php?g=Law&m=Office&a=lawyer_list&id="+jsonStr.split("_")[6]+ "&is_office_manager=1";
			if(itemNum==0){
				var li = $("<li class='btn btn-primary btn-block officeCheck'><span><i  class='fa fa-copy fa-2x'></i><a target='_blank' href='" + lawyer_url + "'>律所律师管理</a></span></li> <li class='btn btn-primary btn-block officeCheck'><span><i  class='fa fa-copy fa-2x'></i><a target='_blank' href='" + case_url + "'>律所案件管理</a></span></li>");
		    $("#leftsead1 ul").append(li);
			}else{}
			
			
			
		}else{
			
		}

	}

}
setInterval('pro_refresh()', 1000);
/*登录信息*/
var show_officeCheck;
var cur_timestamp = Date.parse(new Date()) / 1000;
var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
new Vue({
	el: '#app',
	data: {
		user: {
			service: "User.user_login",
			time: Date.parse(new Date()) / 1000,
			token: hex_md5("law_" + hex_md5(String(Date.parse(new Date()) / 1000)) + "_law"),
			username: '',
			password: '',
		}
	},
	methods: {
		submit: function() {

			//加载层
			var index = layer.load(1, {
				shade: [0.1, "#EEEEEE"],

			});
			$("#myLogin").modal('hide')

			// jquery ajax
			$.ajax({
				type: 'POST',
				url: 'http://www.ls186.cn/Law_api',
				data: this.user,
				success: function(data) {

					layer.close(index);
					var data = JSON.parse(data);
					if(data.ret == 200) {

						console.log(data);
						layer.msg('登录成功', {
							icon: 1
						});
						//	if(data.data.user_office_work||)
						console.log(data.data.user_id)
var Ismanage=data.data.is_office_manager;
var Isworker=data.data.is_office_worker;
var m_officeId=data.data.manage_office_id;
var user_office_work=data.data.user_office_work;
						 if(data.data.is_office_worker != '1' && data.data.is_office_manager != '1') {
							
						}
					
						
						var userlist = {
							law_law: data.data.user_id + "_" + md_token + "_" + data.data.user_tag + "_" + data.data.user_isexport + "_" + data.data.user_news+"_"+Ismanage+"_"+m_officeId+"_"+Isworker+"_"+user_office_work,

						};

						//	setTimeout("ajaxreload()", 1000);
						//check user_type

						if(data.data.user_tag == 6) {
							$("#showBox_tit b").html("附近律所");
							$("#showBox").children("iframe").attr("src", "visitor.html");
							var time2 = window.setTimeout("reinitIframe()", 200);
							var carousel = $("<img src='img/carousel/user/user_1.jpg' /><img src='img/carousel/user/user_2.jpg' />");
							$("#slider").html(carousel);

						} else {
							$("#showBox_tit b").html("案件管理");
							$("#showBox").children("iframe").attr("src", "ajgl_index.html");
							var timer1 = window.setTimeout("reinitIframe()", 200);
							var carousel = $("<img src='img/carousel/lawyer/lawyer_1.jpg' /><img src='img/carousel/lawyer/lawyer_2.jpg' />");
							$("#slider").html(carousel);
						}
						// 关闭layer 加载层
						//$(".cover").hide();

						$("#clearUser").show();

						$(".login,.login1").addClass("hide");
						$(".Ylogin").removeClass("hide");

						law_sign.push(userlist);
						var law_signStr1 = JSON.stringify(law_sign);
						ls.setItem("law_sign", law_signStr1);
						user_ismoderator();
					} else {

						layer.msg(data.msg, {
							icon: 2
						})

					}
				},
			});
		}
	}
})

/*刷新*/
//function ajaxreload() {
//	window.location.reload();
//}
//  ========== 
//  = 个人信息 = 
//  ========== 

//上传头像
function upload_head(obj) {
	var cur_timestamp = Date.parse(new Date()) / 1000;
	var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
	var file = obj[0].files[0];
	var headData = new FormData();
	headData.append("service", "User.upload_head_img");
	headData.append("time", cur_timestamp);
	headData.append("token", md_token);
	headData.append("id", getSession(0));
	headData.append("head_img", file);
	$.ajax({
		type: "post",
		url: "https://www.ls186.cn/law_api",
		cache: false,
		processData: false,
		contentType: false,
		data: headData,
		success: function(data) {
			var data = JSON.parse(data);
			if(data.ret == 200) {

				var url = 'http://www.ls186.cn' + data.data;

				$(".head_show").attr("src", url);
				layer.msg('更改成功')

			} else {
				layer.msg(data.msg);
			}

		},
		error: function(data) {}
	})
}

$(".headChange").click(function() {
	//$(".head_img").removeClass('hide');
	$(".head_img").click();
})
$(".head_img").change(function() {
	upload_head($(".head_img"));
})
$(".user_set>div").click(function() {
	load_user();
	var name = $(this).attr('name');
	var type = "#" + name;

	$(type).removeClass('hide');
	//$(type).siblings().hide();
	var userinfo = layer.open({
		type: 1,
		shade: false,
		area: ['500px', 'auto'],
		title: false, //不显示标题
		content: $(type), //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
		cancel: function() {
			window.location.reload();
		}
	});
})
//加载个人信息
function load_user() {
	var curtime = Math.round(new Date() / 1000);
	var md_token = hex_md5("law_" + hex_md5(String(curtime)) + "_law");
	$.ajax({
		type: "post",
		url: "https://www.ls186.cn/law_api",

		data: {
			service: "User.get_user_info",
			time: curtime,
			token: md_token,
			id: getSession(0)

		},
		success: function(data) {
			var data = JSON.parse(data);
			if(data.ret == 200) {
				var info = data.data;
				//console.log(info)
				var nickname = info.user_nickname;
				sex = info.user_sex;
				desc = info.user_desc;
				url = 'http://www.ls186.cn' + info.user_head_img;
				$(".head_show").attr('src', url);
				$(".nickname").val(nickname);
				$(".gender option").eq(sex).attr("selected", true);
				$(".intro").val(desc);
				$(".phone").html(info.user_phone);
				$(".email").html(info.user_email)

			} else {

			}
		},
		error: function() {

		}
	})
}

//更新个人信息
function update_info(userid) {

	var cur_timestamp = Date.parse(new Date()) / 1000;
	var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
	var nickname = $(".nickname").val();
	var gender = $(".gender option:selected").index();
	var desc = $(".intro").val();
	$.ajax({
		type: "post",
		url: "https://www.ls186.cn/law_api",

		data: {
			service: "Index.update_user_center",
			time: cur_timestamp,
			token: md_token,
			userid: userid,
			des: desc,
			sex: gender,
			nickname: nickname

		},
		success: function(data) {
			var data = JSON.parse(data);
			if(data.ret == 200) {
				layer.msg('保存成功');

			} else {
				layer.msg(data.msg);
			}
		},
		error: function() {

		}
	})
}
$("#info_sub").click(function() {
	update_info(getSession(0));
})
//实名认证
function sub_vertify() {
	var index = layer.load(1, {
		shade: [0.1, 'red'],
		area: ['100px', '50px']
	});
	var cur_timestamp = Date.parse(new Date()) / 1000;
	var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
	var vertiData = new FormData();
	var userid = getSession(0);
	truename = $(".truename").val();
	id = $('.id').val();
	lawyer_id = $('.lawyer_id').val();
	work_place = $('.work_place').val();
	lawyer_id_img = $('.lawyer_id_img')[0].files[0];
	id_img_front = $('.id_img_front')[0].files[0];
	id_img_back = $('.id_img_back')[0].files[0];
	vertiData.append('service', 'User.info_verify');
	vertiData.append('time', cur_timestamp);
	vertiData.append('token', md_token);
	vertiData.append('userid', userid);
	vertiData.append('truename', truename);

	vertiData.append('id', id);

	vertiData.append('lawyer_id', lawyer_id);

	vertiData.append('work_place', work_place);

	vertiData.append('lawyer_id_img', lawyer_id_img);

	vertiData.append('id_img_front', id_img_front);

	vertiData.append('id_img_back', id_img_back);

	$.ajax({
		type: "post",
		url: "https://www.ls186.cn/law_api",
		cache: false,
		processData: false,
		contentType: false,
		data: vertiData,
		success: function(data) {
			layer.close(index);
			var data = JSON.parse(data)
			if(data.ret == 200) {

				if(data.data == '1') {
					layer.msg('上传成功');
				} else {
					layer.msg('律师认证已经提交..');
				}

			} else {
				layer.msg(data.msg)

			}

		},
		error: function(data, status) {
			layer.close(index);
			console.log(data + status);
		}
	});
}

//  ========== 
//  = 律所认证 = 
//  ========== 
function sub_vertify2() {
	var index = layer.load(1, {
		shade: [0.1, 'gray'],
		area: ['100px', '50px']
	});
	var cur_timestamp = Date.parse(new Date()) / 1000;
	var md_token = hex_md5("law_" + hex_md5(String(cur_timestamp)) + "_law");
	var vertiData = new FormData();
	var userid = getSession(0);
	truename = $(".director_name").val();
	id = $('.director_id').val();
	lawyer_id = $('.license_id').val();
	work_place = $('.office_name').val();
	lawyer_id_img = $('.license_img')[0].files[0];
	id_img_front = $('.director_img_front')[0].files[0];
	id_img_back = $('.director_img_back')[0].files[0];
	vertiData.append('service', 'Office.office_verify');
	vertiData.append('time', cur_timestamp);
	vertiData.append('token', md_token);
	vertiData.append('user_id', userid);
	vertiData.append('director_name', truename);

	vertiData.append('director_id', id);

	vertiData.append('license_id', lawyer_id);

	vertiData.append('office_name', work_place);

	vertiData.append('license_img', lawyer_id_img);

	vertiData.append('director_img_front', id_img_front);

	vertiData.append('director_img_back', id_img_back);

	$.ajax({
		type: "post",
		url: "https://www.ls186.cn/law_api",
		cache: false,
		processData: false,
		contentType: false,
		data: vertiData,
		success: function(data) {
			layer.close(index);
			var data = JSON.parse(data)
			if(data.ret == 200) {
				if(data.data == '1') {
					layer.msg('律所认证上传成功');
				} else {
					layer.msg('律所认证已经提交..');
				}

			} else {
				layer.msg(data.msg)

			}

		},
		error: function(data, status) {
			layer.close(index);
			console.log(data + status);
		}
	});
}
//第一次登陆推广