# Generated by Django 4.1.8 on 2023-10-24 12:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('CafeApp', '0002_alter_orders_total_amount'),
    ]

    operations = [
        migrations.AddField(
            model_name='orders',
            name='status',
            field=models.CharField(choices=[('PaymentLeft', 'PaymentLeft'), ('Received', 'Received'), ('InProgress', 'InProgress'), ('Delivered', 'Delivered')], max_length=100, null=True),
        ),
    ]
