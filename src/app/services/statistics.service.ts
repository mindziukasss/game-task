import { Injectable } from '@angular/core';
import { Observable,BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { take, tap } from 'rxjs/operators';
import { FormService } from './form.service';
import { consts } from '../constants';

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
    private formService: FormService,
  ) {}


  private getStatistics():  Observable<Statistics[]>
  {
    return this.http.get<Statistics[]>(this.formService.getBaseUrl() + '/' + consts.STATISTICS, {
      params: new HttpParams()
        .set('limit', GAME_LIMIT.toString())
    });
  }

  updateStats(): void
  {
    this.getStatistics()
      .pipe(take(1),
        tap((stats: Statistics[]) => this.gameStatsSubject.next(stats)),
        )
      .subscribe();
  }
}
