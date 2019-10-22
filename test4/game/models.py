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
    herofire = models.CharField(max_length=20)
    herobody = models.CharField(max_length=20)
    hero_x = models.FloatField()
    hero_y = models.FloatField()
    imagemap = models.ForeignKey('GameMap',on_delete = models.CASCADE)

class Monster(models.Model):
    monstername = models.CharField(max_length=20)
    monsterlife = models.IntegerField()
    monsterfire = models.CharField(max_length=20)
    monsterbody = models.CharField(max_length=20)
    monster_x = models.FloatField()
    monster_y = models.FloatField()
    imagemap = models.ForeignKey('GameMap',on_delete = models.CASCADE)

class GameMap(models.Model):
    imagemap = models.CharField(max_length=100)

class Build(models.Model):
    buildname = models.CharField(max_length=20)
    build_x = models.IntegerField()
    build_y = models.IntegerField()
    build_height = models.IntegerField()
    build_width = models.IntegerField()
    buildmap = models.ForeignKey('GameMap',on_delete = models.CASCADE)

class Boss(models.Model):
    bossname = models.CharField(max_length=20)
    bosslife = models.IntegerField()
    bossfire = models.IntegerField()
    bossthings = models.CharField(max_length=20)
    boss_x = models.FloatField()
    boss_y = models.FloatField()
    bossmap = models.ForeignKey('GameMap',on_delete = models.CASCADE)
