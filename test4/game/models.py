from django.db import models

# Create your models here.
class Hero(models.Model):
    username = models.CharField(max_length=20)
    heroname = models.CharField(max_length=20)
    herolife = models.IntegerField()
    experience = models.IntegerField()
    herolevel = models.IntegerField()
    herogender = models.BooleanField()
    password = models.CharField(max_length=20)
    herobody = models.CharField(max_length=20)
    hero_x = models.FloatField()
    hero_y = models.FloatField()
    loginlabel = models.BooleanField()
    imagemap = models.ForeignKey('GameMap',on_delete = models.CASCADE)
    hero_id = models.IntegerField()

class Monster(models.Model):
    monstername = models.CharField(max_length=50)
    monsterlife = models.IntegerField()
    monsterfire = models.IntegerField()
    monsterthings = models.CharField(max_length=50)
    monster_x = models.FloatField()
    monster_y = models.FloatField()
    hero_id = models.IntegerField()
    imagemap = models.ForeignKey('GameMap',on_delete = models.CASCADE)

class GameMap(models.Model):
    imagemap = models.CharField(max_length=50)

class Build(models.Model):
    buildname = models.CharField(max_length=50)
    build_x = models.IntegerField()
    build_y = models.IntegerField()
    build_height = models.IntegerField()
    build_width = models.IntegerField()
    buildmap = models.ForeignKey('GameMap',on_delete = models.CASCADE)

class Boss(models.Model):
    bossname = models.CharField(max_length=50)
    bosslife = models.IntegerField()
    bossfire = models.IntegerField()
    bossthings = models.CharField(max_length=50)
    boss_x = models.FloatField()
    boss_y = models.FloatField()
    hero = models.ForeignKey('Hero',on_delete = models.CASCADE)
    bossmap = models.ForeignKey('GameMap',on_delete = models.CASCADE)

class Weapon(models.Model):
    weaponname = models.CharField(max_length=50)
    weapon_x = models.IntegerField()
    weapon_y = models.IntegerField()
    hero = models.ForeignKey("Hero",on_delete = models.CASCADE)

class Skill(models.Model):
    skillname = models.CharField(max_length=50)
    skill_x = models.IntegerField()
    skill_y = models.IntegerField()
    derection = models.CharField(max_length=20)
    map = models.ForeignKey("GameMap",on_delete = models.CASCADE)
    hero_id = models.IntegerField()
    myhero = models.ForeignKey("Hero",on_delete = models.CASCADE)

class Chat(models.Model):
    datetime = models.IntegerField()
    content = models.CharField(max_length=30)
    label = models.IntegerField()
    hero = models.ForeignKey("Hero",on_delete = models.CASCADE)

class Home(models.Model):
    homebuild = models.CharField(max_length=50)
    homebuild_x = models.IntegerField()
    homebuild_y = models.IntegerField()
    homewidth = models.IntegerField()
    homeheight = models.IntegerField()
    hero = models.ForeignKey("Hero",on_delete = models.CASCADE)