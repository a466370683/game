from django.shortcuts import render
import json
from django.core import serializers
from .models import *
from django.http import HttpResponse,JsonResponse
from django.shortcuts import redirect
import random
from PIL import Image,ImageDraw,ImageFont
import os
import re

# Create your views here.
def index(request):
    ck = request.session.get("username")
    user = Hero.objects.get(username=ck)
    if ck==None:
        return redirect('http://127.0.0.1:8000/login/')
    map = GameMap.objects.get(pk=1)
    build_list = Build.objects.filter(buildmap=map)
    map2 = GameMap.objects.get(pk=2)
    if user.imagemap==map2:
        return redirect("http://127.0.0.1:8000/sleep/")
    hero_list = Hero.objects.filter(imagemap=map)
    skill_list = Skill.objects.all()
    return render(request,'game/index.html',{'hero_list':hero_list,'map':map,'username':ck,'build_list':build_list,'skill_list':skill_list})

def adduser(request):
    pass

def regist(request):
    return render(request,'game/regist.html')

def move(request):
    username = request.session['username']
    hero = Hero.objects.get(username=username)
    hero.hero_x = float(request.POST['hero_x'])
    hero.hero_y = float(request.POST['hero_y'])
    hero.save()
    src = '/static/image/timg.png'
    return HttpResponse(src)

def showhero(request):
    #依据map_id选择英雄，返回前端,不同前端只需改变不同的map_id即可获得相同map的英雄
    try:
        map_id = int(request.POST['map_id'])
        her = Hero.objects.get(username=request.session['username'])
        hero_x = request.POST['hero_x']
        hero_y = request.POST['hero_y']
        her.hero_x = float(hero_x)
        her.hero_y = float(hero_y)
        her.save()
        x = float(request.POST['x'])
        if map_id==2:
            restor_x = request.POST['restor_x']
            restor_y = request.POST['restor_y']
            restor_x = float(restor_x[:-2])
            restor_y = float(restor_y[:-2])
            map = GameMap.objects.get(pk=2)
            list2 = Hero.objects.filter(imagemap=map)
            hero_list = []
            for hero in list2:
                if hero.hero_x > restor_x - 150 and hero.hero_x < restor_x + 300 and hero.hero_y > restor_y - 150 and hero.hero_y < restor_y + 300:
                    hero_list.append(hero)

            for hero in hero_list:
                if hero.herolife < 1000:
                    hero.herolife += 1
                    hero.save()
        map = GameMap.objects.get(pk=map_id)
        hero_list = Hero.objects.filter(imagemap=map)
        my_weapon = Weapon.objects.get(hero=her)
        path = my_weapon.weaponname
        fire_patter = re.compile("z")
        if (request.POST['label'] == '1'):
            if (fire_patter.search(path)):
                my_weapon.weapon_x = her.hero_x + 150
                my_weapon.weapon_y = her.hero_y + 71
                path = path.replace('f', 'z')
            else:
                my_weapon.weapon_x = her.hero_x - 200
                my_weapon.weapon_y = her.hero_y + 71
                path = path.replace('fire', 'firing')
        elif(request.POST['label'] == '0'):
            if(fire_patter.search(path)):
                path = path.replace("z","f")
            else:
                path = path.replace('firing', 'fire')
            if(x>float(hero_x)):
                my_weapon.weapon_x = her.hero_x + 150
            else:
                my_weapon.weapon_x = her.hero_x
            my_weapon.weapon_y = her.hero_y - 131
        my_weapon.weaponname = path
        my_weapon.save()
        list2 = []
        my_hero = {}
        my_hero['id'] = her.id
        my_hero['hero_x'] = her.hero_x
        my_hero['hero_y'] = her.hero_y
        my_hero['heroname'] = her.heroname
        my_hero['herolife'] = her.herolife
        my_hero['herolevel'] = her.herolevel
        my_hero['herofire'] = my_weapon.weaponname
        my_hero['weapon_x'] = my_weapon.weapon_x
        my_hero['weapon_y'] = my_weapon.weapon_y
        skill_list = []
        for skill in Skill.objects.all():
            if (skill.derection==""):
                if(x>float(hero_x)):
                    skill.derection = "right"
                    skill.skillname = skill.skillname[:-4]+'right.png'
                else:
                    skill.derection = "left"
            if(skill.derection=="right"):
                skill.skill_x += 6
            elif(skill.derection=="left"):
                skill.skill_x -= 6
            skill.save()
            item = {}
            item['skill_id'] = skill.id
            item['skillname'] = skill.skillname
            item['skill_x'] = skill.skill_x
            item['skill_y'] = skill.skill_y
            skill_list.append(item)
        for hero in hero_list:
            if hero.id != her.id:
                hero_weapon = Weapon.objects.get(hero=hero)
                list2.append({"id":hero.id,"hero_x":hero.hero_x,"hero_y":hero.hero_y,"heroname":hero.heroname,'herolife':hero.herolife,'herolevel':hero.herolevel,'herofire':hero_weapon.weaponname,'weapon_x':hero_weapon.weapon_x,'weapon_y':hero_weapon.weapon_y})
        return JsonResponse({'hero_list':list2,'my_hero':my_hero,'error':'no error','map_id':map_id,'skill_list':skill_list})
    except Exception as e:
        print(e)
        return JsonResponse({'error':'error'})

def attack_hero(request):
    skill_id = request.POST['skill_id']
    skill = Skill.objects.get(pk=skill_id)
    skill.delete()
    username = request.session['username']
    hero = Hero.objects.get(username=username)
    my_weapon = Weapon.objects.get(hero=hero)
    fire_hero = my_weapon.weaponname[-5]
    fire_hero = 200*int(fire_hero)
    map = GameMap.objects.get(pk=2)
    print(request.POST['heroname'])
    attack_h = Hero.objects.get(heroname=request.POST['heroname'])
    attack_h.herolife -= fire_hero
    if attack_h.herolife<=0:
        attack_h.imagemap = map
    attack_h.save()
    attack_name = {}
    attack_name['hero_x'] = attack_h.hero_x
    attack_name['hero_y'] = attack_h.hero_y
    attack_name['herofire'] = fire_hero
    #hero_list = []
    #list = Hero.objects.all()
    # for h in list:
    #     if h.username!=username:
    #         if h.herolife<=0:
    #             h.imagemap=map
    #             h.save()
    #         else:
    #             hero_list.append(h)
    #
    # attack_name = []
    # for h in hero_list:
    #     if h.hero_x>hero.hero_x-150 and h.hero_x<hero.hero_x+150 and h.hero_y>hero.hero_y-150 and h.hero_y<hero.hero_y+150:
    #             h.herolife -= fire_hero
    #             h.save()
    #             item = {}
    #             item['hero_x'] = h.hero_x
    #             item['hero_y'] = h.hero_y
    #             item['herofire'] = fire_hero
    #             attack_name.append(item)

    return JsonResponse({"attack_name":attack_name})

def login(request):
    verify_image,str_verify = get_image_path()
    request.session["verify"] = str_verify
    return render(request,'game/login.html',{"verify_image":verify_image})

def get_image_path():
    str_verify = ""
    choice_num = "0123456789asdefghijklmnopqrstuvwxyz"
    image = Image.new("RGB", (200, 50), (255, 255, 0))
    draw = ImageDraw.Draw(image)
    font = ImageFont.truetype('/CONSOLA.TTF',30)
    for i in range(4):
        str_num = random.choice(choice_num)
        str_verify += str_num
        font_x = i*40+20
        draw.text((font_x,10),str_num,font=font,fill=(255,0,255))
    dir_path = "static/image/verify/"
    filename = os.listdir(dir_path)
    if filename:
        os.remove(os.path.join(dir_path,filename[0]))
    file_random = str(int(random.random()*1000))
    image_path = dir_path+file_random+"verify.jpg"
    image.save(image_path)
    return image_path,str_verify

def exit(request):
    del request.session['username']
    return redirect('http://127.0.0.1:8000/login/')

def usernameverify(request):
    username = request.POST['username']
    data = 1
    try:
        user = Hero.objects.get(username=username)
    except Exception as e:
        data=0
    return HttpResponse(data)

def passwordverify(request):
    username = request.POST["username"]
    password = request.POST['password']
    data = 1
    try:
        user = Hero.objects.get(username=username)
        if password!=user.password:
            data = 0
    except Exception as e:
        data = 0
    return HttpResponse(data)

def verifyverify(request):
    verify = request.POST["verify"]
    data = 1
    if verify!=request.session["verify"]:
        data = 0
    return HttpResponse(data)

def loginverify(request):
    username = request.POST['username']
    request.session['username'] = username
    hero = Hero.objects.get(username=username)
    map = GameMap.objects.get(pk=1)
    map2 = GameMap.objects.get(pk=2)
    if hero.imagemap==map:
        return redirect("http://127.0.0.1:8000/index/")
    elif hero.imagemap==map2:
        return redirect("http://127.0.0.1:8000/sleep/")

def sleep(request):
    ck = request.session.get("username")
    if ck == None:
        return redirect('http://127.0.0.1:8000/login/')
    map = GameMap.objects.get(pk=2)
    hero_list = Hero.objects.filter(imagemap=map)
    return render(request, 'game/sleep.html', {'hero_list': hero_list, 'map': map.imagemap, 'username': ck})

def gosleep(request):
    user = Hero.objects.get(username=request.POST['username'])
    map = GameMap.objects.get(pk=2)
    user.imagemap = map
    user.save()
    return HttpResponse("去加血")

def goattack(request):
    user = Hero.objects.get(username=request.session['username'])
    map = GameMap.objects.get(pk=1)
    user.imagemap = map
    user.save()
    return HttpResponse("去战场")

def changegun(request):
    hero = Hero.objects.get(username=request.POST['username'])
    weapon = Weapon.objects.get(hero=hero)
    path = weapon.weaponname
    if(request.POST['label']=='1'):
        weapon.weapon_x = hero.hero_x - 200
        weapon.weapon_y = hero.hero_y + 200
        path = path.replace('fire','firing')
    elif(request.POST['label']=='0'):
        fire_patter = re.compile("z")
        if(fire_patter.search(path)):
            path = path.replace('z', 'f')
        else:
            path = path.replace('firing','fire')
        weapon.weapon_x = hero.hero_x
        weapon.weapon_y = hero.hero_y - 131
    elif(request.POST['label'] == '2'):
        weapon.weapon_x = hero.hero_x + 200
        weapon.weapon_y = hero.hero_y + 200
        path = path.replace('f', 'z')
    weapon.weaponname = path
    weapon.save()
    return HttpResponse(request.POST['label'])

def attackgun(request):
    x = request.POST['x']
    hero = Hero.objects.get(username=request.POST['username'])
    skill = Skill()
    skill.skillname = request.POST['skillname']
    skill.hero = hero
    if(float(x)>float(hero.hero_x)):
        skill.derection = "right"
        skill.skillname = "/static/image/attackright.png"
        skill.skill_x = hero.hero_x + 151
        skill.skill_y = hero.hero_y + 75
    else:
        skill.derection = "left"
        skill.skill_x = hero.hero_x - 101
        skill.skill_y = hero.hero_y + 75
    skill.save()
    return HttpResponse("子弹添加成功")

def delete_skill(request):
    skill_id = int(request.POST['skill_id'])
    skill = Skill.objects.get(pk=skill_id)
    skill.delete()
    return HttpResponse("删除子弹成功")

def get_skill_move(x,hero_x,y,hero_y):
    result_x = (hero_x-x)**2/((hero_x-x)**2+(hero_y-y)**2)
    result_y = (hero_y-y)**2/((hero_x-x)**2+(hero_y-y)**2)
    return result_x,result_y