import { Injectable } from '@angular/core';
import { Observable,BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { take, tap } from 'rxjs/operators';

const STATISTICS_URL = 'https://dev-games-backend.advbet.com/v1/ab-roulette/1/stats'
const GAME_LIMIT = 200;

export interface Statistics {
  result: number;
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  private gameStatsSubject: BehaviorSubject<Statistics[]> = new BehaviorSubject<Statistics[]>([]);
  gameStatistics: Observable<Statistics[]> = this.gameStatsSubject.asObservable();

  constructor(
    private http: HttpClient,
  ) { }

  getStatistics():  Observable<Statistics[]> {
    return this.http.get<Statistics[]>(STATISTICS_URL, {
      params: new HttpParams()
        .set('limit', GAME_LIMIT.toString())
    });
  }

  updateStats(): void {
    this.getStatistics()
      .pipe(
        take(1),
        tap((stats: Statistics[]) => this.gameStatsSubject.next(stats)),
      )
      .subscribe();
  }
}
