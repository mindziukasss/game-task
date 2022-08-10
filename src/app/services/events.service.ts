import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, EMPTY } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { take, tap, catchError } from 'rxjs/operators';
import { Statistics, StatisticsService } from './statistics.service';

const NEXT_GAME_URL = 'https://dev-games-backend.advbet.com/v1/ab-roulette/1/nextGame'
const GET_GAME_URL = 'https://dev-games-backend.advbet.com/v1/ab-roulette/1/game'

export interface NextGameResponse {
  uuid: string;
  id: number;
  startTime: string;
  startDelta: number;
  startDeltaUs: number;
  fakeStartDelta: number;
  duration: number;
  result: number;
  outcome: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private gameEventsSubject: BehaviorSubject<NextGameResponse[]> = new BehaviorSubject<NextGameResponse[]>([]);
  events: Observable<NextGameResponse[]> = this.gameEventsSubject.asObservable();

  private gameStatsSubject: BehaviorSubject<Statistics[]> = new BehaviorSubject<Statistics[]>([]);
  gameStatistics: Observable<Statistics[]> = this.gameStatsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private statisticsService: StatisticsService
  )
  {}

  getEvents(): Observable<NextGameResponse>
  {
    return this.http.get<NextGameResponse>(NEXT_GAME_URL);
  }

  addNewGameEvent(newEvent: NextGameResponse): void
  {
    const currentEvents: NextGameResponse[] = this.gameEventsSubject.getValue();
    currentEvents.push(newEvent);
    this.gameEventsSubject.next(currentEvents);
  }

  getGameById(id: number): Observable<NextGameResponse>
  {
    return this.http.get<NextGameResponse>(`${GET_GAME_URL}/${id}`);
  }

  updateEvent(newEvent: NextGameResponse): void
  {
    const currentEvents: NextGameResponse[] = this.gameEventsSubject.getValue();
    const index = currentEvents.findIndex((event: NextGameResponse) => event.id === newEvent.id);
    if (index >= 0) {
      currentEvents[index] = newEvent;
      this.gameEventsSubject.next(currentEvents);
    }
  }

  updateStatistics(): void
  {
    this.statisticsService.getStatistics()
      .pipe(
        take(1),
        tap((stats: Statistics[]) => this.gameStatsSubject.next(stats)),
        catchError(_err => EMPTY)
      )
      .subscribe();
  }
}
