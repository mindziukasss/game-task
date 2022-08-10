import { Component, OnInit } from '@angular/core';
import { EventsService, NextGameResponse } from '../../services/events.service';
import { take, tap, debounceTime } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
    private eventsService: EventsService
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
    }
  }

  getGameResultById(id: number): void
  {
    this.eventsService.getGameById(id)
      .pipe(
        debounceTime(300),
        take(1),
        tap((game: NextGameResponse) => {
          if (game.outcome) {
            this.eventsService.updateEvent(game);
            this.eventsService.updateStatistics();
            this.getNewGame();
          } else {
            setTimeout(() => {
              this.getGameResultById(id);
            }, 300);
          }
        }),
      )
      .subscribe();
  }
}
