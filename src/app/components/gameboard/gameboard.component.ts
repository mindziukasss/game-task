import { Component, OnInit, OnDestroy } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { ConfigurationService } from '../../services/configuration.service';
import { EventsService, NextGameResponse } from '../../services/events.service';
import { LogsService } from '../../services/logs.service';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-gameboard',
  templateUrl: './gameboard.component.html',
  styleUrls: ['./gameboard.component.scss']
})

export class GameboardComponent implements OnInit, OnDestroy{

  // @ts-ignore
  gameBoard: Observable<GameData>;
  // @ts-ignore
  loading: Observable<boolean>;
  // @ts-ignore
  outcome: number;
  // @ts-ignore
  private gameEvents: Subscription;

  constructor(
    private configurationService: ConfigurationService,
    private logsService: LogsService,
    private eventsService: EventsService
  ) {}

  ngOnInit(): void
  {
    this.logsService.updateLogs('Loading game board');
    this.configurationService.getConfiguration();
    this.gameBoard = this.configurationService.config.pipe();
    this.loading = this.eventsService.loading.pipe();

    this.gameEvents = this.eventsService.events
      .pipe(
        tap((game: NextGameResponse[]) => {
        // @ts-ignore
          this.outcome = this.eventsService.lastNumber(game);
          setTimeout(() => {
            // @ts-ignore
            this.outcome = null;
          }, 5000);
        }),
        catchError(_err => EMPTY)
      )
      .subscribe();
  }

  ngOnDestroy(): void
  {
    this.gameEvents.unsubscribe();
  }
}
