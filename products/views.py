from django.shortcuts import render, get_object_or_404
from .models import Product, Interactive, Asset

# Create your views here.
def home(request):
    products = Product.objects.all
    return render(request, 'products/home.html', {'products':products})

def detail(request, product_slug):
    product = get_object_or_404(Product, slug = product_slug)
    interactive = Interactive.objects.filter(product__id = product.id).first()
    assets = {asset.name:asset.file.url for asset in interactive.assets.all()}
    return render(request, 'products/detail.html', {'product': product, 'interactive':interactive, 'assets':assets})

def dev(request):
    return render(request, 'products/dev.html')