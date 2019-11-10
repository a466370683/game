window.onload = function()
{
    var username_verify = false;
    var password_verify = false;
    var heroname_verify = false;

    $("#username_id").blur(function()
    {
        var username = $(this)
        if($(this).val()=='')
        {
            $(this).next("span").text("帐号不能为空")
        }else
        {
            var username_patter = /[a-zA-Z0-9]{9,}/;
            if(username_patter.test($(this).val()))
            {
                $.ajax
                ({
            	url: '/usernameverify/',
            	type: 'post',
            	data: {
                username:$(this).val(),
            	},
            	success: function (data)
            	{
                    if(data=="1")
                    {
                        username.next('span').text("账号已存在");
                    }else
                    {
                        username_verify=true
                        username.next('span').text("");};
                    },
        	    });
            }else
            {
                $(this).next('span').text("请输入9位以上数字或字母")
            }
        }
    })

    $("#password_id").blur(function()
    {
        if($(this).val()=='')
        {
            $(this).next("span").text("密码不能为空")
        }else
        {
            var username_patter = /[a-zA-Z0-9]{9,}/;
            if(username_patter.test($(this).val()))
            {
                $(this).next('span').text("");
                password_verify = true
            }else
            {
                $(this).next('span').text("请输入9位以上数字或字母")
            }
        }
    })

    $("#heroname_id").blur(function()
    {
        var heroname = $(this)
        if($(this).val()=='')
        {
            $(this).next("span").text("名称不能为空")
        }else
        {
            var heroname_patter = /[\u4e00-\u9fa5a-z0-9A-Z]{3,}/;
            if(heroname_patter.test($(this).val()))
            {
                $.ajax
                ({
            	url: 'heronameverify/',
            	type: 'post',
            	data: {
                heroname:$(this).val(),
            	},
            	success: function (data)
            	{
                    if(data=="1")
                    {
                        heroname.next('span').text("名称已存在");
                    }else
                    {
                        heroname_verify=true
                        heroname.next('span').text("");};
                    },
        	    });
            }else
            {
                $(this).next('span').text("2位以上汉字或字母")
            }
        }
    })

    $("#submit_id").click(function()
    {
        $("#username_id").trigger('blur')
        $("#password_id").trigger('blur')
        $("#heroname_id").trigger('blur')
         if(username_verify&&password_verify&&heroname_verify)
        {
            return true
        }else
        {
            return false
        }
    })
}