window.onload = function(){
	var stride =1;
	var hero_x = parseFloat($(".my_hero_class").css("left"));
	var hero_y = parseFloat($(".my_hero_class").css("top"));
	var im_index = 0;
	var height = document.body.clientHeight;
	var width = document.body.clientWidth;
	var scroll_x = 0;
	var scroll_y = 0;
	/*移动变量*/
	var x = parseFloat($(".my_hero_class").css("left"));
	var y = parseFloat($(".my_hero_class").css("top"));

	function auto_move(){
	    var scale_x = Math.pow(Math.pow(x-hero_x,2)/(Math.pow(x-hero_x,2)+Math.pow(y-hero_y,2)),0.5);
		var scale_y = Math.pow(Math.pow(y-hero_y,2)/(Math.pow(x-hero_x,2)+Math.pow(y-hero_y,2)),0.5);
		if(x<hero_x){scale_x = -scale_x;};
		if(y<hero_y){scale_y = -scale_y;};
        if(Math.abs(x-hero_x)>=1){hero_x = hero_x+scale_x*stride;};
		if(Math.abs(y-hero_y)>=1){hero_y = hero_y+scale_y*stride;};
	};
	/*隐藏滚动条*/
	$("body").css("overflow","hidden");
	function showhero(){
	    auto_move()
		scroll_x = hero_x - document.body.clientWidth/2;
		scroll_y = hero_y - document.body.clientHeight/2;
		if(scroll_x<0){scroll_x=0;};
		if(scroll_y<0){scroll_y=0;};
		if(scroll_x>($(document).width()-document.body.scrollWidth)){scroll_x = $(document).width()-document.body.scrollWidth;};
		if(scroll_y>($(document).height()-document.body.scrollHeight)){scroll_y = $(document).height()-document.body.scrollHeight;};
		$(document).scrollTop(scroll_y);
		$(document).scrollLeft(scroll_x);

		/*血池恢复功能*/
		var restor_x = $("#restoration_id").css("left");
		var restor_y = $("#restoration_id").css("top");
		if($("title").text()!=""){
	$.ajax({
            url: '/showhero/',
            type: 'post',
            data: {map_id:'2',
            restor_x:restor_x,
            restor_y:restor_y,
            hero_x:hero_x,
            hero_y:hero_y},
            success: function (data) {
		/*if(data.error=='error'){clearTimeout(mytime);window.location.href="http://127.0.0.1:8000/login/"};*/
		im_index = im_index + 1;
		$("#herolife_id").attr('style','position:absolute;left:'+parseFloat(hero_x)+'px;top:'+parseFloat(hero_y-50).toString()+'px;background-color:red;width:150;height:50;text-align:center');
		console.log(hero_x);
		$("#herolife_id").text(data.my_hero.herolife);
        var str_hero_list = '<img src="/static/image/timg.png" class="my_hero_class" style="position:absolute;left:'+data.my_hero.hero_x+'px;top:'+data.my_hero.hero_y+'px;z-index:'+im_index.toString()+';"><span class="heroname_class" style="position:absolute;left:'+data.my_hero.hero_x+'px;top:'+parseFloat(data.my_hero.hero_y-50)+'px;z-index:'+im_index.toString()+';background-color:#f0f;">'+data.my_hero.heroname+'</span>';
		for (var i=0;i<data.hero_list.length;i++){
		str_hero_list = str_hero_list + '<img src="/static/image/timg.png" class="hero_class" style="position:absolute;left:'+data.hero_list[i].hero_x+'px;top:'+data.hero_list[i].hero_y+'px;z-index:'+im_index.toString()+';"><span class="heroname_class" style="position:absolute;left:'+data.hero_list[i].hero_x+'px;top:'+parseFloat(data.hero_list[i].hero_y-50)+'px;z-index:'+im_index.toString()+';background-color:#f0f;">'+data.hero_list[i].heroname+'</span>';
		};
		$("#hero_list").prepend(str_hero_list);
		$("#hero_list .my_hero_class").last().nextAll().remove();
		$("#hero_list .my_hero_class").last().remove();
            },
        });}

	mytime = setTimeout(arguments.callee,20);

	};

	$("body").unbind('click').click(function(e){
		x = e.pageX;
		y = e.pageY;
		auto_move()
		if(scroll_x<0){scroll_x=0;};
		if(scroll_y<0){scroll_y=0;};
		if(scroll_x>($(document).width()-document.body.scrollWidth)){scroll_x = $(document).width()-document.body.scrollWidth;};
		if(scroll_y>($(document).height()-document.body.scrollHeight)){scroll_y = $(document).height()-document.body.scrollHeight;};
		if((hero_x-$(document).scrollLeft())>(width/2)){scroll_x = scroll_x + 20;$(document).scrollLeft(scroll_x)};
		if((hero_y-$(document).scrollTop())>(height/2)){scroll_y = scroll_y + 20;$(document).scrollTop(scroll_y)};
		if((hero_x-$(document).scrollLeft())<(width/2)){scroll_x = scroll_x - 20;$(document).scrollLeft(scroll_x)};
		if((hero_y-$(document).scrollTop())<(height/2)){scroll_y = scroll_y - 20;$(document).scrollTop(scroll_y)};
		var heroname = $(".my_hero_class").next().text();
		$.ajax({
            	url: '/move/',
            	type: 'post',
            	data: {
                hero_x:hero_x,
		        hero_y:hero_y,
		        heroname:heroname,
            	},
            	success: function (data) {
                $(".my_hero_class").css("left",parseFloat(hero_x).toString()+"px");
		$(".my_hero_class").css("top",parseFloat(hero_y).toString()+"px");
		$(".my_hero_class").attr('src',data);
            	},
        	});
		$	("#herolife_id").attr('style','position:absolute;left:'+parseFloat(hero_x).toString()+'px;top:'+parseFloat(hero_y-50).toString()+'px;background-color:red;width:150;height:50;text-align:center');
	});

	$("#exit_id").click(function(){
	$.ajax({
            	url: '/exit/',
            	type: 'post',
            	data: {
                username:$("title").text(),
            	},
            	success: function (data) {
                
            	},
        	});
	});

	$("#goattack_id").click(function(event){
		/*解决点击事件冲突，阻止事件冒泡*/
		event.stopPropagation();
		window.location.href = "http://127.0.0.1:8000/index/";
		$.ajax({
            	url: '/goattack/',
            	type: 'post',
            	data: {
                username:$("title").text(),
            	},
            	success: function (data) {
               
            	},
        	});
	});
var mytime = setTimeout(showhero,20);
};
