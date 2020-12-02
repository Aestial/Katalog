from django.core.validators import int_list_validator
from django.db import models

# Create your models here.
class Product(models.Model):
    name = models.CharField(max_length=200)
    body = models.TextField(blank=True)
    slug = models.SlugField(max_length=100)
    summary = models.CharField(max_length=240, blank=True, default='')

    def __str__(self):
        return self.name

class Interactive(models.Model):
    product = models.ForeignKey(Product, related_name='interactives', on_delete=models.CASCADE, null=True)
    title = models.CharField(max_length=220)    
    bundle = models.FileField(upload_to='bundles/', blank=True, null=True)
    data = models.JSONField(blank=True, null=True)

    def __str__(self):
        return self.product.name + ' - ' + self.title

class Annotation(models.Model):
    interactive = models.ForeignKey(Interactive, related_name='annotations', on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    index = models.PositiveSmallIntegerField()
    summary = models.CharField(max_length=280, blank=True)
    description = models.TextField(blank=True)
    camPosition = models.CharField(validators=[int_list_validator(allow_negative=True)], max_length=50, default='0,0,0')

    class Meta(object):
        ordering = ['index']

    def __str__(self):
        return self.interactive.title + ' - ' + self.title

class Asset(models.Model):
    interactive = models.ForeignKey(Interactive, related_name='assets', on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=220)
    file = models.FileField(upload_to='assets/', blank=True, null=True)
    meta = models.JSONField(blank=True, null=True)
    
    class Meta(object):
        ordering = ['name']

    def __str__(self):
        return self.interactive.title + ' - ' + self.name
