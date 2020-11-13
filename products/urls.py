from django.urls import path
from . import views

urlpatterns = [
    path('', views.all, name='all'),
    path('dev', views.dev, name='dev'),
    path('<slug:product_slug>', views.detail, name='detail'),
]