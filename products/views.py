from django.shortcuts import render, get_object_or_404
from .models import Product, Interactive, Asset, Annotation
import json

# Create your views here.
def all(request):
    products = Product.objects.all
    return render(request, 'products/all.html', {'section':'products', 'products':products})

def detail(request, product_slug, is_dev=False):
    product = get_object_or_404(Product, slug = product_slug)
    interactive = Interactive.objects.filter(product__id = product.id).first()
    data_json = json.dumps(interactive.data)
    assets = {asset.name:asset.file.url for asset in interactive.assets.all()}
    annotations = interactive.annotations.all()
    annots_dict = dictionary(annotations)
    return render(request, 'products/detail.html', {
        'section':'products',
        'product':product,
        'interactive':interactive,
        'data_json':data_json,
        'assets':assets,
        'annotations':annotations,
        'annots_dict':annots_dict,
        'dev':is_dev
    })

def dev(request):
    return detail(request, "dev-prod", True)

def dictionary(annotations):
    d = {a.index:{        
        "title": a.title,
        "summary": a.summary,
        "description": a.description,
        "position": a.position,
        "cam_position": a.cam_position,
        "azimuth_limits": a.azimuth_limits,
        "polar_limits": a.polar_limits,
        "distance_limits": a.distance_limits,
    } for a in annotations}
    return d