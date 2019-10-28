window.onload = function(){
	/*步长*/
	var stride = 10;
	/*英雄横纵坐标*/
	var hero_x = parseFloat($(".my_hero_class").css("left"));
	var hero_y = parseFloat($(".my_hero_class").css("top"));
	/*权重值*/
	var im_index = 0;
	/*滚动条的绝对位置*/
	var scroll_x = 0;
	var scroll_y = 0;
	/*攻击标记组*/
	var gun_num = 0;
	var gun_label = 0;
	var gun_src = "";
	/*按键技能标记*/
	var num = 0;
	/*子弹打中人标记*/
	var attack_label = 0;
	var befor_herolife = parseFloat($(".my_hero_class").attr("alt"));
	var my_attack_label = 0;
	var my_attack_num = 0;
	/*移动变量*/
	var x = parseFloat($(".my_hero_class").css("left"));
	var y = parseFloat($(".my_hero_class").css("top"));
    /*移动函数*/
	function auto_move(){
	    var scale_x = Math.pow(Math.pow(x-hero_x,2)/(Math.pow(x-hero_x,2)+Math.pow(y-hero_y,2)),0.5);
		var scale_y = Math.pow(Math.pow(y-hero_y,2)/(Math.pow(x-hero_x,2)+Math.pow(y-hero_y,2)),0.5);
		if(x<hero_x){scale_x = -scale_x;};
		if(y<hero_y){scale_y = -scale_y;};
        if(Math.abs(x-hero_x)>=stride){hero_x = hero_x+scale_x*stride;};
		if(Math.abs(y-hero_y)>=stride){hero_y = hero_y+scale_y*stride;};
	};
	function auto_scroll()
	{
	    scroll_x = hero_x - window.innerHeight/2;
		scroll_y = hero_y - window.innerHeight/2;
		if(scroll_x<0){scroll_x=0;};
		if(scroll_y<0){scroll_y=0;};
		if(scroll_x>($(document).width()-window.innerWidth)){scroll_x = $(document).width()-window.innerWidth;};
		if(scroll_y>($(document).height()-window.innerHeight)){scroll_y = $(document).height()-window.innerHeight;};
		$(document).scrollTop(scroll_y);
		$(document).scrollLeft(scroll_x-100);
	};
	/*隐藏滚动条*/
	$("body").css("overflow","hidden");
	/*禁止窗口拖拽图片*/
    $("img").each(function(e){
    $(this).on("contextmenu",function(){return false;});
    $(this).on("dragstart",function(){return false;});
    });
	/*设置聊天*/
	function chat_set()
	{
	    var chat_x = scroll_x-100;
	    if(chat_x<0){chat_x=0;}
	    var chat_y = scroll_y+window.innerHeight-200;
        $("#chat_id").css("left",chat_x);
        $("#chat_id").css("top",chat_y);
	}

	/*设置菜单栏位置*/
	function setmenupost(obj,menu_x)
	{
	menu_x = menu_x*window.innerWidth;
	var menu_x = parseFloat(menu_x + scroll_x);
	var menu_y = parseFloat(scroll_y);
    obj.css("left",menu_x);
    obj.css("top",menu_y)
	}

	/*刷新图像方法*/
	function showhero(){
	    /*跑图功能*/
	    auto_move();
	    auto_scroll();
	    /*聊天设置*/
	    chat_set()
	    /*菜单栏显示位置*/
	    setmenupost($("#exit_id"),0.8);
	    setmenupost($("#goattack_id"),0.15)
	    setmenupost($("#adventrue_id"),0.3);
	    setmenupost($("#boss_id"),0.45)
	    setmenupost($("#menu_id"),0)
	    setmenupost($("#goods_id"),0.6)
	    /*自己被伤害显示自动消失*/
	    if(my_attack_label==1){
	    my_attack_num += 1;
	    if(my_attack_num==50){
	    my_attack_label = 0;
	    my_attack_num = 0;
	    $(".my_attack_class").remove();
	    };
	    };
	    /*子弹越界处理*/
	    $(".gun_class").each(function(index){
	    var gun = $(this);
	    var attack_left = parseFloat($(this).css("left"));
	    var attack_top = parseFloat($(this).css("top"));
	    if(attack_left<=0||attack_left>=2000){
	    gun.remove();
	    $.ajax({
            	url: '/index/delete_skill/',
            	type: 'post',
            	data: {
            	skill_id:gun.attr("alt"),
            	},
            	success: function (data) {

                    },
        	});
	    };
	    /*子弹打中建筑物处理*/
	    $(this).css("left",attack_left-6);
	    $(".build_class").each(function(index){
	    if(attack_left>parseFloat($(this).css("left"))-80&&attack_left<parseFloat($(this).css("left"))+parseFloat($(this).css("width"))&&attack_top>parseFloat($(this).css("top"))-80&&attack_top<parseFloat($(this).css("top"))+parseFloat($(this).css("height")))
	        {
	        $.ajax({
            	url: '/index/delete_skill/',
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
	    /*子弹打中人物处理*/
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
	    /*让武器延迟换回并清楚技能语句*/
        if(gun_label==1){gun_num = gun_num + 1;
	    if(gun_num==50){gun_num=0;gun_label=0;
	        $.ajax({
            	url: '/index/changegun/',
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
	    /*让打中人后的伤害值延迟消失*/
	    if(attack_label==1){num = num + 1;
	    if(num==50){$(".attack_class").remove();num=0;attack_label=0;}};

	/*刷新主要请求数据获取*/
	    if($("title").text()!=""){
	    $.ajax({
            url: '/showhero/',
            type: 'post',
            data: {map_id:'2',
                label:gun_label,
                hero_x:hero_x,
		        hero_y:hero_y,
		        chat_label:$("#select_id option:selected").val(),
		        x:x,
		        y:y,
		        },
            success: function (data) {
            if(data.error=="error"){window.location.href="http://127.0.0.1:8000/login/";};
		/*if(data.error=='error'){clearTimeout(mytime);window.location.href="http://127.0.0.1:8000/login/"};*/

		/*$("#herolife_id").attr('style','position:absolute;left:'+parseFloat(hero_x+40).toString()+'px;top:'+parseFloat(hero_y-40).toString()+'px;background-color:red;color:#fff;');
		$("#herolife_id").text(data.my_hero.herolife);*/
		if(Math.abs(data.my_hero.herolife-befor_herolife)>=200){
		my_attack_label = 1;
		drop_life = Math.abs(data.my_hero.herolife-befor_herolife);
		var add_my_str = '<span class="my_attack_class" style="position:absolute;left:'+parseFloat(hero_x+50).toString()+'px;top:'+parseFloat(hero_y+50).toString()+'px;color:red;z-index:1;font-size:26px;">伤害-'+drop_life+'</span>';
		$("body").prepend(add_my_str);
		};
		befor_herolife = data.my_hero.herolife;
		var my_back_x = 80*(parseFloat(data.my_hero.herolife)/1000);
		$(".my_hero_class").css("left",data.my_hero.hero_x);
		$(".my_hero_class").css("top",data.my_hero.hero_y);
		$(".my_hero_class").attr("alt",data.my_hero.herolife);
		$("#herofire_id").attr("src",data.my_hero.herofire);
		$("#herofire_id").css("left",data.my_hero.weapon_x);
		$("#herofire_id").css("top",data.my_hero.weapon_y);
		$(".my_herolife_class").css("left",parseFloat(data.my_hero.hero_x+40));
		$(".my_herolife_class").css("top",parseFloat(data.my_hero.hero_y-25));
		$(".my_herolife_class").text(data.my_hero.herolife);
		$(".my_heroname_class").css("left",data.my_hero.hero_x+40);
		$(".my_heroname_class").css("top",data.my_hero.hero_y-50);
		$(".my_herolevel_class").css("left",data.my_hero.hero_x);
		$(".my_herolevel_class").css("top",data.my_hero.hero_y-50);
		$(".my_herolevel_class").text('Lv'+data.my_hero.herolevel);
		$(".my_herolifeback_class").css("left",data.my_hero.hero_x+my_back_x+40);
		$(".my_herolifeback_class").css("top",data.my_hero.hero_y-25);
		$(".my_herolifeback_class").css("width",80-my_back_x);
        /*var str_hero_list = '<img src="/static/image/timg.png" alt="'+data.my_hero.herolife+'" class="my_hero_class" style="position:absolute;left:'+data.my_hero.hero_x+'px;top:'+data.my_hero.hero_y+'px;">'
        str_hero_list = str_hero_list + '<img id="herofire_id" src="'+data.my_hero.herofire+'" style="position:absolute;left:'+data.my_hero.weapon_x+'px;top:'+data.my_hero.weapon_y+'px;">'*/

//        str_hero_list = str_hero_list + '<span class="my_heroname_class" style="position:absolute;left:'+parseFloat(data.my_hero.hero_x+40)+'px;top:'+parseFloat(data.my_hero.hero_y-50)+'px;z-index:'+im_index.toString()+';background-color:#f0f;width:100px">'+data.my_hero.heroname+'</span>'
//        str_hero_list = str_hero_list + '<span class="herolifeback_class" style="position:absolute;left:'+parseFloat(data.my_hero.hero_x+my_back_x+40)+'px;top:'+parseFloat(data.my_hero.hero_y-25)+'px;z-index:'+(im_index+1).toString()+';background-color:#000;width:'+parseFloat(80-my_back_x)+'px;height:20px"></span>';
//		str_hero_list = str_hero_list + '<span style="position:absolute;left:'+parseFloat(data.my_hero.hero_x)+'px;top:'+parseFloat(data.my_hero.hero_y-50)+'px;z-index:'+im_index.toString()+';background-color:#f0f;">Lv:'+data.my_hero.herolevel+'</span>'
		/*str_hero_list = str_hero_list + '<span class="my_herolife_class" style="position:absolute;left:'+parseFloat(data.my_hero.hero_x+40)+'px;top:'+parseFloat(data.my_hero.hero_y-25)+'px;z-index:'+im_index.toString()+';background-color:red;width:80px;height:20px;color:#fff;">'+data.my_hero.herolife+'</span>'*/
//        var str_hero_list = ""
//		for (var i=0;i<data.hero_list.length;i++){
//		str_hero_list = str_hero_list + '<img src="/static/image/timg.png" class="hero_class" style="position:absolute;left:'+data.hero_list[i].hero_x+'px;top:'+data.hero_list[i].hero_y+'px;"><img src="'+data.hero_list[i].herofire+'" style="position:absolute;left:'+parseFloat(data.hero_list[i].weapon_x)+'px;top:'+parseFloat(data.hero_list[i].weapon_y)+'px;">'
//		str_hero_list = str_hero_list + '<span class="heroname_class" style="position:absolute;left:'+parseFloat(data.hero_list[i].hero_x+40)+'px;top:'+parseFloat(data.hero_list[i].hero_y-50)+'px;z-index:'+im_index.toString()+';background-color:#f0f;width:100px">'+data.hero_list[i].heroname+'</span>'
//		str_hero_list = str_hero_list + '<span class="herolife_class" style="position:absolute;left:'+parseFloat(data.hero_list[i].hero_x+40)+'px;top:'+parseFloat(data.hero_list[i].hero_y-25)+'px;z-index:'+im_index.toString()+';background-color:red;width:80px;height:20px;color:#fff;">'+data.hero_list[i].herolife+'</span>'
//		str_hero_list = str_hero_list + '<span class="herolifeback_class" style="position:absolute;left:'+parseFloat(data.hero_list[i].hero_x+back_x+40)+'px;top:'+parseFloat(data.hero_list[i].hero_y-25)+'px;z-index:'+(im_index+1).toString()+';background-color:#000;width:'+parseFloat(80-back_x)+'px;height:20px"></span>';
//		str_hero_list = str_hero_list + '<span style="position:absolute;left:'+parseFloat(data.hero_list[i].hero_x)+'px;top:'+parseFloat(data.hero_list[i].hero_y-50)+'px;z-index:'+im_index.toString()+';background-color:#f0f;">Lv:'+data.hero_list[i].herolevel+'</span>';
//		};

		/*添加及删除英雄列表*/
		for(var i=0;i<data.hero_list.length;i++)
        {
            var back_x = 80*(parseFloat(data.hero_list[i].herolife)/1000);
            var id = data.hero_list[i].id.toString();
            $("#"+id).find('.hero_class').css("left",data.hero_list[i].hero_x);
            $("#"+id).find('.hero_class').css("top",data.hero_list[i].hero_y);
            $("#"+id).find('.herofire_class').attr("src",data.hero_list[i].herofire);
            $("#"+id).find('.herofire_class').css("left",data.hero_list[i].weapon_x);
            $("#"+id).find('.herofire_class').css("top",data.hero_list[i].weapon_y);
            $("#"+id).find('.heroname_class').css("left",data.hero_list[i].hero_x+40);
            $("#"+id).find('.heroname_class').css("top",data.hero_list[i].hero_y-50);
            $("#"+id).find('.heroname_class').text(data.hero_list[i].heroname);
            $("#"+id).find('.herolife_class').css("left",data.hero_list[i].hero_x+40);
            $("#"+id).find('.herolife_class').css("top",data.hero_list[i].hero_y-25);
            $("#"+id).find('.herolife_class').text(data.hero_list[i].herolife);
            $("#"+id).find('.herolifeback_class').css("left",data.hero_list[i].hero_x+back_x+40);
            $("#"+id).find('.herolifeback_class').css("top",data.hero_list[i].hero_y-25);
            $("#"+id).find('.herolifeback_class').css("width",80-back_x);
            $("#"+id).find('.herolevel_class').css("left",data.hero_list[i].hero_x);
            $("#"+id).find('.herolevel_class').css("top",data.hero_list[i].hero_y-50);
            $("#"+id).find('.herolevel_class').text('Lv'+data.hero_list[i].herolevel);
        }

		var new_array = []
		for(var i=0;i<data.hero_list.length;i++)
		{
		    new_array.push(data.hero_list[i].heroname)
		}
		$(".other_list_class").each(function(index)
		{
            var h_name = $(this).find('.heroname_class').text();
            var result = $.inArray(h_name,new_array);
            if(result==-1)
            {
                $(this).remove();
            }
		});

        var old_array = []
        $(".other_list_class").each(function(index)
        {
            var h_name = $(this).find('.hero_class').text();
            old_array.push(h_name)
        })

        for(var i=0;i<data.hero_list.length;i++)
        {
            var h_name = data.hero_list[i].heroname;
            var result = $.inArray(h_name,old_array);
            if(result==-1)
            {
                var back_x = 80*(parseFloat(data.hero_list[i].herolife)/1000);
                var str_hero_list = '<div class="other_list_class" id="'+data.hero_list[i].id+'">'
                str_hero_list = str_hero_list + '<img src="/static/image/timg.png" class="hero_class" style="position:absolute;left:'+data.hero_list[i].hero_x+'px;top:'+data.hero_list[i].hero_y+'px;"><img class="herofire_class" src="'+data.hero_list[i].herofire+'" style="position:absolute;left:'+parseFloat(data.hero_list[i].weapon_x)+'px;top:'+parseFloat(data.hero_list[i].weapon_y)+'px;">'
		        str_hero_list = str_hero_list + '<span class="heroname_class" style="position:absolute;left:'+parseFloat(data.hero_list[i].hero_x+40)+'px;top:'+parseFloat(data.hero_list[i].hero_y-50)+'px;z-index:'+im_index.toString()+';background-color:#f0f;width:100px">'+data.hero_list[i].heroname+'</span>'
		        str_hero_list = str_hero_list + '<span class="herolife_class" style="position:absolute;left:'+parseFloat(data.hero_list[i].hero_x+40)+'px;top:'+parseFloat(data.hero_list[i].hero_y-25)+'px;z-index:'+im_index.toString()+';background-color:red;width:80px;height:20px;color:#fff;">'+data.hero_list[i].herolife+'</span>'
		        str_hero_list = str_hero_list + '<span class="herolifeback_class" style="position:absolute;left:'+parseFloat(data.hero_list[i].hero_x+back_x+40)+'px;top:'+parseFloat(data.hero_list[i].hero_y-25)+'px;z-index:'+(im_index+1).toString()+';background-color:#000;width:'+parseFloat(80-back_x)+'px;height:20px"></span>';
		        str_hero_list = str_hero_list + '<span class="herolevel_class" style="position:absolute;left:'+parseFloat(data.hero_list[i].hero_x)+'px;top:'+parseFloat(data.hero_list[i].hero_y-50)+'px;z-index:'+im_index.toString()+';background-color:#f0f;">Lv'+data.hero_list[i].herolevel+'</span>';
                str_hero_list = str_hero_list + '</div>'
                $(".other_list_class").append(str_hero_list)
            }
        }

        /*去别人家*/
        if(hero_x>300&&hero_x<500&&hero_y<150)
        {
             $.ajax({
            	url: 'otherhome/',
            	type: 'post',
            	data: {
            	label:'1',
            	},
            	success: function (data) {
            	    if(data=="1")
            	    {
            	        window.location.href = "http://127.0.0.1:8000/sleep/";
            	    }
            	},
        	});
        }
        else if(hero_x>300&&hero_x<500&&hero_y>650)
        {
            $.ajax({
            	url: 'otherhome/',
            	type: 'post',
            	data: {
            	label:'2',
            	},
            	success: function (data) {
            	    if(data=="1")
            	    {
            	        window.location.href = "http://127.0.0.1:8000/sleep/";
            	    }
            	},
        	});
        }

        /*显示子弹*/
		var skill_str = "";
		for(var i=0;i<data.skill_list.length;i++){
		skill_str = skill_str + '<img class="gun_class" src="'+data.skill_list[i].skillname+'" style="position:absolute;width:200px;height:130px;left:'+data.skill_list[i].skill_x+'px;top:'+parseFloat(data.skill_list[i].skill_y-50)+'px" alt="'+data.skill_list[i].skill_id+'">'
		};
		var chat_str = "";
		for(var i=0;i<data.chat_list.length;i++)
		{
		chat_str = chat_str + '<li>'+data.chat_list[i].heroname+'说:'+data.chat_list[i].content+'</li>';
		};
        /*在家回血*/
        $.ajax({
            	url: 'addlife/',
            	type: 'post',
            	data: {
            	},
            	success: function (data) {
            	},
        	});
		/*动态添加删除内容进入页面*/
		$("ul li").remove();
		$("ul").prepend(chat_str);
		$("body").prepend(skill_str);
		$("#hero_list").append(str_hero_list);
//		$(".hero_class").remove();
		/*$("#hero_list .my_hero_class").last().remove();*/
            },
        });}
        /*settimeout实现刷新*/
	    mytime = setTimeout(arguments.callee,100)
    };
    /*屏幕刷新*/
	var mytime = setTimeout(showhero,100);
    /*----------------------------以下为事件区----------------------------*/
    /*按键事件，不能同时按键*/
    /*阻止父级点击事件触发————事件冒泡*/
    $("#select_id").click(function(e){
	    e.stopPropagation();
	    });
	$("#chatinput_id").click(function(e){
	    e.stopPropagation();
	});
	$("#exit_id").click(function(e){
	    e.stopPropagation();
	});
	$("#goods_id").click(function(e){
	    e.stopPropagation();
	});
	$("#boss_id").click(function(e){
	    e.stopPropagation();
	});
	$("#adventrue_id").click(function(e){
	    e.stopPropagation();
	});
	$("#gosleep_id").click(function(e){
	    e.stopPropagation();
	});
	$("#menu_id").click(function(e){
	    e.stopPropagation();
	});
	$(".goods_class").click(function(e){
	    e.stopPropagation();
	});
	$('.image_goods_class').click(function(e){
	    e.stopPropagation();
	});

	$("body").unbind('click').click(function(e){
		x = e.pageX;
		y = e.pageY;
		auto_move()
		$.ajax({
            	url: '/move/',
            	type: 'post',
            	data: {
                hero_x:hero_x,
		        hero_y:hero_y,
            	},
            	success: function (data) {
                $(".my_hero_class").css("left",parseFloat(hero_x).toString()+"px");
		        $(".my_hero_class").css("top",parseFloat(hero_y).toString()+"px");
		        $(".my_hero_class").attr('src',data);
            	},
        	});
		/*$	("#herolife_id").attr('style','position:absolute;left:'+parseFloat(hero_x).toString()+'px;top:'+parseFloat(hero_y-50).toString()+'px;background-color:red;width:150;height:50;text-align:center');*/
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
		$.ajax({
            	url: '/goattack/',
            	type: 'post',
            	data: {
            	},
            	success: function (data) {
		        window.location.href = "http://127.0.0.1:8000/index/";
            	},
        	});
	});

	$("body").keydown(function(e){
	    if(gun_num==0){
		switch(e.which){

		case 81:
		var label = "3";
		/*按键同时更换武器*/
		if(x>parseFloat(hero_x)){label='2';}else if(x<parseFloat(hero_x)){label='1';};
		$.ajax({
            	url: '/index/changegun/',
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
        /*按键同时发射技能*/
        $.ajax({
            	url: '/index/attackgun/',
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
	/*聊天按回车事件*/
	$('#chatinput_id').bind('keypress',function(event){
    if(event.keyCode == "13") {
        $.ajax({
            	url: '/index/chat/',
            	type: 'post',
            	data: {
                    label:$("#select_id option:selected").val(),
                    content:$("#chatinput_id").val(),
            	},
            	success: function (data) {
                    $("#chatinput_id").val("");
            	},
        	});
        }
    });

    /*创建建筑*/
    $(".goods_class").each(function(index)
    {
        $(this).click(function(e)
        {
            $(".image_goods_class").eq(index).toggle();
        })
    })

    $('.image_goods_class').each(function()
    {
        var Is_move = false
        var h_x = x;
        var h_y = y;
        $(this).bind('mousedown',function(){
            $(this).clone(true).appendTo('body')
            Is_move = true
        })
        $(this).bind('mousemove',function(e)
            {
                if(Is_move)
                {
                    h_x = e.pageX-50;
                    h_y = e.pageY-50;
                    $(this).css('left',h_x);
                    $(this).css('top',h_y);
                }
            })
       $(this).bind('mouseup',function(){
            $.ajax({
                    url: 'addhomebuild/',
                    type: 'post',
                    data: {
                    x:h_x,
                    y:h_y,
                    width:parseInt($(this).css("width")),
                    height:parseInt($(this).css("height")),
                    homebuild:$(this).attr("src"),
                    },
                    success: function (data) {
                    },
            });
            Is_move = false
            $(this).unbind("mouseup");
            $(this).unbind("mousemove");
            $(this).unbind("mousedown");
        })
    })
};
