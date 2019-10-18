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
    hero_x = models.IntegerField()
    hero_y = models.IntegerField()
    imagemap = models.ForeignKey('GameMap',on_delete = models.CASCADE)

class Monster(models.Model):
    heroname = models.CharField(max_length=20)
    herolife = models.IntegerField()
    herolevel = models.IntegerField()
    herofire = models.CharField(max_length=20)
    herobody = models.CharField(max_length=20)
    hero_x = models.IntegerField()
    hero_y = models.IntegerField()
    imagemap = models.ForeignKey('GameMap',on_delete = models.CASCADE)

class GameMap(models.Model):
    imagemap = models.CharField(max_length=100)
