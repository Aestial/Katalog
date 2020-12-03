import json
from django.core.serializers.json import DjangoJSONEncoder
from django.shortcuts import render, get_object_or_404
from .models import Product, Interactive, Asset, Annotation

# Create your views here.
def all(request):
    products = Product.objects.all
    return render(request, 'products/all.html', {'section':'products', 'products':products})

def detail(request, product_slug, is_dev=False):
    product = get_object_or_404(Product, slug = product_slug)
    interactive = Interactive.objects.filter(product__id = product.id).first()
    assets = {asset.name:asset.file.url for asset in interactive.assets.all()}
    annotations = interactive.annotations.all()
    annots_dict = {a.index:{        
        "title": a.title,
        "position": a.position,
        "cam_position": a.cam_position
    } for a in annotations}
    return render(request, 'products/detail.html', {
        'section':'products',
        'product':product,
        'interactive':interactive,
        'assets':assets,
        'annotations':annotations,
        'annots_dict':annots_dict,
        'dev':is_dev
    })

def dev(request):
    return detail(request, "siemens-logo-8", True)