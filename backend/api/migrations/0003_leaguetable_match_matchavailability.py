# Generated by Django 5.1.7 on 2025-04-06 16:08

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_sport_team_teammembership'),
    ]

    operations = [
        migrations.CreateModel(
            name='LeagueTable',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
                ('gender', models.CharField(max_length=10)),
                ('points', models.IntegerField(default=0)),
                ('wins', models.IntegerField(default=0)),
                ('losses', models.IntegerField(default=0)),
                ('draw', models.IntegerField(default=0)),
                ('sport', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='leagues', to='api.sport')),
            ],
        ),
        migrations.CreateModel(
            name='Match',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(blank=True, null=True)),
                ('homeScore', models.IntegerField(blank=True, null=True)),
                ('awayScore', models.IntegerField(blank=True, null=True)),
                ('status', models.CharField(choices=[('Pending', 'Pending'), ('Approved', 'Approved'), ('Played', 'Played')], default='Pending', max_length=20)),
                ('awayTeam', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='away_matches', to='api.team')),
                ('homeTeam', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='home_matches', to='api.team')),
                ('league', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.leaguetable')),
                ('requested_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
                ('sport', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.sport')),
            ],
        ),
        migrations.CreateModel(
            name='MatchAvailability',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_available', models.BooleanField()),
                ('responded_at', models.DateTimeField(auto_now=True)),
                ('match', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='availabilities', to='api.match')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='match_availabilities', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('match', 'user')},
            },
        ),
    ]
