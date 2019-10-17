window.onload = function(){
	var stride = 20;
	var hero_x = parseInt($(".my_hero_class").css("left"));
	var hero_y = parseInt($(".my_hero_class").css("top"));
	var im_index = 0;
	function sleep(time){
	var starttime = new Date().getTime();
	while(true){var nowtime = new Date().getTime();if(nowtime>starttime+time)break;};
}
	function showhero(){
	if($("title").text()!=""){
	$.ajax({
            url: '/showhero/',
            type: 'post',
            data: {},
            success: function (data) {
		if(data.error=='error'){clearTimeout(mytime);}
		im_index = im_index + 1;
		$("#herolife_id").attr('style','position:absolute;left:'+parseInt(hero_x).toString()+'px;top:'+parseInt(hero_y-50).toString()+'px;background-color:red;width:150;height:50;text-align:center');
		$("#herolife_id").text(data.my_hero.herolife);
                var str_hero_list = '<img src="/static/image/timg.png" class="my_hero_class" style="position:absolute;left:'+data.my_hero.hero_x+'px;top:'+data.my_hero.hero_y+'px;z-index:'+im_index.toString()+';"><span>'+data.my_hero.heroname+'</span>';
		for (var i=0;i<data.hero_list.length;i++){
		str_hero_list = str_hero_list + '<img src="/static/image/timg.png" class="hero_class" style="position:absolute;left:'+data.hero_list[i].hero_x+'px;top:'+data.hero_list[i].hero_y+'px;z-index:'+im_index.toString()+';">';
		};
		$("#hero_list").prepend(str_hero_list);
		$("#hero_list .my_hero_class").last().nextAll().remove();
		$("#hero_list .my_hero_class").last().remove();
            },
        });}
	

	setTimeout(arguments.callee,1000)
};
	$("body").keydown(function(e){
		switch(e.which){
	
		case 81:	
		$.ajax({
            	url: '/attack_hero/',
            	type: 'post',
            	data: {},
            	success: function (data) {
                alert(data);
           	 },
        	});
		};
	});
	$("body").unbind('click').click(function(e){
		var x = e.pageX;
		var y = e.pageY;
		var scale_x = Math.pow(Math.pow(x-hero_x,2)/(Math.pow(x-hero_x,2)+Math.pow(y-hero_y,2)),0.5);
		var scale_y = Math.pow(Math.pow(y-hero_y,2)/(Math.pow(x-hero_x,2)+Math.pow(y-hero_y,2)),0.5);
		if(x<hero_x){scale_x = -scale_x;};
		if(y<hero_y){scale_y = -scale_y;};

		hero_x = hero_x+scale_x*stride;
		hero_y = hero_y+scale_y*stride;
	
		console.log(hero_x);
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
                $(".my_hero_class").css("left",parseInt(hero_x).toString()+"px");
		$(".my_hero_class").css("top",parseInt(hero_y).toString()+"px");
		$(".my_hero_class").attr('src',data);
            	},
        	});
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
	mytime = setTimeout(showhero,1000);
};
