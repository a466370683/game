window.onload = function(){
    /*生产厂房元素*/
    var monster_home = null;
    /*创建怪物的时间*/
    var start_time = 0;
	/*步长*/
	var stride = 15;
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
	/*升级显示标识*/
	var level_label = 0;
	var level_num = 0;
	/*移动变量*/
	var x = parseFloat($(".my_hero_class").css("left"));
	var y = parseFloat($(".my_hero_class").css("top"));
	/*键盘移动控制*/
	var move_right = false;
	var move_left = false;
	var move_up = false;
	var move_down = false;
	var now_skill_time = 0;
	/*拖拽物品*/
	var Is_move = false;
	/*替换前位置*/
	var replace_x = 0;
	var replace_y = 0;
	var replace_img = null;
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
	var s_x = scroll_x -100
	if(s_x<=0){s_x=0;}
	var menu_x = parseFloat(menu_x + s_x);
	var menu_y = parseFloat(scroll_y);
    obj.css("left",menu_x);
    obj.css("top",menu_y)
	}
	/*设置背包位置*/
	function setpackpost(obj,menu_x,menu_y)
	{
	menu_x = menu_x*window.innerWidth;
	var s_x = scroll_x -100
	if(s_x<=0){s_x=0;}
	var menu_x = parseFloat(menu_x + s_x);
	var menu_y = parseFloat(scroll_y+menu_y);
    obj.css("left",menu_x);
    obj.css("top",menu_y)
	}
	/*打死BOSS显示武器*/
	function show_weapon(thing)
	{
	        var weapon_str = '<img class="boss_things_class" src="'+thing.weaponname+'" style="position:absolute;z-index:5;left:'+thing.weapon_x+'px;top:'+thing.weapon_y+'px;width:30px;height:50px;">';
	        $("body").prepend(weapon_str);
	}
	function showhero()
	{
	    /*跑图功能*/
	    if(move_left)
	    {
	        x = hero_x - 20;
	    }
	    if(move_right)
	    {
	        x = hero_x + 20;
	    }
	    if(move_up)
	    {
	        y = hero_y - 20;
	    }
	    if(move_down)
	    {
	        y = hero_y + 20;
	    }
	    auto_move();
	    auto_scroll();
	    /*聊天设置*/
	    chat_set()
	    /*菜单栏显示位置*/
	    setmenupost($("#exit_id"),0.8);
	    setmenupost($("#goattack_id"),0.15)
	    setmenupost($("#gosleep_id"),0.3);
	    setmenupost($("#boss_id"),0.45)
	    setmenupost($("#menu_id"),0)
	    setmenupost($("#goods_id"),0.6)
	    setpackpost($("#pack_id"),0.2,200)
	    setpackpost($("#select_yes_id"),0.39,500)
	    /*自己被伤害显示自动消失*/
	    if(my_attack_label==1){
	    my_attack_num += 1;
	    if(my_attack_num==10){
	    my_attack_label = 0;
	    my_attack_num = 0;
	    $(".my_attack_class").remove();
	    };
	    };
	    /*升级显示*/
	    if(level_label==1)
	    {
	        level_num = level_num + 1;
	        if(level_num==10)
	        {
	            $("#level_label_id").remove();
	            level_label = 0;
	        }
	    }
	    /*子弹越界处理*/
	    $(".gun_class").each(function(index)
	    {
            var gun = $(this);
            var attack_left = parseFloat($(this).css("left"));
            var attack_top = parseFloat($(this).css("top"));
            if(attack_left<=0||attack_left>=1700)
            {
                gun.remove();
                $.ajax
                ({
                    url: '/index/delete_skill/',
                    type: 'post',
                    data: {
                    skill_id:gun.attr("alt"),
                    },
                    success: function (data)
                    {
                    },
                });
            };

            /*子弹打中怪物处理*/
            $(".monster_class").each(function(index){
                if(attack_left>parseFloat($(this).find('img').css("left"))-parseFloat(gun.css('width'))&&attack_left<parseFloat($(this).find('img').css("left"))+parseFloat($(this).find('img').css("width"))&&attack_top>parseFloat($(this).find('img').css("top"))-parseFloat(gun.css('height'))&&attack_top<parseFloat($(this).find('img').css("top"))+parseFloat($(this).find('img').css("height")))
                    {
                    $.ajax({
                        url: '/sleep/attack_monster/',
                        type: 'post',
                        data: {
                        skill_id:gun.attr("alt"),
                        monster_id:$(this).attr('id'),
                        map_id:'3',
                        },
                        success: function (data)
                        {
                            if(data!='1')
                            {
                                level_label = 1;
                                str_level = '<span id="level_label_id" style="position:absolute;left:'+parseFloat(parseFloat($(".my_hero_class").css("left"))+40)+'px;top:'+parseFloat(parseFloat($(".my_hero_class").css("top"))+40)+'px;z-index:'+im_index.toString()+';width:150px;height:20px;color:red;z-index:5">'+data+'</span>';
                                $('body').prepend(str_level)
                            }
                        },
                    });
                    return false
                };
                gun.remove();
            });
            /*子弹打中BOSS处理*/
            $(".boss_class").each(function(index){
                var boss = $(this)
                if(attack_left>parseFloat($(this).find('img').css("left"))-parseFloat(gun.css('width'))&&attack_left<parseFloat($(this).find('img').css("left"))+parseFloat($(this).find('img').css("width"))&&attack_top>parseFloat($(this).find('img').css("top"))-parseFloat(gun.css('height'))&&attack_top<parseFloat($(this).find('img').css("top"))+parseFloat($(this).find('img').css("height")))
                    {
                    $.ajax({
                        url: 'attack_boss/',
                        type: 'post',
                        data: {
                        skill_id:gun.attr("alt"),
                        boss_id:$(this).attr('id'),
                        map_id:'3',
                        },
                        success: function (data)
                        {
                            if(data.boss_str!='1')
                            {
                                if(data.thing)
                                {
                                    show_weapon(data.thing);
                                }
                                if(data.boss_str!='2')
                                {
                                    level_label = 1;
                                    str_level = '<span id="level_label_id" style="position:absolute;left:'+parseFloat(parseFloat($(".my_hero_class").css("left"))+40)+'px;top:'+parseFloat(parseFloat($(".my_hero_class").css("top"))+40)+'px;z-index:'+im_index.toString()+';width:150px;height:20px;color:red;z-index:5">'+data.level_str+'</span>';
                                    $('body').prepend(str_level)
                                }
                                boss.remove()
                            }
                        },
                    });
                    return false
                };
                gun.remove();
            });
	        /*子弹打中人物处理*/
            $(".hero_class").each(function(index){
                if(attack_left>parseFloat($(this).css("left"))-parseFloat(gun.css('width'))&&attack_left<parseFloat($(this).css("left"))+parseFloat($(this).css("width"))&&attack_top>parseFloat($(this).css("top"))-parseFloat(gun.css('top'))&&attack_top<parseFloat($(this).css("top"))+parseFloat($(this).css("height")))
                {
                    attack_label = 1;
                    $.ajax
                    ({
                        url: '/attack_hero/',
                        type: 'post',
                        data: {
                        heroname:$(".heroname_class").eq(index).text(),
                        skill_id:gun.attr("alt"),
                        },
                        success: function (data)
                            {
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
	    if(gun_num==10){gun_num=0;gun_label=0;
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
	    if(num==10){$(".attack_class").remove();num=0;attack_label=0;}};
	    /*没血自动回家*/
	    if(parseInt($(".my_herolife_class").text())<=0)
	    {
	        $.ajax({
            	url: '/gosleep/',
            	type: 'post',
            	data: {
            	},
            	success: function (data) {
                    window.location.href = "http://127.0.0.1:8000/sleep/";
            	},
        	});
	    }
        /*刷新主要请求数据获取*/
	    if($("title").text()!=""){
	    $.ajax({
            url: '/showhero/',
            type: 'post',
            data: {map_id:'3',
                label:gun_label,
                hero_x:hero_x,
		        hero_y:hero_y,
		        chat_label:$("#select_id option:selected").val(),
		        x:x,
		        y:y,
		        },
            success: function (data) {
            if(data.boss_show_label=='1')
            {
                if(data.boss_list.length>0)
                {
                    for(var i=0;i<data.boss_list.length;i++)
                    {
                        var boss_str = '<div class="boss_class" id="'+data.boss_list[i].id+'">'
                        boss_str += ' <img src="'+data.boss_list[i].bossname+'" style="position:absolute;left:'+data.boss_list[i].boss_x+'px;top:'+data.boss_list[i].boss_y+'px;width:150px;height:150px;z-index:2">';
                        boss_str += '<span class="bosslife_class" style="position:absolute;left:'+parseFloat(data.boss_list[i].boss_x+30)+'px;top:'+data.boss_list[i].boss_y+'px;z-index:2;background-color:red;width:80px;height:20px;color:#fff;">'+data.boss_list[i].bosslife+'</span>';
                        boss_str += '<span class="bossback_class" style="position:absolute;left:'+parseFloat(data.boss_list[i].boss_x+30)+'px;top:'+data.boss_list[i].boss_y+'px;z-index:5;background-color:#000;width:0px;height:20px;color:#fff;"></div>';
                        $("body").prepend(boss_str)
                    }
                }
            }
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
            var my_back_x = 80*(parseFloat(data.my_hero.herolife)/parseInt(1000*data.my_hero.herolevel*0.1+1000));
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
                var back_x = 80*(parseFloat(data.hero_list[i].herolife)/parseInt(1000*data.hero_list[i].herolevel*0.1+1000));
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

            /*显示英雄*/
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
                    var back_x = 80*(parseFloat(data.hero_list[i].herolife)/parseInt(1000*data.hero_list[i].herolevel*0.1+1000));
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

            /*显示子弹*/
            var skill_str = "";
            for(var i=0;i<data.skill_list.length;i++){
            skill_str = skill_str + '<img class="gun_class" src="'+data.skill_list[i].skillname+'" style="position:absolute;width:200px;height:130px;left:'+data.skill_list[i].skill_x+'px;top:'+parseFloat(data.skill_list[i].skill_y-50)+'px;z-index:3;" alt="'+data.skill_list[i].skill_id+'">'
            };
            var chat_str = "";
            for(var i=0;i<data.chat_list.length;i++)
            {
            chat_str = chat_str + '<li>'+data.chat_list[i].heroname+'说:'+data.chat_list[i].content+'</li>';
            };
             /*显示怪物*/
            var old_monster_array = []
            $(".monster_class").each(function(index)
            {
                var m_name = parseInt($(this).attr('id'));
                old_monster_array.push(m_name)
            })
            for(var i=0;i<data.monster_list.length;i++)
            {
                var m_name = data.monster_list[i].id;
                var result = $.inArray(m_name,old_monster_array);
                if(result==-1)
                {
                    var monster_str = '<div class="monster_class" id="'+data.monster_list[i].id+'">'
                    monster_str = monster_str + '<img src="'+data.monster_list[i].monstername+'" style="position:absolute;left:'+data.monster_list[i].monster_x+'px;top:'+data.monster_list[i].monster_y+'px;z-index:2">';
                    monster_str = monster_str + '<span class="monsterlife_class" style="position:absolute;left:'+parseFloat(data.monster_list[i].monster_x+30)+'px;top:'+data.monster_list[i].monster_y+'px;z-index:2;background-color:red;width:80px;height:20px;color:#fff;">'+data.monster_list[i].monsterlife+'</span>';
                    monster_str = monster_str + '<span class="monsterback_class" style="position:absolute;left:'+parseFloat(data.monster_list[i].monster_x+30)+'px;top:'+data.monster_list[i].monster_y+'px;z-index:5;background-color:#000;width:0px;height:20px;color:#fff;"></div>'
                    $('body').prepend(monster_str);
                }
            }
            var new_monster_array = []
            for(var i=0;i<data.monster_list.length;i++)
            {
                new_monster_array.push(data.monster_list[i].id)
            }
            $(".monster_class").each(function(index)
            {
                var m_id = parseInt($(this).attr('id'));
                var result = $.inArray(m_id,new_monster_array);
                if(result==-1)
                {
                    $(this).remove();
                }
            });
            /*移动怪物*/
             for(var i=0;i<data.monster_list.length;i++)
            {
                var id = data.monster_list[i].id.toString()
                var back_x = ((parseFloat(data.monster_list[i].monsterlife))/1000)*80;
                $("#"+id).find("img").css('left',data.monster_list[i].monster_x);
                $("#"+id).find("img").css('top',data.monster_list[i].monster_y);
                $("#"+id).find(".monsterlife_class").css('left',data.monster_list[i].monster_x+40);
                $("#"+id).find(".monsterlife_class").css('top',data.monster_list[i].monster_y);
                $("#"+id).find(".monsterlife_class").text(data.monster_list[i].monsterlife)
                $("#"+id).find(".monsterback_class").css('left',data.monster_list[i].monster_x+40+back_x);
                $("#"+id).find(".monsterback_class").css('width',80-back_x);
                $("#"+id).find(".monsterback_class").css('top',data.monster_list[i].monster_y);
            }

            /*移动BOSS*/
            for(var i=0;i<data.boss_list.length;i++)
            {
                var back_x = ((parseFloat(data.boss_list[i].bosslife))/20000)*80;
                $(".boss_class").eq(i).find("img").attr('src',data.boss_list[i].bossname)
                $(".boss_class").eq(i).find("img").css('left',data.boss_list[i].boss_x);
                $(".boss_class").eq(i).find("img").css('top',data.boss_list[i].boss_y);
                $(".boss_class").eq(i).find(".bosslife_class").css('left',data.boss_list[i].boss_x+40);
                $(".boss_class").eq(i).find(".bosslife_class").css('top',data.boss_list[i].boss_y);
                $(".boss_class").eq(i).find(".bosslife_class").text(data.boss_list[i].bosslife)
                $(".boss_class").eq(i).find(".bossback_class").css('left',data.boss_list[i].boss_x+40+back_x);
                $(".boss_class").eq(i).find(".bossback_class").css('width',80-back_x);
                $(".boss_class").eq(i).find(".bossback_class").css('top',data.boss_list[i].boss_y);
                if(data.boss_list[i].skillname!='')
                {
                    var skill_patter = /right/;
                    if(skill_patter.test(data.boss_list[i].skillname))
                    {
                        var boss_skill_post = parseFloat($(".boss_class").eq(i).find("img").css("left")) + 150
                    }
                    else
                    {
                        var boss_skill_post = parseFloat($(".boss_class").eq(i).find("img").css("left")) - 50
                    }
                    if(now_skill_time==0)
                    {
                        now_skill_time = new Date().getTime();
                    }else
                    {
                        var will_skill_time = new Date().getTime();
                        if((will_skill_time - now_skill_time)>1000)
                        {
                            boss_skill_str = '<img class="boss_skill_class" src="'+data.boss_list[i].skillname+'" style="position:absolute;left:'+boss_skill_post+'px;top:'+parseFloat(parseFloat($(".boss_class").eq(i).find("img").css("top"))-10)+'px;width:200px;height:130px;z-index:5;" alt="'+$(".boss_class").eq(i).attr('id')+'">';
                            $("body").append(boss_skill_str);
                            now_skill_time = 0;
                        }
                    }
                }
            }
            $(".boss_skill_class").each(function()
            {
                var skill_patter = /right/;
                var boss_skill = $(this)
                var boss_skill_left = parseFloat($(this).css('left'));
                var boss_skill_top = parseFloat($(this).css('top'));
                if(skill_patter.test($(this).attr('src')))
                {
                    $(this).css('left',parseFloat($(this).css('left'))+30);
                }else
                {
                    $(this).css('left',parseFloat($(this).css('left'))-30);
                }
                if(parseFloat($(this).css('left'))>1700 || parseFloat($(this).css('left'))<0)
                {
                    $(this).remove()
                }

                var hero_left = parseFloat($(".my_hero_class").css('left'));
                var hero_top = parseFloat($(".my_hero_class").css('top'));
                if(boss_skill_left>hero_left-200&&boss_skill_left<hero_left+150&&boss_skill_top>hero_top-130&&boss_skill_top<hero_top+150)
                {
                    $.ajax
                    ({
                        url: 'bossattack/',
                        type: 'post',
                        data:
                        {
                            boss_id:$(this).attr("alt"),
                        },
                        success: function (data)
                        {
                        },
                    });
                $(this).remove()
                }
                $(".hero_class").each(function()
                {
                    var hero_left = parseFloat($(this).css('left'));
                    var hero_top = parseFloat($(this).css('top'));
                    if(boss_skill_left>hero_left+(-200)&&boss_skill_left<hero_left+150&&boss_skill_top>hero_top+(-130)&&boss_skill_top<hero_top+150)
                    {
                        $.ajax
                        ({
                            url: 'bossattack/',
                            type: 'post',
                            data:
                            {
                                boss_id:boss_skill.attr("alt"),
                                heroname:$(this).siblings(".heroname_class").text(),
                            },
                            success: function (data)
                            {
                            },
                        });
                    boss_skill.remove()
                    }
                })
            })
            /*动态添加删除内容进入页面*/
            $("ul li").remove();
            $("ul").prepend(chat_str);
            $('.gun_class').remove();
            $("body").prepend(skill_str);
            $("#hero_list").append(str_hero_list);
    //		$(".hero_class").remove();
            /*$("#hero_list .my_hero_class").last().remove();*/
                },
            });}
	    mytime = setTimeout(arguments.callee,100)
	}
	var mytime = setTimeout(showhero,100);
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
	$('table').click(function(e){
	    e.stopPropagation();
	});
	$("#yes_id").click(function(e){
	    e.stopPropagation();
	});
	$("#no_id").click(function(e){
	    e.stopPropagation();
	});
	/*点击退出按钮后退出当前用户*/
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
	/*点击区域跳转到其它地图*/
	$("#gosleep_id").click(function(event){
		$.ajax({
            	url: '/gosleep/',
            	type: 'post',
            	data: {
            	},
            	success: function (data) {
                    window.location.href = "http://127.0.0.1:8000/sleep/";
            	},
        	});
	});
	 /*去战场*/
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
	/*点击移动*/
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

	$("body").keydown(function(e){
        switch(e.keyCode)
        {
            case 65:
            move_left = true
            break;
            case 68:
            move_right = true
            break;
            case 83:
            move_down = true
            break;
            case 87:
            move_up = true
            break;
            case 66:
            $("#pack_id").toggle();
            break;
            case 90:
            if($(".boss_things_class").length>0)
            {
                $(".boss_things_class").each(function()
                {
                    var thing = $(this)
                    var t_left = parseFloat($(this).css("left"));
                    var t_top = parseFloat($(this).css("top"));
                    var t_width = parseFloat($(this).css("width"));
                    var t_height = parseFloat($(this).css("height"));
                    if(hero_x>t_left-150&&hero_x<t_left+t_width&&hero_y>t_top-150&&hero_y<t_top+t_height)
                    {
                        $.ajax
                        ({
                            url: 'addthings/',
                            type: 'post',
                            data:
                            {
                                weaponname:$(this).attr("src"),
                            },
                            success: function (data)
                            {
                                if(data)
                                {
                                    $("tr").each(function(i)
                                    {
                                        $(this).find("td").each(function(j)
                                        {
                                            if(i-1==parseInt(data.item.weapon_y)&&j==parseInt(data.item.weapon_x))
                                            {
                                                $(this).css('background-color','#00a9d766')
                                                var pack_str = '<img src="'+data.item.weaponname+'" style="width:30px;height:50px">';
                                                $(this).prepend(pack_str);
                                                return false;
                                            }
                                        })
                                    })
                                    thing.remove()
                                }
                            },
                        });
                    }
                })
            }else
            {
                break;
            }
	    }
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
                x:x,
                y:y,
                map_id:'3',
            	},
            	success: function (data) {

            	},
        	});
		gun_num = 1;
		gun_label = 1;
		};}else{e.preventDefault();};
	});
	$("body").keyup(function(e){
        switch(e.keyCode)
        {
            case 65:
            move_left = false
            break;
            case 68:
            move_right = false
            break;
            case 83:
            move_down = false
            break;
            case 87:
            move_up = false
            break;
	    }
	})
	/*table拖拽物品*/
	$("td").bind('mousedown',function()
	{
	    $(this).css('background-color','#a57171')
	    replace_img = $(this).find("img");
	    replace_x = $(this).index();
	    replace_y = $(this).parent().index();
        Is_move = true
    })
    $("td").bind('mousemove',function(e)
    {
        if(Is_move)
        {
            var h_x = e.pageX;
            var h_y = e.pageY;
            $(this).css('left',h_x);
            $(this).css('top',h_y);
        }
    })
     $("body").bind('mouseup',function(e)
     {
        if(replace_img==null)
        {
            return false;
        }else
        {
            if(e.pageX<parseFloat($("table").css("left"))||e.pageX>parseFloat($("table").css("left"))+parseFloat($("table").css("width"))||e.pageY<parseFloat($("table").css("top"))||e.pageY>parseFloat($("table").css("top"))+parseFloat($("table").css("height")))
            {
                $("#select_yes_id").show()
            }
        }
     })
    $("td").bind('mouseup',function(e)
    {
        var table_x = parseFloat($("table").css("left"));
        var table_y = parseFloat($("table").css("top"));
        var table_width = parseFloat($("table").css("width"));
        var table_height = parseFloat($("table").css("height"));
        var td_x = parseFloat($(this).css("left"));
        var td_y = parseFloat($(this).css("top"));
        var td_width = parseFloat($(this).css("width"));
        var td_height = parseFloat($(this).css("height"));
        if(td_x>table_x&&td_x<table_x+table_width&&td_y>table_y&&td_y<table_y+table_height)
        {
            $("tr").each(function(i)
            {
                $(this).find("td").each(function(j)
                {
                    var this_x = parseFloat($(this).offset().left);
                    var this_y = parseFloat($(this).offset().top);
                    var this_width = parseFloat($(this).css("width"));
                    var this_height = parseFloat($(this).css("height"));
                    if(td_x>this_x&&td_x<this_x+this_width&&td_y>this_y&&td_y<this_y+this_height)
                    {
                        if(i-1==replace_y-1&&j==replace_x)
                        {
                            replace_img.parent().css('background-color','#00a9d766')
                            return false
                        }
                        if($(this).find("img").length>0)
                        {
                             $.ajax
                            ({
                                url: 'replacethings/',
                                type: 'post',
                                data:
                                {
                                    label:'1',
                                    i:i-1,
                                    j:j,
                                    replace_x:replace_x,
                                    replace_y:replace_y,
                                },
                                success: function (data)
                                {
                                    if(data)
                                    {
                                        $("tr").each(function(i)
                                        {
                                            $(this).find("td").each(function(j)
                                            {
                                                if(i-1==parseInt(data.item.weapon_y)&&j==parseInt(data.item.weapon_x)||i-1==parseInt(data.item2.weapon_y)&&j==parseInt(data.item2.weapon_x))
                                                {
                                                    $(this).find("img").remove();
                                                }
                                            })
                                        })
                                        $("tr").each(function(i)
                                        {
                                            $(this).find("td").each(function(j)
                                            {
                                                if(i-1==parseInt(data.item.weapon_y)&&j==parseInt(data.item.weapon_x))
                                                {
                                                    $(this).css('background-color','#00a9d766')
                                                    var pack_str = '<img src="'+data.item.weaponname+'" style="width:30px;height:50px">';
                                                    $(this).prepend(pack_str);
                                                    return false;
                                                }
                                            })
                                        })
                                        $("tr").each(function(i)
                                        {
                                            $(this).find("td").each(function(j)
                                            {
                                                if(i-1==parseInt(data.item2.weapon_y)&&j==parseInt(data.item2.weapon_x))
                                                {
                                                    $(this).css('background-color','#00a9d766')
                                                    var pack_str = '<img src="'+data.item2.weaponname+'" style="width:30px;height:50px">';
                                                    $(this).prepend(pack_str);
                                                    return false;
                                                }
                                            })
                                        })
                                    }
                                },
                            });
                        }else
                        {
                            $.ajax
                            ({
                                url: 'replacethings/',
                                type: 'post',
                                data:
                                {
                                    label:'0',
                                    i:i-1,
                                    j:j,
                                    replace_x:replace_x,
                                    replace_y:replace_y,
                                },
                                success: function (data)
                                {
                                    if(data)
                                    {
                                        $("tr").each(function(i)
                                        {
                                            $(this).find("td").each(function(j)
                                            {
                                                if(i-1==parseInt(data.item.weapon_y)&&j==parseInt(data.item.weapon_x))
                                                {
                                                    $(this).css('background-color','#00a9d766')
                                                    var pack_str = '<img src="'+data.item.weaponname+'" style="width:30px;height:50px">';
                                                    $(this).prepend(pack_str);
                                                    return false;
                                                }
                                            })
                                        })
                                    }
                                },
                            });
                            replace_img.remove()
                        }
                    }
                })
            })
        }
        Is_move = false;
    })
    $("#yes_id").click(function()
    {
        yes_click = $(this)
        $.ajax
        ({
            url: 'deleteimg/',
            type: 'post',
            data:
            {
                i:replace_y,
                j:replace_x,
            },
            success: function (data)
            {
                replace_img.remove();
                yes_click.parent().hide();
                replace_img=null;
            },
        });
    })
    $("#no_id").click(function()
    {
        $("#select_yes_id").hide();
    })
}