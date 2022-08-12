import { Component, OnInit } from '@angular/core';
import { EventsService, NextGameResponse } from '../../services/events.service';
import { take, tap, debounceTime } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LogsService } from '../../services/logs.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  // @ts-ignore
  isTimerShow: boolean;
  // @ts-ignore
  countdown: number;
  // @ts-ignore
  events: Observable<NextGameResponse[]>;

  constructor(
    private eventsService: EventsService,
    private logsService: LogsService,
  ) { }

  ngOnInit(): void
  {
    this.events = this.eventsService.events.pipe();
    this.getNewGame();
  }

  getNewGame(): void
  {
    this.eventsService.getEvents()
      .pipe(
        take(1),
        tap((nextGame: NextGameResponse) => {
          this.eventsService.addNewGameEvent(nextGame);
          this.countdown = nextGame.fakeStartDelta;
          this.logsService.updateLogs(`sleeping for fakeStartDelta ${nextGame.fakeStartDelta} sec`);
          this.setTimer(this.countdown, nextGame.id);
        }),
      )
      .subscribe();
  }

  setTimer(time: number, id: number): void
  {
    if (time) {
      this.isTimerShow = true;
      setTimeout(() => {
        this.countdown--;
        this.setTimer(this.countdown, id);
      }, 1000);
    } else {
      this.isTimerShow = false;
      this.getGameResultById(id);
      this.eventsService.gameStatus();
    }
  }

  getGameResultById(id: number): void
  {
    this.logsService.updateLogs('Spinning the wheel');
    this.eventsService.getGameById(id)
      .pipe(
        debounceTime(300),
        take(1),
        tap((game: NextGameResponse) => {
          if (game.outcome) {
            this.logsService.updateLogs(`Result is ${game.outcome}`);
            this.eventsService.updateEvent(game);
            this.eventsService.changeGameStatus();
            this.eventsService.updateStatistics();
            this.getNewGame();
          } else {
            this.logsService.updateLogs('Still no result continue spinning');
            setTimeout(() => {
              this.getGameResultById(id);
            }, 300);
          }
        }),
      )
      .subscribe();
  }
}
