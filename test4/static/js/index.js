window.onload = function(){
	var stride = 0.5;
	var hero_x = parseFloat($(".my_hero_class").css("left"));
	var hero_y = parseFloat($(".my_hero_class").css("top"));
	var im_index = 0;
	var height = document.body.clientHeight;
	var width = document.body.clientWidth;
	var scroll_x = 0;
	var scroll_y = 0;
	var gun_num = 0;
	var gun_label = 0;
	var num = 0;
	var gun_src = "";
	var attack_label = 0;
	var befor_herolife = parseFloat($(".my_hero_class").attr("alt"));
	var my_attack_label = 0;
	var my_attack_num = 0;
	/*移动变量*/
	var x = parseFloat($(".my_hero_class").css("left"));
	var y = parseFloat($(".my_hero_class").css("top"));

    /*隐藏滚动条*/
	$("body").css("overflow","hidden");
	function sleep(time){
	var starttime = new Date().getTime();
	while(true){var nowtime = new Date().getTime();if(nowtime>starttime+time)break;};
}
	function showhero(){
	    if(my_attack_label==1){
	    my_attack_num += 1;
	    if(my_attack_num==50){
	    my_attack_label = 0;
	    my_attack_num = 0;
	    $(".my_attack_class").remove();
	    };
	    };
	    /*攻击*/
	    $(".gun_class").each(function(index){
	    var gun = $(this);
	    var attack_left = parseFloat($(this).css("left"));
	    var attack_top = parseFloat($(this).css("top"));
	    if(attack_left<=0||attack_left>=3000){
	    gun.remove();
	    $.ajax({
            	url: 'delete_skill/',
            	type: 'post',
            	data: {
            	skill_id:gun.attr("alt"),
            	},
            	success: function (data) {

                    },
        	});
	    };
	    /*删除子弹*/
	    $(this).css("left",attack_left-6);
	    $(".build_class").each(function(index){
	    if(attack_left>parseFloat($(this).css("left"))-80&&attack_left<parseFloat($(this).css("left"))+parseFloat($(this).css("width"))&&attack_top>parseFloat($(this).css("top"))-80&&attack_top<parseFloat($(this).css("top"))+parseFloat($(this).css("height")))
	        {
	        $.ajax({
            	url: 'delete_skill/',
            	type: 'post',
            	data: {
            	skill_id:gun.attr("alt"),
            	},
            	success: function (data) {

                    },
        	});
	    };
	        gun.remove();
	    });
	    $(".hero_class").each(function(index){
	        if(attack_left>parseFloat($(this).css("left"))-80&&attack_left<parseFloat($(this).css("left"))+150&&attack_top>parseFloat($(this).css("top"))-80&&attack_top<parseFloat($(this).css("top"))+150)
	        {
	            attack_label = 1;
                $.ajax({
            	url: '/attack_hero/',
            	type: 'post',
            	data: {
            	heroname:$(".heroname_class").eq(index+1).text(),
            	skill_id:gun.attr("alt"),
            	},
            	success: function (data) {
                    /*var add_str = "";
                    for(var i=0;i<data.attack_name.length;i++){
                    add_str += '<span class="attack_class" style="position:absolute;left:'+parseFloat(data.attack_name[i].hero_x+50).toString()+'px;top:'+parseFloat(data.attack_name[i].hero_y+50).toString()+'px;color:red;z-index:1;font-size:26px;">伤害-'+data.attack_name[i].herofire+'</span>';
                    $("body").prepend(add_str);*/
                    var add_str = '<span class="attack_class" style="position:absolute;left:'+parseFloat(data.attack_name.hero_x+50).toString()+'px;top:'+parseFloat(data.attack_name.hero_y+50).toString()+'px;color:red;z-index:1;font-size:26px;">伤害-'+data.attack_name.herofire+'</span>';
                    $("body").prepend(add_str);
                    },
        	});
        	gun.remove();
	        };
	    });
	    });
        if(gun_label==1){gun_num = gun_num + 1;
	    if(gun_num==50){gun_num=0;gun_label=0;
	        $.ajax({
            	url: 'changegun/',
            	type: 'post',
            	data: {
                username:$("title").text(),
                label:'0',
            	},
            	success: function (data) {
                    $("#skill_id").remove();
            	},
        	});
	    }};
	    if(attack_label==1){num = num + 1;
	    if(num==50){$(".attack_class").remove();num=0;attack_label=0;}};
	    auto_move();
		/*跑图功能*/
		scroll_x = hero_x - window.innerHeight/2;
		scroll_y = hero_y - window.innerHeight/2;
		if(scroll_x<0){scroll_x=0;};
		if(scroll_y<0){scroll_y=0;};
		if(scroll_x>($(document).width()-window.innerWidth)){scroll_x = $(document).width()-window.innerWidth;};
		if(scroll_y>($(document).height()-window.innerHeight)){scroll_y = $(document).height()-window.innerHeight;};
		$(document).scrollTop(scroll_y);
		$(document).scrollLeft(scroll_x-100);

	
	if($("title").text()!=""){
	$.ajax({
            url: '/showhero/',
            type: 'post',
            data: {map_id:'1',
                label:gun_label,
                hero_x:hero_x,
		        hero_y:hero_y,
		        x:x,
		        y:y,
		        },
            success: function (data) {
		/*if(data.error=='error'){clearTimeout(mytime);window.location.href="http://127.0.0.1:8000/login/"};*/
		if(data.my_hero.herolife<=0){
		$.ajax({
            	url: '/gosleep/',
            	type: 'post',
            	data: {
                username:$("title").text(),
            	},
            	success: function (data) {

            	},
        	});
		window.location.href="http://127.0.0.1:8000/sleep/";};
		$("#herolife_id").attr('style','position:absolute;left:'+parseFloat(hero_x+40).toString()+'px;top:'+parseFloat(hero_y-40).toString()+'px;background-color:red;color:#fff;');
		$("#herolife_id").text(data.my_hero.herolife);
		if(Math.abs(data.my_hero.herolife-befor_herolife)>=200){
		my_attack_label = 1;
		drop_life = Math.abs(data.my_hero.herolife-befor_herolife);
		var add_my_str = '<span class="my_attack_class" style="position:absolute;left:'+parseFloat(hero_x+50).toString()+'px;top:'+parseFloat(hero_y+50).toString()+'px;color:red;z-index:1;font-size:26px;">伤害-'+drop_life+'</span>';
		$("body").prepend(add_my_str);
		};
		befor_herolife = data.my_hero.herolife;
		var my_back_x = 80*(parseFloat(data.my_hero.herolife)/1000);
        var str_hero_list = '<img src="/static/image/timg.png" alt="'+data.my_hero.herolife+'" class="my_hero_class" style="position:absolute;left:'+data.my_hero.hero_x+'px;top:'+data.my_hero.hero_y+'px;">'
        str_hero_list = str_hero_list + '<img id="herofire_id" src="'+data.my_hero.herofire+'" style="position:absolute;left:'+data.my_hero.weapon_x+'px;top:'+data.my_hero.weapon_y+'px;">'
        str_hero_list = str_hero_list + '<span class="heroname_class" style="position:absolute;left:'+parseFloat(data.my_hero.hero_x+40)+'px;top:'+parseFloat(data.my_hero.hero_y-50)+'px;z-index:'+im_index.toString()+';background-color:#f0f;width:100px">'+data.my_hero.heroname+'</span>'
        str_hero_list = str_hero_list + '<span class="herolifeback_class" style="position:absolute;left:'+parseFloat(data.my_hero.hero_x+my_back_x+40)+'px;top:'+parseFloat(data.my_hero.hero_y-25)+'px;z-index:'+(im_index+1).toString()+';background-color:#000;width:'+parseFloat(80-my_back_x)+'px;height:20px"></span>';
		str_hero_list = str_hero_list + '<span style="position:absolute;left:'+parseFloat(data.my_hero.hero_x)+'px;top:'+parseFloat(data.my_hero.hero_y-50)+'px;z-index:'+im_index.toString()+';background-color:#f0f;">Lv:'+data.my_hero.herolevel+'</span>'
		for (var i=0;i<data.hero_list.length;i++){
		var back_x = 80*(parseFloat(data.hero_list[i].herolife)/1000);
		str_hero_list = str_hero_list + '<img src="/static/image/timg.png" class="hero_class" style="position:absolute;left:'+data.hero_list[i].hero_x+'px;top:'+data.hero_list[i].hero_y+'px;"><img src="'+data.hero_list[i].herofire+'" style="position:absolute;left:'+parseFloat(data.hero_list[i].weapon_x)+'px;top:'+parseFloat(data.hero_list[i].weapon_y)+'px;">'
		str_hero_list = str_hero_list + '<span class="heroname_class" style="position:absolute;left:'+parseFloat(data.hero_list[i].hero_x+40)+'px;top:'+parseFloat(data.hero_list[i].hero_y-50)+'px;z-index:'+im_index.toString()+';background-color:#f0f;width:100px">'+data.hero_list[i].heroname+'</span>'
		str_hero_list = str_hero_list + '<span class="herolife_class" style="position:absolute;left:'+parseFloat(data.hero_list[i].hero_x+40)+'px;top:'+parseFloat(data.hero_list[i].hero_y-25)+'px;z-index:'+im_index.toString()+';background-color:red;width:80px;height:20px;color:#000;">'+data.hero_list[i].herolife+'</span>'
		str_hero_list = str_hero_list + '<span class="herolifeback_class" style="position:absolute;left:'+parseFloat(data.hero_list[i].hero_x+back_x+40)+'px;top:'+parseFloat(data.hero_list[i].hero_y-25)+'px;z-index:'+(im_index+1).toString()+';background-color:#000;width:'+parseFloat(80-back_x)+'px;height:20px"></span>';
		str_hero_list = str_hero_list + '<span style="position:absolute;left:'+parseFloat(data.hero_list[i].hero_x)+'px;top:'+parseFloat(data.hero_list[i].hero_y-50)+'px;z-index:'+im_index.toString()+';background-color:#f0f;">Lv:'+data.hero_list[i].herolevel+'</span>'
		};
		var skill_str = "";
		for(var i=0;i<data.skill_list.length;i++){
		skill_str = skill_str + '<img class="gun_class" src="'+data.skill_list[i].skillname+'" style="position:absolute;width:200px;height:130px;left:'+data.skill_list[i].skill_x+'px;top:'+parseFloat(data.skill_list[i].skill_y-50)+'px" alt="'+data.skill_list[i].skill_id+'">'
		};
		$("body").prepend(skill_str);
		$("#hero_list").prepend(str_hero_list);
		$("#hero_list .my_hero_class").last().nextAll().remove();
		$("#hero_list .my_hero_class").last().remove();
            },
        });}
	

	mytime = setTimeout(arguments.callee,20)
};
	$("body").keydown(function(e){
	    if(gun_num==0){
		switch(e.which){
	
		case 81:
		var label = "3";
		if(x>parseFloat(hero_x)){label='2';}else if(x<parseFloat(hero_x)){label='1';};
		$.ajax({
            	url: 'changegun/',
            	type: 'post',
            	data: {
                username:$("title").text(),
                label:label,
            	},
            	success: function (data) {
                    var skill_alt = '<span id="skill_id" style="position:absolute;left:'+parseFloat(hero_x-50)+'px;top:'+hero_y+'px;font-size:30px;color:red;">嗖</span>';
            	    $("body").prepend(skill_alt);
            	},
        	});
        $.ajax({
            	url: 'attackgun/',
            	type: 'post',
            	data: {
                skillname:'/static/image/attack.png',
                username:$("title").text(),
                x:x,
                y:y,
            	},
            	success: function (data) {

            	},
        	});
		gun_num = 1;
		gun_label = 1;
		};}else{e.preventDefault();};
	});

	function auto_move(){
	    var scale_x = Math.pow(Math.pow(x-hero_x,2)/(Math.pow(x-hero_x,2)+Math.pow(y-hero_y,2)),0.5);
		var scale_y = Math.pow(Math.pow(y-hero_y,2)/(Math.pow(x-hero_x,2)+Math.pow(y-hero_y,2)),0.5);
		if(x<hero_x){scale_x = -scale_x;};
		if(y<hero_y){scale_y = -scale_y;};
		var status_move = 1;
		$(".hero_class").each(function(index){
	    var build_x = parseFloat($(this).css("left"));
	    var build_y = parseFloat($(this).css("top"));
	    var height = parseFloat($(this).css("height"))
	    var width = parseFloat($(this).css("width"))
	    if(((hero_x+scale_x*stride>=build_x-150)&&(hero_x+scale_x*stride<build_x+150))&&((hero_y+scale_y*stride>build_y-150)&&(hero_y+scale_y*stride<build_y+150))){status_move=0;};
	    });
	     if(Math.abs(x-hero_x)>=2&&status_move==1){hero_x = hero_x+scale_x*stride;hero_y = hero_y+scale_y*stride;}else if(Math.abs(x-hero_x)>=2){hero_x = hero_x-scale_x*stride;hero_y = hero_y-scale_y*stride;};
		$(".build_class").each(function(index){
	    var build_x = parseFloat($(this).css("left"));
	    var build_y = parseFloat($(this).css("top"));
	    var height = parseFloat($(this).css("height"))
	    var width = parseFloat($(this).css("width"))
	    if(((hero_x+scale_x*stride>=build_x-150)&&(hero_x+scale_x*stride<build_x+width))&&((hero_y+scale_y*stride>build_y-150)&&(hero_y+scale_y*stride<build_y+height))){status_move=0;};
	    });
	     if(Math.abs(x-hero_x)>=2&&status_move==1){hero_x = hero_x+scale_x*stride;hero_y = hero_y+scale_y*stride;}else if(Math.abs(x-hero_x)>=2){hero_x = hero_x-scale_x*stride;hero_y = hero_y-scale_y*stride;};
	};

	$("body").unbind('click').click(function(e){
		x = e.pageX;
		y = e.pageY;
		auto_move();

		/*跑图功能*/
		/*if(scroll_x<0){scroll_x=0;};
		if(scroll_y<0){scroll_y=0;};
		if(scroll_x>($(document).width()-window.innerWidth)){scroll_x = $(document).width()-window.innerWidth;};
		if(scroll_y>($(document).height()-window.innerHeight)){scroll_y = $(document).height()-window.innerHeight;};
		if((hero_x-$(document).scrollLeft())>(width/2)){scroll_x = scroll_x + 20;$(document).scrollLeft(scroll_x)};
		if((hero_y-$(document).scrollTop())>(height/2)){scroll_y = scroll_y + 20;$(document).scrollTop(scroll_y)};
		if((hero_x-$(document).scrollLeft())<(width/2)){scroll_x = scroll_x - 20;$(document).scrollLeft(scroll_x)};
		if((hero_y-$(document).scrollTop())<(height/2)){scroll_y = scroll_y - 20;$(document).scrollTop(scroll_y)};
		*/
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
		$("#herolife_id").attr('style','position:absolute;left:'+parseFloat(hero_x).toString()+'px;top:'+parseFloat(hero_y-50).toString()+'px;background-color:red;width:80px;height:20px;');
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
	
	$("#gosleep_id").click(function(event){
		/*解决点击事件冲突，阻止事件冒泡*/
		event.stopPropagation();
		window.location.href = "http://127.0.0.1:8000/sleep/";
		$.ajax({
            	url: '/gosleep/',
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
