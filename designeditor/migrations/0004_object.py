# Generated by Django 3.2.7 on 2022-01-02 21:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('designeditor', '0003_illustration'),
    ]

    operations = [
        migrations.CreateModel(
            name='Object',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('html', models.TextField()),
                ('name', models.CharField(max_length=100)),
                ('data', models.JSONField(null=True)),
            ],
        ),
    ]
