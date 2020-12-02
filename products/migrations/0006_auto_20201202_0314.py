# Generated by Django 3.1.3 on 2020-12-02 03:14

import django.core.validators
from django.db import migrations, models
import re


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0005_auto_20201202_0310'),
    ]

    operations = [
        migrations.AlterField(
            model_name='annotation',
            name='camPosition',
            field=models.CharField(default='0,0,0', max_length=50, validators=[django.core.validators.RegexValidator(re.compile('^(-)?\\d+(?:,(-)?\\d+)*\\Z'), code='invalid', message=None)]),
        ),
    ]