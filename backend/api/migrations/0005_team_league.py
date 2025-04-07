# Generated by Django 5.1.7 on 2025-04-06 18:22

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_rename_draw_leaguetable_draws_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='team',
            name='league',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='teams', to='api.leaguetable'),
        ),
    ]
