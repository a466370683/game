"""test4 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from game import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('index/',views.index),
    path('regist/adduser/',views.adduser),
    path('regist/',views.regist),
    path('move/',views.move),
    path('showhero/',views.showhero),
    path('attack_hero/',views.attack_hero),
    path('login/',views.login),
    path('exit/',views.exit),
    path('usernameverify/',views.usernameverify),
    path('passwordverify/',views.passwordverify),
    path('verifyverify/',views.verifyverify),
    path('loginverify/',views.loginverify),
    path('sleep/',views.sleep),
    path('gosleep/',views.gosleep),
    path('goattack/',views.goattack),
    path('index/changegun/',views.changegun),
    path('index/attackgun/',views.attackgun),
    path('index/delete_skill/',views.delete_skill),
    path('index/chat/',views.chat),
    path('sleep/addlife/',views.addlife),
    path('sleep/otherhome/',views.otherhome),
    path('sleep/addhomebuild/',views.addhomebuild),
    path('index/addmonster/',views.addmonster),
    path('sleep/attack_monster/',views.attack_monster),
    path('adventrue/',views.adventrue),
    path('adventrue/goadventrue/',views.goadventrue),
    path('adventrue/bossattack/',views.bossattack),
    path('adventrue/attack_boss/',views.attack_boss),
    path('adventrue/addthings/',views.addthings),
    path('adventrue/replacethings/',views.replacethings),
    path('adventrue/deleteimg/',views.deleteimg),
    path('adventrue/buythings/',views.buythings),
    path('adventrue/changefire/',views.changefire),
    path('regist/heronameverify/',views.heronameverify)
]
