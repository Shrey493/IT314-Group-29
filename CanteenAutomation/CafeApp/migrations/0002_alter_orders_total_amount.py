# Generated by Django 4.1.8 on 2023-10-23 09:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('CafeApp', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='orders',
            name='total_amount',
            field=models.IntegerField(default=0),
        ),
    ]
