from django.shortcuts import render
import json
from django.core import serializers
from .models import *
from django.http import HttpResponse,JsonResponse

# Create your views here.
def index(request):
    map = GameMap.objects.get(pk=1)
    hero_list = Hero.objects.filter(imagemap=map)
    user = Hero.objects.get(pk=1)
    request.session['username'] = user.username
    return render(request,'game/index.html',{'hero_list':hero_list,'map':map})

def adduser(request):
    pass

def regist(request):
    return render(request,'game/regist,html')

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
            if hero.herolife>=0:
                list2.append({"id":hero.id,"hero_x":hero.hero_x,"hero_y":hero.hero_y,"heroname":hero.heroname})
    return JsonResponse({'hero_list':list2,'my_hero':my_hero})

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
            if hero.hero_x<h.hero_x+150 and hero.hero_y>h.hero_y-150 and hero.hero_y<h.hero_y:
                h.herolife -= 200
                h.save()
                # hero_attacked = Hero.objects.get(username=h.username)
                # hero_attacked.herolife = h.herolife
                # hero_attacked.save()
                print(h.herolife)
        elif hero.hero_x<h.hero_x:
            if hero.hero_x>h.hero_x+150 and hero.hero_y<h.hero_y-150 and hero.hero_y>h:
                h.herolife -= 200
                h.save()
                # hero_attacked = Hero.objects.get(username=h.username)
                # hero_attacked.herolife = h.herolife
                # hero_attacked.save()
                print(h.herolife)
    return HttpResponse('attack')
