import { Component, OnInit } from '@angular/core';
import { Statistics, StatisticsService } from '../../../services/statistics.service';
import {filter, Observable, tap } from 'rxjs';
import { ConfigurationService, GameData, Parts } from '../../../services/configuration.service';
import { EventsService } from '../../../services/events.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  // @ts-ignore
  statistics: Observable<Statistics[]>;
  // @ts-ignore
  config: GameData;

  constructor(
    private configurationService: ConfigurationService,
    private statisticsService: StatisticsService,
    private eventsService: EventsService,
  ) { }

  ngOnInit(): void
  {
    this.statisticsService.updateStats()
    this.statistics = this.statisticsService.gameStatistics.pipe()
    this.eventsService.updateStatistics()
    this.configurationService.config.pipe(
      filter((config: GameData) => config !== null),
      tap((config: GameData) => this.config = config)
    ).subscribe()
  }

  // @ts-ignore
  getColor(value: number): string
  {
    if (this.config) {
      // @ts-ignore
      return this.config.slots.find((parts: Parts) => parts.positionToId === value).color;
    }
  }
}
