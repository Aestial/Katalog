# Generated by Django 3.1.3 on 2020-12-17 03:53

from django.db import migrations
import products.models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0011_annotation_has_label'),
    ]

    operations = [
        migrations.AddField(
            model_name='annotation',
            name='azimuth_limits',
            field=products.models.CommaSeparatedFloatField(default='-360, 360', max_length=20),
        ),
        migrations.AddField(
            model_name='annotation',
            name='distance_limits',
            field=products.models.CommaSeparatedFloatField(default='0, 30', max_length=20),
        ),
    ]