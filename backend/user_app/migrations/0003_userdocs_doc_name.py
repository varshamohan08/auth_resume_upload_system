# Generated by Django 5.0.4 on 2024-05-01 15:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_app', '0002_rename_userprofile_userdocs'),
    ]

    operations = [
        migrations.AddField(
            model_name='userdocs',
            name='doc_name',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
