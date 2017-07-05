(function($,win,doc,unde){
	$.fn.pageFun = function(options){
		var defaults = {
			pageDiv   : $(this).find(".pageDiv"),
			pageDivLi : $(this).find(".pageDiv li"),
			page      : $(this).find(".page"),
			pageMenu  : $(this).find(".pageMenu"),
			pageMenuLi: $(this).find(".pageDiv li"),
			firstPage : $(this).find(".firstPage"),
			prevPage  : $(this).find(".prevPage"),
			pageNum   : $(this).find(".pageNum"),
			nextPage  : $(this).find(".nextPage"),
			pageObj   : $(this).find(".pageObj"),
			pageObjLi : $(this).find(".pageObj li"),
			lastPage  : $(this).find(".lastPage"),
            keuInput  : $(this).find(".keuInput"),
            btnSure   : $(this).find(".btnSure"),
			notContent: $(this).find(".notContent"),
			totalPage : $(this).find(".totalPage"),
			pNum      : 1,
			lastNum   : 0,
			cacheNum  : 1,
			min       : 0,
			res       :null
		};
		var opts = $.extend({},defaults,options);

		var Method = {
			init : function(){
				Method.getData(); /*请求接口获得数据*/
				Method.handleEvent(); /*事件处理*/
			},

			getData : function(){
			
				 $.getJSON(opts.interFace,function(data){
				    if(data.ret == '200'){
				    	opts.res = data.data;
				    	if((opts.res.length <= opts.displayCount)&&(opts.res.length > 0)){
							opts.displayCount = opts.res.length;
	                        opts.lastPage.addClass("disabled");
							opts.nextPage.addClass("disabled");
				    	}else if(opts.res.length == 0){
				    		opts.notContent.removeClass("hide");

				    		opts.firstPage.addClass("disabled");
						 	opts.prevPage.addClass("disabled");
						 	opts.lastPage.addClass("disabled");
						 	opts.nextPage.addClass("disabled");
						 	opts.firstPage.off("click");
						 	opts.lastPage.off("click");
						 	opts.prevPage.off("click");
						 	opts.nextPage.off("click");
							return;
				    	}
				    	else{
				    
				    		opts.pNum = Math.ceil(opts.res.length / opts.displayCount);
				    	}

				    	opts.notContent.addClass("hide");
                		for (var i = 0; i < opts.displayCount; i++) {
                            opts.pageDiv.append(opts.dataFun(opts.res[i]));
                        }

                        for (var i = 0; i < opts.pNum; i++) {
                            opts.pageObj.append(opts.pageFun(i+1));
                        }

						opts.firstPage.addClass("disabled");
						opts.prevPage.addClass("disabled");
                        opts.pageObj.find("li:first-child").addClass("active");
                        opts.totalPage.text(opts.pNum);
                        Method.showPageindex(0, opts.maxPage, 0);
                	}
                	else{

                	}
				  });
			},
			handleEvent : function(){
				opts.pageObj.on("click","li",function(){  /*点击页码切换*/
					$(this).addClass("active");
					opts.pageDiv.empty();
					$(this).siblings("li").removeClass("active");

	                opts.cacheNum = $(this).text();
					if($(this).text() == 1){
						 opts.firstPage.addClass("disabled");
						 opts.prevPage.addClass("disabled");
						 opts.lastPage.removeClass("disabled");
						 opts.nextPage.removeClass("disabled");
	                    if (opts.pNum == 1) {
	                      	 opts.lastPage.addClass("disabled");
							 opts.nextPage.addClass("disabled");
							 Method.xhhtml($(this).text(),opts.res.length);
							 return ;
	                    };
                  
					}else if($(this).text() == opts.pNum){
						 opts.firstPage.removeClass("disabled");
						 opts.prevPage.removeClass("disabled");
						 opts.lastPage.addClass("disabled");
						 opts.nextPage.addClass("disabled");

					 	if(opts.res.length<(opts.displayCount*opts.pNum)){
							Method.xhhtml($(this).text(),opts.res.length);
							return
						}

					}else{
						opts.firstPage.removeClass("disabled");
						 opts.prevPage.removeClass("disabled");
						 opts.lastPage.removeClass("disabled");
						 opts.nextPage.removeClass("disabled");
					}
					Method.showPageindex(0, opts.maxPage, $(this).text());
					Method.xhhtml($(this).text(),$(this).text()*opts.displayCount);
				});

				opts.prevPage.on("click",function(){ /*点击上页*/
					
					if(opts.cacheNum == 1){

						return;
					}

					if(opts.cacheNum == 2){
						opts.firstPage.addClass("disabled");
						opts.prevPage.addClass("disabled");
					}

					opts.pageDiv.empty();
					opts.cacheNum--
					opts.lastPage.removeClass("disabled");
					opts.nextPage.removeClass("disabled");
					$(".pageObj li").eq(opts.cacheNum-1).addClass("active");
					$(".pageObj li").eq(opts.cacheNum-1).siblings("li").removeClass("active");
					Method.xhhtml(opts.cacheNum,opts.cacheNum*opts.displayCount);
					Method.showPageindex(0, opts.maxPage, opts.cacheNum);
				});

				opts.nextPage.on("click",function(){  /*点击下页*/
					 
					if(opts.cacheNum == opts.pNum){
						return;
					}
					opts.pageDiv.empty();
					opts.cacheNum++
					$(".pageObj li").eq(opts.cacheNum-1).addClass("active");
					$(".pageObj li").eq(opts.cacheNum-1).siblings("li").removeClass("active");
					if(opts.cacheNum == opts.pNum){
						opts.lastPage.addClass("disabled");
						opts.nextPage.addClass("disabled");
						Method.xhhtml(opts.cacheNum,opts.res.length);
					}else{
						Method.xhhtml(opts.cacheNum,opts.cacheNum*opts.displayCount);
						opts.firstPage.removeClass("disabled");
						opts.prevPage.removeClass("disabled");
					}
					Method.showPageindex(0, opts.maxPage, opts.cacheNum);
				});

				opts.firstPage.on("click",function(){   /*点击首页*/
					opts.pageDiv.empty();
					opts.firstPage.addClass("disabled");
					opts.prevPage.addClass("disabled");
					opts.lastPage.removeClass("disabled");
					opts.nextPage.removeClass("disabled");
					$(".pageObj li").eq(0).addClass("active");
					$(".pageObj li").eq(0).siblings("li").removeClass("active");
					Method.xhhtml(1,opts.displayCount);
					opts.cacheNum = 1;
					Method.showPageindex(0, opts.maxPage, 0);
				});

				opts.lastPage.on("click",function(){  /*点击尾页*/
					opts.pageDiv.empty();
					opts.firstPage.removeClass("disabled");
					opts.prevPage.removeClass("disabled");
					opts.lastPage.addClass("disabled");
					opts.nextPage.addClass("disabled");
					$(".pageObj li").eq(opts.pNum-1).addClass("active");
					$(".pageObj li").eq(opts.pNum-1).siblings("li").removeClass("active");
					opts.cacheNum = opts.pNum;
					Method.xhhtml(opts.pNum,opts.res.length);
					Method.showPageindex(0, opts.maxPage, opts.pNum);
				});

				opts.btnSure.on("click",function(){   /*输入页码 跳转*/
                    var val = opts.keuInput.val();
                    if((val == "")||val<=0){
                    	opts.keuInput.val(1);
                    	alert("请输入有效页码");
                        return
                    }

                    if((Number(val)>opts.pNum)){
                    	alert('共'+opts.pNum+'页');
                        return
                    }
                    opts.pageDiv.empty();

                    $(".pageObj li").eq(val-1).addClass("active");
                    $(".pageObj li").eq(val-1).siblings("li").removeClass("active");
                    opts.cacheNum = val;
                    Method.showPageindex(0, opts.maxPage, val);
                    if(val == "1"){
                        opts.firstPage.addClass("disabled");
                        opts.prevPage.addClass("disabled");
                        opts.lastPage.removeClass("disabled");
                        opts.nextPage.removeClass("disabled");
                        if(opts.pNum == 1){
                            opts.firstPage.addClass("disabled");
                            opts.prevPage.addClass("disabled");
                            opts.lastPage.addClass("disabled");
                            opts.nextPage.addClass("disabled");
						}
					}else if(val == opts.pNum){

                        opts.firstPage.removeClass("disabled");
                        opts.prevPage.removeClass("disabled");
                        opts.lastPage.addClass("disabled");
                        opts.nextPage.addClass("disabled");
                        Method.xhhtml(val,opts.res.length);
                        return;
					}else {
                        opts.firstPage.removeClass("disabled");
                        opts.prevPage.removeClass("disabled");
                        opts.lastPage.removeClass("disabled");
                        opts.nextPage.removeClass("disabled");
					}


                    Method.xhhtml(val,val*opts.displayCount);
                });

			},
			xhhtml : function(index,count){
				for (var i = ((index-1)*opts.displayCount); i < count; i++) {
                    opts.pageDiv.append(opts.dataFun(opts.res[i]));
                }
                opts.keuInput.val(index);
			},
			showPageindex : function(min, max, index) {
                if (index <= Math.ceil(max / 2)) {
                    min = 0;
                    max = max;
                }
                else if (opts.pNum - index < Math.ceil(max / 2)) {
                    min = opts.pNum - max;
                    max = opts.pNum ;
                } 
			 else {

                    min = Math.round(index - max / 2)-1;
                    max = Math.round(Number(index) + Number(max / 2))-1;
                }
                $(".pageObj li").hide();
                for (var i = min; i < max; i++) {
                    $(".pageObj li").eq(i).show();
                }
            }
		}

		Method.init();
	}
})(jQuery,window,document,undefined)