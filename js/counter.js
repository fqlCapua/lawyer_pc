function adv_format(value, num) //四舍五入
	       {
		var a_str = formatnumber(value, num);
		var a_int = parseFloat(a_str);
		if(value.toString().length > a_str.length) {
			var b_str = value.toString().substring(a_str.length, a_str.length + 1)
			var b_int = parseFloat(b_str);
			if(b_int < 5) {
				return a_str
			} else {
				var bonus_str, bonus_int;
				if(num == 0) {
					bonus_int = 1;
				} else {
					bonus_str = "0."
					for(var i = 1; i < num; i++)
						bonus_str += "0";
					bonus_str += "1";
					bonus_int = parseFloat(bonus_str);
				}
				a_str = formatnumber(a_int + bonus_int, num)
			}
		}
		return a_str + "元"
	}

	function formatnumber(value, num) //直接去尾
	{
		var a, b, c, i
		a = value.toString();
		b = a.indexOf('.');
		c = a.length;
		if(num == 0) {
			if(b != -1)
				a = a.substring(0, b);
		} else {
			if(b == -1) {
				a = a + ".";
				for(i = 1; i <= num; i++)
					a = a + "0";
			} else {
				a = a.substring(0, b + num + 1);
				for(i = c; i <= b + num; i++)
					a = a + "0";
			}
		}
		return a
	}
	function shou() {
								var result = 0;
								var shuru = document.formsuan.textfieldshurushou.value;
								if((shuru > 0) && (shuru <= 10000)) {
									result = 50;
								} else if((shuru > 10000) && (shuru <= 100000)) {
									result = (shuru - 10000) * 0.025 + 50;
								} else if((shuru > 100000) && (shuru <= 200000)) {
									result = (shuru - 100000) * 0.02 + 2300
								} else if((shuru > 200000) && (shuru <= 500000)) {
									result = (shuru - 200000) * 0.015 + 4300
								} else if((shuru > 500000) && (shuru <= 1000000)) {
									result = (shuru - 500000) * 0.01 + 8800
								} else if((shuru > 1000000) && (shuru <= 2000000)) {
									result = (shuru - 1000000) * 0.009 + 13800
								} else if((shuru > 2000000) && (shuru <= 5000000)) {
									result = (shuru - 2000000) * 0.008 + 22800
								} else if((shuru > 5000000) && (shuru <= 10000000)) {
									result = (shuru - 5000000) * 0.007 + 46800
								} else if((shuru > 10000000) && (shuru <= 20000000)) {
									result = (shuru - 10000000) * 0.006 + 81800
								} else if(shuru > 20000000) {
									result = (shuru - 20000000) * 0.005 + 141800
								}
								document.formsuan.textfieldsuanshou.value = adv_format(result, 2);
							}

							function bao() {
								var result = 0;
								var shuru = document.formsuan.textfieldshurubao.value;
								if((shuru > 0) && (shuru <= 1000)) {
									result = 30
								} else if((shuru > 1000) && (shuru <= 100000)) {
									result = shuru * 0.01 + 20
								} else if(shuru > 100000) {
									result = shuru * 0.005 + 520
								}

								if(result >= 5000) {
									result = 5000;
								}
								document.formsuan.textfieldsuanbao.value = adv_format(result, 2);
							}

							function lihun() {

								var result = "";
								var result_min = 0;
								var result_max = 0;
								var shuru = document.formsuan.textfieldshurulihun.value;
								if((shuru > 0) && (shuru <= 200000)) {
									result = "50至300";
								} else if(shuru > 200000) {
									result_min = adv_format(((shuru - 200000) * 0.005 + 50), 2);
									result_max = adv_format(((shuru - 200000) * 0.005 + 300), 2);
									result = result_min + "至" + result_max;
								}
								document.formsuan.textfieldsuanlihun.value = result;
							}

							function zhi() {
								var result = 0;
								var shuru = document.formsuan.textfieldshuruzhi.value;
								if((shuru > 0) && (shuru < 10000)) {
									result = 50
								} else if((shuru >= 10000) && (shuru <= 500000)) {
									result = (shuru - 10000) * 0.015 + 50
								} else if((shuru >= 500000) && (shuru <= 5000000)) {
									result = (shuru - 500000) * 0.01 + 7400
								} else if((shuru >= 5000000) && (shuru <= 10000000)) {
									result = (shuru - 5000000) * 0.005 + 52400
								} else if(shuru > 10000000) {
									result = (shuru - 10000000) * 0.001 + 77400
								}
								document.formsuan.textfieldsuanzhi.value = adv_format(result, 2);
							}

							function shouc() {
								var result = 0;
								var shuru = document.formsuan.textfieldshurushouc.value;
								if(shuru > 141800) {
									result = (shuru - 141800) / 0.005 + 20000000;
								} else if((shuru > 81800) && (shuru <= 141800)) {
									result = (shuru - 81800) / 0.006 + 10000000;
								} else if((shuru > 46800) && (shuru <= 81800)) {
									result = (shuru - 46800) / 0.007 + 5000000;
								} else if((shuru > 22800) && (shuru <= 46800)) {
									result = (shuru - 22800) / 0.008 + 2000000;
								} else if((shuru > 13800) && (shuru <= 22800)) {
									result = (shuru - 13800) / 0.009 + 1000000;
								} else if((shuru > 8800) && (shuru <= 13800)) {
									result = (shuru - 8800) / 0.01 + 500000;
								} else if((shuru > 4300) && (shuru <= 8800)) {
									result = (shuru - 4300) / 0.015 + 200000;
								} else if((shuru > 2300) && (shuru <= 4300)) {
									result = (shuru - 2300) / 0.02 + 100000;
								} else if((shuru > 50) && (shuru <= 2300)) {
									result = (shuru - 50) / 0.025 + 10000;
								} else if(shuru = 50) {
									result = "诉讼标的<=10000"
								}
								document.formsuan.textfieldfanshouc.value = adv_format(result, 2);
							}

							function baoc() {
								var result = 0;
								var shuru = document.formsuan.textfieldshurubaoc.value;
								if(shuru >= 5000) {
									result = "保全标的大于896000";
								} else if(shuru > 1020) {
									result = adv_format((shuru - 520) / 0.005, 2);
								} else if((shuru > 30) && (shuru <= 1020)) {
									result = adv_format((shuru - 20) / 0.01, 2);
								} else if(shuru = 30) {
									result = "保全标的<=1000"
								}
								document.formsuan.textfieldfanbaoc.value = result
							}

							function zhic() {
								var result = 0;
								var shuru = document.formsuan.textfieldshuruzhic.value;
								if(shuru > 77400) {
									result = adv_format(((shuru - 77400) / 0.001 + 10000000), 2);
								} else if((shuru > 52400) && (shuru <= 77400)) {
									result = adv_format(((shuru - 52400) / 0.005 + 5000000), 2);
								} else if((shuru > 7400) && (shuru <= 52400)) {
									result = adv_format(((shuru - 7400) / 0.01 + 500000), 2)
								} else if((shuru > 50) && (shuru <= 7400)) {
									result = adv_format(((shuru - 50) / 0.015 + 10000), 2)
								} else if(shuru = 50) {

									result = "执行标的<=10000"
								}
								document.formsuan.textfieldfanzhic.value = result
							}

							function lihunc() {
								var result = 0;
								var shuru = document.formsuan.textfieldshurulihunc.value;
								if(shuru > 300) {
									result = "财产总额大于20万元";
								} else if(shuru > 50 && shuru <= 300) {
									result = "财产总额不超过20万元";
								}
								document.formsuan.textfieldfanlihunc.value = result
							}

							function renge() {
								var result_max = 0;
								var result_min = 0;
								var result = "";
								var shuru = document.formsuan.textfieldshururenge.value;
								if(shuru <= 50000) {
									result = "100至500";
								} else if(shuru > 50000 && shuru <= 100000) {
									result_min = adv_format(((shuru - 50000) * 0.01 + 100), 2);
									result_max = adv_format(((shuru - 50000) * 0.01 + 500), 2);
									result = result_min + "至" + result_max;
								} else if(shuru > 100000) {
									result_min = adv_format(((shuru - 100000) * 0.005 + 600), 2);
									result_max = adv_format(((shuru - 100000) * 0.005 + 1000), 2);
									result = result_min + "至" + result_max;
								}

								document.formsuan.textfieldsuanrenge.value = result;
							}

							function rengec() {

								var result = 0;
								var shuru = document.formsuan.textfieldshururengec.value;
								if(shuru > 600) {
									result = "大于100000";
								} else if(shuru > 500 && shuru <= 600) {
									result = "50000至100000";
								} else {
									result = "人格权标的<=50000";
								}
								document.formsuan.textfieldfanrengec.value = result

							}