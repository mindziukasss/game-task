import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, EMPTY } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import { LogsService } from './logs.service';
import { links } from '../../app/links';

export interface Parts {
  color: string;
  positionToId: number;
  result: string;
}

export interface GameData {
  name: string;
  slots: Parts[];
}

interface Config {
  name: string;
  colors: string[];
  positionToId: number[];
  results: string[];
  slots: number;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  // @ts-ignore
  private confSubject: BehaviorSubject<GameData> = new BehaviorSubject(null);
  config: Observable<GameData> = this.confSubject.asObservable();

  constructor(
    private http: HttpClient,
    private logsService: LogsService
  ) {}

  getConfiguration(): void
  {
    this.getConfig()
      .pipe(
        take(1),
        tap((response: Config) => {
          const newGameData: GameData = {
            name: response.name,
            slots: this.getParts(response)
          };
          this.updateConfig(newGameData);
        }),
        catchError(_err => EMPTY)
      )
      .subscribe();
  }

  getConfig(): Observable<Config>
  {
    this.logsService.updateLogs('GET .../configuration');
    return this.http.get<Config>(links.CONFIGURATION_URL);
  }

  updateConfig(data: GameData): void
  {
    this.confSubject.next(data);
  }

  private getParts(data: Config): Parts[]
  {
    this.getColorsAndNumbers(data);
    const result: Parts[] = [];
    data.positionToId.forEach((value: any, index: any) => {
      result[index] = ({positionToId: value, color: data.colors[value], result:index});
    });

    return result;
  }

  getColorsAndNumbers(data: any)
  {
    return Object.keys(data.colors).map((value) => {
      return {color: data.colors[value], positionToId: data.positionToId[value], result: data.results[value]}
    });
  }
}
