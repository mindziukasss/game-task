import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Statistics, StatisticsService } from './statistics.service';
import { LogsService } from './logs.service';
import { consts } from '../constants';
import { FormService } from './form.service';

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

  outcome!: number;

  private gameEventsSubject: BehaviorSubject<NextGameResponse[]> = new BehaviorSubject<NextGameResponse[]>([]);
  events: Observable<NextGameResponse[]> = this.gameEventsSubject.asObservable();

  private gameStatsSubject: BehaviorSubject<Statistics[]> = new BehaviorSubject<Statistics[]>([]);
  gameStatistics: Observable<Statistics[]> = this.gameStatsSubject.asObservable();

  private isLoadingSubject: Subject<boolean> = new Subject();
  loading: Observable<boolean> = this.isLoadingSubject.asObservable();

  constructor(
    private http: HttpClient,
    private statisticsService: StatisticsService,
    private logsService: LogsService,
    private formService: FormService,
  )
  {}

  getEvents(): Observable<NextGameResponse>
  {
    this.logsService.updateLogs('Checking for new game');
    this.logsService.updateLogs(`GET .../stats?limit=`+ consts.LIMIT);
    return this.http.get<NextGameResponse>(this.formService.getBaseUrl() + '/' + consts.NEXT_GAME);
  }

  addNewGameEvent(newEvent: NextGameResponse): void
  {
    this.logsService.updateLogs('Get .../nextGame');
    const currentEvents: NextGameResponse[] = this.gameEventsSubject.getValue();
    currentEvents.push(newEvent);
    this.gameEventsSubject.next(currentEvents);
  }

  getGameById(id: number): Observable<NextGameResponse>
  {
    this.logsService.updateLogs('Get .../game/' + id);
    return this.http.get<NextGameResponse>(`${this.formService.getBaseUrl() + '/' + consts.GAME}/${id}`);
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

  gameStatus(): void
  {
    this.isLoadingSubject.next(true);
  }

  changeGameStatus(): void
  {
    this.isLoadingSubject.next(false);
    this.statisticsService.updateStats();
  }

  // @ts-ignore
  lastNumber(game: NextGameResponse[]): number
  {
    if (game.length > 1) {
      const number = Number(game[game.length - 2].outcome);
      this.outcome = number;
      return number;
    }
  }
}
