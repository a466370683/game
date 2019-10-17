from django.shortcuts import render
import json
from django.core import serializers
from .models import *
from django.http import HttpResponse,JsonResponse
from django.shortcuts import redirect
import random
from PIL import Image,ImageDraw,ImageFont
import os

# Create your views here.
def index(request):
    ck = request.session.get("username")
    print(ck)
    if ck==None:
        return redirect('http://127.0.0.1:8000/login/')
    map = GameMap.objects.get(pk=1)
    hero_list = Hero.objects.filter(imagemap=map)
    user = Hero.objects.get(username=ck)
    return render(request,'game/index.html',{'hero_list':hero_list,'map':map,'username':ck})

def adduser(request):
    pass

def regist(request):
    return render(request,'game/regist.html')

def move(request):
    hero_x = float(request.POST['hero_x'])
    hero_y = float(request.POST['hero_y'])
    heroname = request.POST['heroname']
    print(heroname)
    hero = Hero.objects.get(heroname=heroname)
    hero.hero_x = round(hero_x,0)
    hero.hero_y = round(hero_y,0)
    hero.save()
    src = '/static/image/timg.gif'
    return HttpResponse(src)

def showhero(request):
    try:
        hero_list = Hero.objects.all()
        her = Hero.objects.get(username=request.session['username'])
        list2 = []
        my_hero = {}
        my_hero['id'] = her.id
        my_hero['hero_x'] = her.hero_x
        my_hero['hero_y'] = her.hero_y
        my_hero['heroname'] = her.heroname
        my_hero['herolife'] = her.herolife
        for hero in hero_list:
            if hero.id != her.id:
                print(hero.herolife)
                if hero.herolife>0:
                    list2.append({"id":hero.id,"hero_x":hero.hero_x,"hero_y":hero.hero_y,"heroname":hero.heroname})
        return JsonResponse({'hero_list':list2,'my_hero':my_hero,'error':'no error'})
    except Exception as e:
        return JsonResponse({'error':'error'})

def attack_hero(request):
    username = request.session['username']
    hero = Hero.objects.get(username=username)
    list = Hero.objects.all()
    hero_list = []
    map = GameMap.objects.get(pk=2)
    for h in list:
        if h.username!=username:
            if h.herolife<=0:
                h.imagemap=map
                h.save()
            else:
                hero_list.append(h)

    for h in hero_list:
        if hero.hero_x>h.hero_x:
            if hero.hero_x-150<h.hero_x and hero.hero_y-150<h.hero_y and hero.hero_y+150>h.hero_y:
                h.herolife -= 200
                h.save()
                # hero_attacked = Hero.objects.get(username=h.username)
                # hero_attacked.herolife = h.herolife
                # hero_attacked.save()
                print(h.herolife)
        elif hero.hero_x<h.hero_x:
            if hero.hero_x+150>h.hero_x and hero.hero_y-150<h.hero_y and hero.hero_y+150>h.hero_y:
                h.herolife -= 200
                h.save()
                # hero_attacked = Hero.objects.get(username=h.username)
                # hero_attacked.herolife = h.herolife
                # hero_attacked.save()
                print(h.herolife)
    return HttpResponse('attack')

def login(request):
    verify_image,str_verify = get_image_path()
    request.session["verify"] = str_verify
    print(verify_image)
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
    return redirect('http://127.0.0.1:8000/index/')

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
    request.session['username'] = request.POST['username']
    return redirect("http://127.0.0.1:8000/index/")