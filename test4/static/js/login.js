window.onload = function(){
	
	var username_key = false;
	var password_key = false;
	var verify_key = false;

	$("#username_id").blur(function(){
		if($(this).val()==""){$("#username_span").text("账号不能为空")}else{
		$.ajax({
            	url: '/usernameverify/',
            	type: 'post',
            	data: {
                username:$(this).val(),
            	},
            	success: function (data) {
                if(data=="1"){username_key=true;$("#username_span").text("");}else{
    $("#username_span").text("账号不存在");};
            	},
        	});		
		};
	});	
	
	$("#password_id").blur(function(){
		if($(this).val()==""){$("#password_span").text("密码不能为空")}else{
		$.ajax({
            	url: '/passwordverify/',
            	type: 'post',
            	data: {
		username:$("#username_id").val(),
                password:$(this).val(),
            	},
            	success: function (data) {
                if(data=="1"){password_key=true;$("#password_span").text("");}else{$("#password_span").text("账号或密码错误");};
            	},
        	});		
		};
	});		
	
	$("#verify_id").blur(function(){
		if($(this).val()==""){$("#verify_span").text("验证码不能为空")}else{
		$.ajax({
            	url: '/verifyverify/',
            	type: 'post',
            	data: {
                verify:$(this).val(),
            	},
            	success: function (data) {
                if(data=="1"){verify_key=true;$("#verify_span").text("");}else{$("#verify_span").text("验证码错误");};
            	},
        	});		
		};
	});
	
	$("#subumit_id").click(function(){
		$("#username_id").trigger("blur");
		$("#password_id").trigger("blur");
		$("verify_id").trigger("blur");
		if(username_key&&password_key&&verify_key){return true;}
		else{return false;}
	});

	$("#register_id").click(function()
	{
	    window.location.href = 'http://127.0.0.1:8000/regist/'
	})

}
