# Generated by Django 3.2.7 on 2022-01-02 22:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('designeditor', '0005_rename_object_graphic'),
    ]

    operations = [
        migrations.AddField(
            model_name='illustration',
            name='name',
            field=models.CharField(default='test', max_length=100),
            preserve_default=False,
        ),
    ]