# Generated by Django 3.2.7 on 2021-12-10 21:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('designeditor', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelManagers(
            name='user',
            managers=[
            ],
        ),
        migrations.RemoveField(
            model_name='user',
            name='username',
        ),
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(max_length=254, unique=True, verbose_name='email address'),
        ),
    ]
