# Generated by Django 5.1.7 on 2025-04-07 10:38

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_team_league'),
    ]

    operations = [
        migrations.AddField(
            model_name='match',
            name='league',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.leaguetable'),
        ),
        migrations.AddField(
            model_name='match',
            name='sport',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='api.sport'),
            preserve_default=False,
        ),
    ]
