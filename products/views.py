import json
from django.core.serializers.json import DjangoJSONEncoder
from django.shortcuts import render, get_object_or_404
from .models import Product, Interactive, Asset, Annotation

# Create your views here.
def all(request):
    products = Product.objects.all
    return render(request, 'products/all.html', {'section':'products', 'products':products})

def detail(request, product_slug):
    product = get_object_or_404(Product, slug = product_slug)
    interactive = Interactive.objects.filter(product__id = product.id).first()
    assets = {asset.name:asset.file.url for asset in interactive.assets.all()}
    annotations = interactive.annotations.all()
    return render(request, 'products/detail.html', {
        'section':'products',
        'product':product,
        'interactive':interactive,
        'assets':assets,
        'annotations':annotations
    })

def dev(request):
    product = Product.objects.filter(name = "LOGO! 8").first()
    interactive = Interactive.objects.filter(product__id = product.id).first()
    assets = {asset.name:asset.file.url for asset in interactive.assets.all()}
    annotations = interactive.annotations.all()
    annots_dict = {a.index:{
        "camPosition": a.camPosition, 
        "title": a.title
    } for a in annotations}
    # annots_json = json.dumps(list(annotations), cls=DjangoJSONEncoder)
    return render(request, 'products/detail.html', {
        'section':'products',
        'product':product,
        'interactive':interactive,
        'assets':assets,
        'annotations':annotations,
        'annots_dict':annots_dict,
        'dev':True
    })