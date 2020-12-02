from django.contrib import admin

# Register your models here.
from .models import Product, Interactive, Asset, Annotation

class InteractiveInline(admin.StackedInline):
    model = Interactive
    extra = 0

class AssetInline(admin.StackedInline):
    model = Asset
    extra = 0

class AnnotationInline(admin.StackedInline):
    model = Annotation
    extra = 0

@admin.register(Interactive)
class InteractiveAdmin(admin.ModelAdmin):
    inlines = [AssetInline, AnnotationInline]
    ordering = ['title']

admin.site.register(Product)