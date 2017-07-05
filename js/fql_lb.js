	
		var index=0;
		$(".img_item").addClass("animated slideInRight");
		$(".img_item").eq(0).siblings().hide();
		$(".img_item").eq(0).show();
		function fql_lb(){
			if(index<=$(".img_item").length){
			  $(".img_item").eq(index).show();
			  $(".img_item").eq(index).siblings().hide()
			}else{
				index=0;
			}
			index+=1;
		}
		var fql_lbTimer=setInterval('fql_lb()',3000);