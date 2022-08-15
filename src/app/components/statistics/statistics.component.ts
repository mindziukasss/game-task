import { Component, OnInit } from '@angular/core';
import { Statistics, StatisticsService } from '../../services/statistics.service';
import { filter, Observable, tap } from 'rxjs';
import { ConfigurationService, GameData, Parts } from '../../services/configuration.service';
import {consts} from "../../constants";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  statistics!: Observable<Statistics[]>;
  config!: GameData;

  limit = consts.LIMIT

  constructor(
    private configurationService: ConfigurationService,
    private statisticsService: StatisticsService,
  ) { }

  ngOnInit(): void
  {
    this.statisticsService.updateStats()
    this.statistics = this.statisticsService.gameStatistics.pipe()

    this.configurationService.config.pipe(
      filter((config: GameData) => config !== null),
      tap((config: GameData) => this.config = config)
    ).subscribe()
  }

  // @ts-ignore
  getColor(value: number)
  {
    if (this.config) {
       // @ts-ignore
      let color = this.config.slots.find((parts: Parts) => parts.positionToId === value).color;

      return color;
    }
  }
}
